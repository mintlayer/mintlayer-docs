---
title: "Staking"
description: "Staking reference for the Mintlayer Rust SDK: pools, delegations, withdrawals, and manual encoders."
sidebar_position: 7
---

# Staking and delegations

Mintlayer uses Proof of Stake. ML holders earn staking rewards either by
running a **staking pool** directly (requires a node, a VRF key and a
pledge) or by **delegating** to an existing pool (no node required). The
wallet daemon manages both flows; the indexer provides read-only access to
pool and delegation state; the `crypto` module provides the low-level
encoders for manual transaction flows.

All amounts are atom counts — 1 ML = 100,000,000,000 atoms.

---

## Staking pools

### Creating a pool with the wallet daemon

```rust
use mintlayer_sdk::wallet::{self, Amount, CreatePoolParams, TxOptions};

let c = wallet::Client::new("http://127.0.0.1:3034");

let result = c.create_stake_pool(CreatePoolParams {
    account: 0,
    amount: Amount::from_atoms(40_000_000_000_000),          // pledge
    cost_per_block: Amount::from_atoms(100_000_000),         // flat fee per block
    margin_ratio_per_thousand: "100".into(),                 // 10% staker cut
    decommission_address: "mtc1q...".into(),
    staker_address: None,                                    // None = wallet-derived
    vrf_public_key: None,                                    // None = wallet-derived
    options: TxOptions::default(),
}).await?;
println!("pool tx id: {}", result.tx_id);
```

`margin_ratio_per_thousand` is the staker's cut of block rewards in
thousandths, as a decimal string: `"100"` = 10%, `"50"` = 5%,
`"1000"` = 100%. `cost_per_block` is deducted from rewards before the
margin split; delegators share the remainder proportionally to their
stake.

### Starting and stopping block production

```rust
c.start_staking(0).await?;
println!("{:?}", c.staking_status(0).await?); // Staking | NotStaking
c.stop_staking(0).await?;
```

`stop_staking` stops block production but does not decommission the pool;
delegations and staked funds remain untouched.

### Pool lifecycle

| Method | RPC method | Notes |
|--------|-----------|-------|
| `create_stake_pool(params) -> Result<SendResult, Error>` | `staking_create_pool` | Creates and funds the pool |
| `decommission_stake_pool(params) -> Result<SendResult, Error>` | `staking_decommission_pool` | Pledge returns to `output_address` after maturity |
| `list_owned_pools(account: u32) -> Result<Vec<OwnedPool>, Error>` | `staking_list_pools` | Pledge, balance, margin, cost per pool |
| `pool_balance(pool_id: &str) -> Result<Option<Amount>, Error>` | `staking_pool_balance` | |
| `start_staking(account: u32) / stop_staking(account: u32)` | `staking_start` / `staking_stop` | |
| `staking_status(account: u32) -> Result<StakingStatus, Error>` | `staking_status` | |

After decommissioning, the pledge is returned once the maturity period
passes. Delegators must withdraw their funds separately.

### Reading pool state from the indexer

```rust
use mintlayer_sdk::indexer::{Client, PoolListOpts, PoolSort};

let idx = Client::new("http://127.0.0.1:3000");

let pools = idx.list_pools(PoolListOpts {
    sort: Some(PoolSort::ByPledge), ..Default::default()
}).await?;
let pool = idx.pool("mpool1...").await?;
println!("staker {} delegated {}",
    pool.staker_balance.decimal, pool.delegations_balance.decimal);

let now = std::time::SystemTime::now()
    .duration_since(std::time::UNIX_EPOCH)?.as_secs() as i64;
let blocks = idx.pool_block_stats("mpool1...", now - 86_400, now).await?; // last 24h
let delegations = idx.pool_delegations("mpool1...").await?;
```

### Building a pool creation manually

```rust
use mintlayer_sdk::crypto::{self, Amount, Network};
use mintlayer_sdk::crypto::types::{TxInput, TxOutput};

let network = Network::Testnet;
let inputs: Vec<TxInput> = todo!(); // your UTXO inputs

// The pool id is derived from the hash of the first input.
let pool_id = crypto::get_pool_id(&inputs, network)?;

let pool_data = crypto::encode_stake_pool_data(
    Amount::from_atoms(40_000_000_000_000), // pledge (value)
    "mtc1q_staker...",                      // staker address
    "mtc1q_vrf_public_key...",              // bech32 VRF public key
    "mtc1q_decommission...",                // decommission destination
    100,                                    // margin ratio per thousand
    Amount::from_atoms(100_000_000),        // cost per block
    network,
)?;
let output: TxOutput =
    crypto::encode_output_create_stake_pool(&pool_id, pool_data, network)?;
```

