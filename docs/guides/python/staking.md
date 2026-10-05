---
title: "Staking and Delegation"
description: "Run a staking pool or delegate to one with the Python SDK: wallet daemon flows, indexer reads, and wasm encoders."
sidebar_position: 4
---

# Staking and Delegation

The Python SDK covers both sides of staking: operating a pool and delegating to one. The same workflow exists for the [command line](../cli/managing-a-staking-pool.md) (concepts: pledge, cost per block, margin ratio, decommission key), [Go](../go/staking.md), [JavaScript](../javascript/staking.md) (delegations only), and [Rust](../rust/staking.md).

The reward split: the staker receives `cost_per_block + margin × (block_reward − cost_per_block)`; delegators share the remainder proportionally to their stake.

## Creating a pool

```python
from mintlayer.wallet import Amount, Client, CreatePoolParams

wc = Client("http://127.0.0.1:3034")

result = wc.create_stake_pool(
    CreatePoolParams(
        account=0,
        amount=Amount(atoms="40000000000000"),   # minimum pledge
        cost_per_block=Amount(atoms="100000000"),  # flat fee per block
        margin_ratio_per_thousand="100",  # 10% staker cut
        decommission_address=decommission_addr,
        # staker_address and vrf_public_key default to wallet-managed keys
    )
)
print(f"tx id: {result.tx_id}")
```

`margin_ratio_per_thousand` is the staker's cut of block rewards expressed in thousandths as a **string**: `"100"` = 10%, `"50"` = 5%, `"1000"` = 100%. The pool ID can be predicted before broadcasting with `wasm.get_pool_id`.

## Operating the pool

```python
wc.start_staking(0)  # begin producing blocks

status = wc.get_staking_status(0)  # Staking | NotStaking
wc.stop_staking(0)  # stops production; the pool stays alive

pools = wc.list_owned_pools(0)
balance = wc.get_pool_balance(0, "mpool1...")

wc.decommission_stake_pool(
    DecommissionParams(
        account=0,
        pool_id="mpool1...",
        output_address=return_addr,
    )
)
```

`stop_staking` pauses block production without touching delegations or staked funds; `decommission_stake_pool` shuts the pool down and returns the pledge to `output_address` after maturity. Delegators must withdraw separately.

## Delegating

Create the delegation record first, then fund it (waiting for the creation transaction to confirm in between):

```python
from mintlayer.wallet import Amount, CreateDelegationParams, DelegateParams

create_result = wc.create_delegation(
    CreateDelegationParams(
        account=0,
        address=owner_addr,  # address that can withdraw funds
        pool_id="mpool1...",
    )
)
print(f"delegation id: {create_result.delegation_id}")

wc.delegate_staking(
    DelegateParams(
        account=0,
        amount=Amount(atoms="10000000000000"),  # 100 ML
        delegation_id=create_result.delegation_id,
    )
)
```

Multiple `delegate_staking` transactions to the same delegation increase the stake. Withdrawals arrive after the consensus lock period:

```python
from mintlayer.wallet import WithdrawParams

wc.withdraw_from_delegation(
    WithdrawParams(
        account=0,
        address=recipient_addr,
        amount=Amount(atoms="5000000000000"),  # 50 ML
        delegation_id="mdelg1...",
    )
)

delegations = wc.list_delegations(0)
```

## Reading state from the indexer

```python
pool = idx.get_pool("mpool1...")
print(f"staker: {pool.staker_balance.decimal}  delegations: {pool.delegations_balance.decimal}")

delegation = idx.get_delegation("mdelg1...")
print(f"next nonce: {delegation.next_nonce}")
```

## Manual transaction building

The `wasm` module encodes pool and delegation outputs/inputs for full-custody flows: `encode_output_create_stake_pool` with `encode_stake_pool_data`, `encode_output_delegate_staking`, `encode_input_for_withdraw_from_delegation` (nonce from the indexer), and `get_pool_id` / `get_delegation_id` to predict ids from the inputs. See [Staking](../../build/sdks/python/staking.md) in the SDK reference for the full encoders.
