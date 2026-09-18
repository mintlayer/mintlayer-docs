---
title: "Staking and Delegation"
description: "Run a staking pool or delegate to one with the Rust SDK: wallet daemon flows, indexer reads, and manual encoders."
sidebar_position: 4
---

# Staking and Delegation

The Rust SDK covers both sides of staking: operating a pool and delegating to one. The same workflow exists for the [command line](../cli/managing-a-staking-pool.md) (concepts: pledge, cost per block, margin ratio, decommission key), [Go](../go/staking.md), and [JavaScript](../javascript/staking.md) (delegations only).

The reward split: the staker receives `cost_per_block + margin × (block_reward − cost_per_block)`; delegators share the remainder proportionally to their stake.

## Creating a pool

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

`margin_ratio_per_thousand` is the staker's cut in thousandths as a decimal string: `"100"` = 10%, `"50"` = 5%, `"1000"` = 100%.

## Operating the pool

```rust
c.start_staking(0).await?;
println!("{:?}", c.staking_status(0).await?); // Staking | NotStaking
c.stop_staking(0).await?; // stops production; the pool stays alive

for p in c.list_owned_pools(0).await? {
    println!("pool {} pledge={}", p.pool_id, p.pledge.atoms().unwrap_or_default());
}

// Shut the pool down; the pledge returns to output_address after maturity.
c.decommission_stake_pool(wallet::DecommissionParams {
    account: 0,
    pool_id: "mpool1...".into(),
    output_address: "mtc1q_return...".into(),
    options: TxOptions::default(),
}).await?;
```

`stop_staking` pauses block production without touching delegations or staked funds. Delegators must withdraw separately.

## Delegating

Create the delegation record first, then fund it (waiting for the creation transaction to confirm in between):

```rust
use mintlayer_sdk::wallet::{self, Amount, CreateDelegationParams, DelegateParams, TxOptions};

let created = c.create_delegation(CreateDelegationParams {
    account: 0,
    address: "mtc1q_owner...".into(),   // address that can withdraw
    pool_id: "mpool1...".into(),
    options: TxOptions::default(),
}).await?;
println!("delegation id: {}", created.delegation_id);

c.delegate_staking(DelegateParams {
    account: 0,
    amount: Amount::from_atoms(10_000_000_000_000), // 100 ML
    delegation_id: created.delegation_id,
    options: TxOptions::default(),
}).await?;
```

Multiple `delegate_staking` calls to the same delegation increase the stake. Withdrawals arrive after the consensus lock period:

```rust
use mintlayer_sdk::wallet::{Amount, TxOptions, WithdrawParams};

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

## Reading state from the indexer

```rust
let infos = idx.delegations("mtc1q_owner...").await?;   // by owner address
let delegation = idx.delegation("mdelg1...").await?;    // by delegation id
println!("next nonce: {}", delegation.next_nonce);      // string-encoded u64
```

## Manual transaction building

The `crypto` module encodes pool and delegation outputs/inputs for full-custody flows: `encode_output_create_stake_pool` with `encode_stake_pool_data`, `encode_output_delegate_staking`, `encode_input_for_withdraw_from_delegation` (nonce from the indexer), and `get_pool_id` / `get_delegation_id` to predict ids from the inputs. See [Staking](../../build/sdks/rust/staking.md) in the SDK reference for the full encoders.
