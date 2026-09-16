---
title: "Staking and Delegation"
description: "Run a staking pool or delegate to one with the Go SDK: pool lifecycle, delegations, indexer reads, and manual transaction building."
sidebar_position: 4
---

# Staking and Delegation

The Go SDK covers both sides of staking: operating a pool (creation, block production, decommissioning) and delegating to one. The JavaScript SDK covers the delegator side only; see the [JavaScript version](../javascript/staking.md). The wallet-cli version, with the underlying concepts (pledge, cost per block, margin ratio, decommission key), is [Managing a staking pool](../cli/managing-a-staking-pool.md).

The reward split: the staker receives `cost_per_block + margin × (block_reward − cost_per_block)`; delegators split the remainder proportionally.

## Creating a pool

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

`MarginRatioPerThousand` is expressed in thousandths (`"100"` = 10%, `"50"` = 5%, `"1000"` = 100%). `CostPerBlock` is a flat atom amount deducted from rewards before the margin split.

## Operating the pool

```go
err = wc.StartStaking(ctx, 0)                    // begin producing blocks
status, _ := wc.GetStakingStatus(ctx, 0)         // "Staking" | "NotStaking"
err = wc.StopStaking(ctx, 0)                     // stop producing; pool stays alive

pools, _ := wc.ListOwnedPools(ctx, 0)
for _, p := range pools {
    fmt.Printf("pool %s  pledge=%s  balance=%s\n", p.PoolID, p.Pledge.Atoms, p.Balance.Atoms)
}

_, err = wc.DecommissionStakePool(ctx, wallet.DecommissionParams{
    Account: 0, PoolID: "mpool1...", OutputAddress: returnAddr,
})
```

`StopStaking` pauses block production; `DecommissionStakePool` shuts the pool down and returns the pledge to `OutputAddress` after maturity. Delegators must withdraw separately.

## Delegating

Create the delegation, then fund it (waiting for the creation transaction to confirm in between):

```go
createResult, err := wc.CreateDelegation(ctx, wallet.CreateDelegationParams{
    Account: 0,
    Address: ownerAddr, // address that can withdraw
    PoolID:  "mpool1...",
})
fmt.Printf("delegation id: %s\n", createResult.DelegationID)

_, err = wc.DelegateStaking(ctx, wallet.DelegateParams{
    Account:      0,
    Amount:       wallet.Amount{Atoms: "10000000000000"}, // 100 ML
    DelegationID: createResult.DelegationID,
})
```

Multiple stakes to the same delegation accumulate. Withdrawing sends the coins to `Address` after the consensus lock period:

```go
_, err = wc.WithdrawFromDelegation(ctx, wallet.WithdrawParams{
    Account: 0, Address: recipientAddr,
    Amount: wallet.Amount{Atoms: "5000000000000"}, // 50 ML
    DelegationID: "mdelg1...",
})

delegations, _ := wc.ListDelegations(ctx, 0)
```

## Reading state from the indexer

```go
import "github.com/mintlayer/go-sdk/indexer"

idx := indexer.New("http://127.0.0.1:3000")

pool, _ := idx.GetPool(ctx, "mpool1...")
fmt.Printf("staker: %s  delegations: %s\n", pool.StakerBalance.Decimal, pool.DelegationsBalance.Decimal)

count, _ := idx.GetPoolBlockStats(ctx, "mpool1...", time.Now().Add(-24*time.Hour), time.Now())

delegation, _ := idx.GetDelegation(ctx, "mdelg1...")
fmt.Printf("pool: %s  balance: %s  nonce: %d\n", delegation.PoolID, delegation.Balance.Decimal, delegation.NextNonce)
```

To estimate rewards: pool block stats for a time range, the pool's `cost_per_block` and margin from `GetPool`, and your delegation's share of the total pool balance.

## Manual transaction building

The `wasm` package encodes delegation transactions without the wallet daemon: `EncodeOutputCreateDelegation`, `EncodeOutputDelegateStaking`, `EncodeInputForWithdrawFromDelegation` (nonce from the indexer's `NextNonce`). See [Go SDK: Staking](../../build/sdks/go/staking.md) for the full low-level flow, and [Composing UTXOs](utxo-composition.md) for the spend-and-recreate composition pattern.
