---
title: "Staking"
description: "Staking reference for the Mintlayer Python SDK: pools, delegations, withdrawals, and manual encoders."
sidebar_position: 8
---

# Staking and delegations

Mintlayer uses Proof of Stake. ML holders can earn staking rewards by either:

- Running a **staking pool** directly (requires a node, VRF key, and pledge)
- **Delegating** to an existing pool (no node required)

The wallet daemon manages both flows. The indexer provides read-only access to
pool and delegation state. The `mintlayer.wasm` module provides low-level
primitives for manual transaction flows.

---

## Staking pools (wallet daemon)

### Creating a pool

```python
from mintlayer.wallet import Amount, Client, CreatePoolParams

wc = Client("http://127.0.0.1:3034")

result = wc.create_stake_pool(
    CreatePoolParams(
        account=0,
        amount=Amount(atoms="40000000000000"),  # minimum pledge
        cost_per_block=Amount(atoms="100000000"),  # flat fee per block
        margin_ratio_per_thousand="100",  # 10% staker cut
        decommission_address=decommission_addr,
        # staker_address and vrf_public_key default to wallet-managed keys
        # when None (sent as JSON null)
    )
)
print(f"tx id: {result.tx_id}")
```

`margin_ratio_per_thousand` is the staker's cut of block rewards expressed in
thousandths, as a **string**: `"100"` = 10%, `"50"` = 5%, `"1000"` = 100%.

`cost_per_block` is a flat atom amount deducted from rewards before the margin
split. Delegators receive the remainder proportionally to their stake.

The result is a `SendResult(tx_id, fees, broadcasted)` — the pool ID can be
predicted before broadcasting with `get_pool_id` (see below).

### Starting and stopping block production

```python
wc.start_staking(0)  # account 0

status = wc.get_staking_status(0)
print(status)  # StakingStatus.ACTIVE ("Staking") or StakingStatus.INACTIVE ("NotStaking")

wc.stop_staking(0)
```

`stop_staking` stops block production but does not decommission the pool.
Delegations and staked funds remain untouched.

### Listing owned pools

```python
pools = wc.list_owned_pools(0)
for p in pools:
    print(f"pool {p.pool_id}  pledge={p.pledge.atoms}  balance={p.balance.atoms}")
```

### Pool balance

```python
balance = wc.get_pool_balance(0, "mpool1...")  # Amount
```

Quirk: matching the daemon route, the `account` argument is accepted for API
consistency but **not sent on the wire** — the route only uses `pool_id`.

### Decommissioning a pool

```python
from mintlayer.wallet import DecommissionParams

result = wc.decommission_stake_pool(
    DecommissionParams(
        account=0,
        pool_id="mpool1...",
        output_address=return_addr,
    )
)
```

After decommissioning, the pledge is returned to `output_address` after the
maturity period. Delegators must withdraw their funds separately.

### Reading pool state from the indexer

```python
from datetime import datetime, timedelta

from mintlayer.indexer import Client, PoolListOpts

idx = Client("http://127.0.0.1:3000")

# All pools sorted by pledge size
pools = idx.list_pools(PoolListOpts(sort="by_pledge"))

# Single pool
pool = idx.get_pool("mpool1...")
print(f"staker balance: {pool.staker_balance.decimal}")
print(f"delegations:    {pool.delegations_balance.decimal}")

# Blocks produced in the last 24 hours
count = idx.get_pool_block_stats(
    "mpool1...",
    datetime.now() - timedelta(hours=24),
    datetime.now(),
)

# All delegations in the pool
delegations = idx.get_pool_delegations("mpool1...")
```

---

## Delegations (wallet daemon)

### Creating a delegation

A delegation ID is tied to a pool and an owner address. You create the
delegation record first, then fund it separately.

```python
from mintlayer.wallet import Amount, CreateDelegationParams, DelegateParams

# Step 1: create the delegation
create_result = wc.create_delegation(
    CreateDelegationParams(
        account=0,
        address=owner_addr,  # address that can withdraw funds
        pool_id="mpool1...",
    )
)
print(f"delegation id: {create_result.delegation_id}")

# Step 2: fund the delegation (wait for the creation tx to confirm first)
delegate_result = wc.delegate_staking(
    DelegateParams(
        account=0,
        amount=Amount(atoms="10000000000000"),  # 100 ML
        delegation_id=create_result.delegation_id,
    )
)
```

You can send multiple `delegate_staking` transactions to the same delegation to
increase your stake.

