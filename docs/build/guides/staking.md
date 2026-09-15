---
title: "Staking and Delegation (SDK)"
description: "Run a staking pool or delegate to one with the JavaScript and Go SDKs — the SDK equivalent of the wallet-cli staking guide."
sidebar_position: 4
---

# Staking and Delegation (SDK)

The SDK equivalent of [Managing a staking pool](../../wallet/guides/managing-a-staking-pool.md). Read that page (or the [staking chapter](../../whitepaper/1-blockchain-architecture.md) of the whitepaper) for the concepts:

- **Pool**: created by an operator with a minimum pledge of 40,000 ML/TML; produces blocks and earns rewards.
- **Cost per block**: flat fee deducted from rewards before any split.
- **Margin ratio**: the staker's percentage cut of what remains; delegators share the rest proportionally.
- **Delegation**: lets users stake to a pool without handing the operator any authority. A delegation id is created first, then funded.

The reward split: the staker receives `cost_per_block + margin × (block_reward − cost_per_block)`; delegators split the remainder.

## Creating a pool (Go)

Pool creation is currently covered by the **Go SDK** (the JS SDK supports the delegator side only):

```go
import "github.com/mintlayer/go-sdk/wallet"

wc := wallet.New("http://127.0.0.1:3034")

result, err := wc.CreateStakePool(ctx, wallet.CreatePoolParams{
    Account:                0,
    Amount:                 wallet.Amount{Atoms: "40000000000000"}, // 40,000 ML pledge
    CostPerBlock:           wallet.Amount{Atoms: "100000000"},
    MarginRatioPerThousand: "100", // 10% staker cut
    DecommissionAddress:    decommissionAddr,
    // StakerAddress / VRFPublicKey default to wallet-managed keys when nil
})
```

Operate the pool with the wallet client:

```go
err = wc.StartStaking(ctx, 0)                    // begin producing blocks
status, _ := wc.GetStakingStatus(ctx, 0)         // "Staking" | "NotStaking"
err = wc.StopStaking(ctx, 0)                     // stop producing; pool stays alive

pools, _ := wc.ListOwnedPools(ctx, 0)

_, err = wc.DecommissionStakePool(ctx, wallet.DecommissionParams{
    Account: 0, PoolID: "mpool1...", OutputAddress: returnAddr,
})
```

`StopStaking` pauses block production; `DecommissionStakePool` shuts the pool down and returns the pledge to `OutputAddress` after maturity. Delegators must withdraw separately.

## Delegating (JavaScript and Go)

### Create a delegation

**JavaScript**

```ts
await client.delegationCreate({
  pool_id: 'sp1...',
  destination: client.getAddresses().receiving[0],
});
```

**Go**

```go
createResult, err := wc.CreateDelegation(ctx, wallet.CreateDelegationParams{
    Account: 0,
    Address: ownerAddr, // address that can withdraw
    PoolID:  "mpool1...",
})
fmt.Printf("delegation id: %s\n", createResult.DelegationID)
```

### Stake

Wait for the delegation-creation transaction to confirm first.

**JavaScript**

```ts
await client.delegationStake({ delegation_id: 'd1...', amount: 100 });
// or stake straight to a pool id:
await client.delegationStake({ pool_id: 'sp1...', amount: 100 });
```

**Go**

```go
_, err = wc.DelegateStaking(ctx, wallet.DelegateParams{
    Account:      0,
    Amount:       wallet.Amount{Atoms: "10000000000000"}, // 100 ML
    DelegationID: createResult.DelegationID,
})
```

Multiple stakes to the same delegation accumulate.

### Withdraw

**JavaScript**

```ts
await client.delegationWithdraw({ delegation_id: 'd1...', amount: 50 });
```

**Go**

```go
_, err = wc.WithdrawFromDelegation(ctx, wallet.WithdrawParams{
    Account: 0, Address: recipientAddr,
    Amount: wallet.Amount{Atoms: "5000000000000"}, // 50 ML
    DelegationID: "mdelg1...",
})
```

Withdrawn funds arrive after the consensus lock period.

## Reading state

**JavaScript**: `client.getDelegations()` and `client.getDelegationsTotal()` for the connected addresses.

**Go** (indexer):

```go
import "github.com/mintlayer/go-sdk/indexer"

idx := indexer.New("http://127.0.0.1:3000")

pool, _ := idx.GetPool(ctx, "mpool1...")
fmt.Printf("staker: %s  delegations: %s\n", pool.StakerBalance.Decimal, pool.DelegationsBalance.Decimal)

delegation, _ := idx.GetDelegation(ctx, "mdelg1...")
fmt.Printf("pool: %s  balance: %s  nonce: %d\n", delegation.PoolID, delegation.Balance.Decimal, delegation.NextNonce)
```

## Manual transaction building

Both SDKs can build delegation transactions without the wallet daemon: the JS SDK `buildDelegationCreate` / `buildDelegationStake` / `buildDelegationWithdraw` methods ([Transactions](../sdks/javascript/transactions.md#manual-building)), and the Go `wasm` encoders (`EncodeOutputCreateDelegation`, `EncodeOutputDelegateStaking`, `EncodeInputForWithdrawFromDelegation`) — see [Go SDK: Staking](../sdks/go/staking.md) for the full low-level flow including nonce handling.