The VRF public key is a bech32 addressable object; derive one from
`mintlayer-core`'s VRF key generation or let the wallet daemon do it
(`vrf_public_key: None`).

---

## Delegations

A delegation id is tied to a pool and an owner address. Create the
delegation record first, then fund it.

### Creating and funding with the wallet daemon

```rust
use mintlayer_sdk::wallet::{self, Amount, CreateDelegationParams, DelegateParams, TxOptions};

let c = wallet::Client::new("http://127.0.0.1:3034");

// Step 1: create the delegation.
let created = c.create_delegation(CreateDelegationParams {
    account: 0,
    address: "mtc1q_owner...".into(),   // address that can withdraw
    pool_id: "mpool1...".into(),
    options: TxOptions::default(),
}).await?;
println!("delegation id: {}", created.delegation_id);

// Step 2: fund it (wait for the creation tx to confirm first).
c.delegate_staking(DelegateParams {
    account: 0,
    amount: Amount::from_atoms(10_000_000_000_000), // 100 ML
    delegation_id: created.delegation_id,
    options: TxOptions::default(),
}).await?;
```

Multiple `delegate_staking` calls to the same delegation increase the
stake.

### Withdrawing and listing

```rust
use mintlayer_sdk::wallet::{WithdrawParams, Amount, TxOptions};

c.withdraw_from_delegation(WithdrawParams {
    account: 0,
    address: "mtc1q_recipient...".into(),
    amount: Amount::from_atoms(5_000_000_000_000), // 50 ML
    delegation_id: "mdelg1...".into(),
    options: TxOptions::default(),
}).await?;

for d in c.list_delegations(0).await? {
    println!("{} pool={} balance={}", d.delegation_id, d.pool_id, d.balance.atoms().unwrap_or_default());
}
```

Withdrawn funds arrive at `address` after the consensus lock period.

### Reading delegation state from the indexer

```rust
let infos = idx.delegations("mtc1q_owner...").await?;       // by owner address
let delegation = idx.delegation("mdelg1...").await?;        // by delegation id
println!("next nonce: {}", delegation.next_nonce);          // string-encoded u64
```

### Building delegation transactions manually

```rust
use mintlayer_sdk::crypto::{self, Amount, Network};
use mintlayer_sdk::crypto::types::TxInput;

let network = Network::Testnet;
let inputs: Vec<TxInput> = todo!(); // your UTXO inputs

// Predict the delegation id before broadcasting.
let delegation_id = crypto::get_delegation_id(&inputs, network)?;

// Create the delegation record.
let create = crypto::encode_output_create_delegation("mpool1...", "mtc1q_owner...", network)?;

// Fund it.
let fund = crypto::encode_output_delegate_staking(
    Amount::from_atoms(10_000_000_000_000), &delegation_id, network)?;

// Withdraw: the nonce must match the indexer's next_nonce.
let withdraw_input = crypto::encode_input_for_withdraw_from_delegation(
    "mdelg1...",
    Amount::from_atoms(5_000_000_000_000),
    0, // delegation.next_nonce
    network,
)?;
```

The withdrawal output is a `LockThenTransfer` (see
[crypto.md](crypto.md) timelocks) that releases after the lock period.

---

## Rewards and effective balance

The staker receives
`cost_per_block + margin_ratio_per_thousand / 1000 * (block_reward - cost_per_block)`;
delegators split the remainder proportionally to their stake. To estimate
rewards: pool block stats for a time range (`pool_block_stats`), the
pool's cost and margin (`pool`), and your delegation's share
(`delegation`).

Consensus caps a pool's effective weight by its pledge:

```rust
use mintlayer_sdk::crypto::{self, Amount, Network};

let network = Network::Testnet;
let effective = crypto::effective_pool_balance(
    network,
    Amount::from_atoms(40_000_000_000_000), // pledge
    Amount::from_atoms(1_000_000_000_000_000), // total pool balance
)?;
```

After decommissioning, funds become spendable after
`staking_pool_spend_maturity_block_count(current_block_height, network)`
blocks.