### Withdrawing from a delegation

```python
from mintlayer.wallet import WithdrawParams

result = wc.withdraw_from_delegation(
    WithdrawParams(
        account=0,
        address=recipient_addr,
        amount=Amount(atoms="5000000000000"),  # 50 ML
        delegation_id="mdelg1...",
    )
)
```

Withdrawn funds arrive at `address` after the lock period (determined by
consensus rules).

### Listing delegations

```python
delegations = wc.list_delegations(0)
for d in delegations:
    print(f"delegation {d.delegation_id}  pool={d.pool_id}  balance={d.balance.atoms}")
```

### Reading delegation state from the indexer

```python
# All delegations owned by an address
delegation_infos = idx.get_delegations("mtc1qowner...")

# Single delegation by ID
delegation = idx.get_delegation("mdelg1...")
print(f"pool:    {delegation.pool_id}")
print(f"balance: {delegation.balance.decimal}")
print(f"nonce:   {delegation.next_nonce}")
```

---

## Building delegation transactions manually

The `mintlayer.wasm` module provides the low-level primitives when you need to
build delegation transactions without the wallet daemon.

### Create a delegation

```python
from mintlayer.wasm import Client, Network

c = Client()
try:
    # Predict the delegation ID before broadcasting
    delegation_id_str = c.get_delegation_id(encoded_inputs, Network.MAINNET)

    # Encode the CreateDelegationId output
    create_deleg_output = c.encode_output_create_delegation(
        "mpool1...",
        owner_address,
        Network.MAINNET,
    )
finally:
    c.close()
```

### Fund a delegation

```python
delegate_output = c.encode_output_delegate_staking(
    Amount.from_atoms("10000000000000"),
    "mdelg1...",
    Network.MAINNET,
)
```

### Withdraw from a delegation

```python
# The nonce must match the current next_nonce from the indexer
delegation = idx.get_delegation("mdelg1...")

withdraw_input = c.encode_input_for_withdraw_from_delegation(
    "mdelg1...",
    Amount.from_atoms("5000000000000"),
    delegation.next_nonce,
    Network.MAINNET,
)

# The output receives the withdrawn coins after the lock period
withdraw_output = c.encode_output_lock_then_transfer(
    Amount.from_atoms("5000000000000"),
    recipient_address,
    lock,  # from encode_lock_for_block_count or similar
    Network.MAINNET,
)
```

Assemble, sign, and submit the resulting inputs/outputs exactly as in
[transactions.md](transactions.md).

---

## Manual pool creation

For full-custody pool creation, encode the pool parameters and wrap them in a
`CreateStakePool` output. `encode_stake_pool_data` takes the pool value
(pledge), the staker/VRF/decommission keys, the margin ratio, and the per-block
cost:

```python
from mintlayer.wasm import Amount, Network

pool_id = c.get_pool_id(encoded_inputs, Network.MAINNET)

pool_data = c.encode_stake_pool_data(
    value=Amount.from_atoms("40000000000000"),
    staker=staker_addr,
    vrf_public_key=vrf_key,
    decommission_key=decommission_addr,
    margin_ratio_per_thousand=100,  # int here (wallet daemon takes a string)
    cost_per_block=Amount.from_atoms("100000000"),
    network=Network.MAINNET,
)

pool_output = c.encode_output_create_stake_pool(pool_id, pool_data, Network.MAINNET)
```

Two helpers are useful when planning a pool:

```python
# Effective balance used in the slot lottery (diminishing returns for big pools)
eff = c.effective_pool_balance(Network.MAINNET, pledge_amount, pool_balance)

# Blocks a pool output must mature after decommission before funds are spendable
maturity = c.staking_pool_spend_maturity_block_count(tip.block_height, Network.MAINNET)
```

---

## Checking rewards

The indexer does not expose a rewards endpoint directly. To calculate staking
rewards:

1. Get pool block stats for a time range (`get_pool_block_stats`)
2. Get the pool's cost per block and margin ratio (`get_pool`)
3. Get your delegation's share of the total pool balance (`get_delegation`)

The staker receives `cost_per_block + margin_ratio_per_thousand/1000 *
(block_reward - cost_per_block)`. Delegators split the remainder
proportionally to their stake.

---

## Related

- [wallet.md](wallet.md) — wallet client reference
- [indexer.md](indexer.md) — pool/delegation read queries
- [wasm.md](wasm.md) — WASM encoding reference
- [transactions.md](transactions.md) — assembling and signing manual transactions
