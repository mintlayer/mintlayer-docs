---
title: "staking-decommission-pool"
sidebar_position: 79
---

Decommission a staking pool, given its id. This assumes that the decommission key is owned by the selected account in this wallet.

Decommissioning returns the pledged amount and all accumulated staking rewards to the specified output address.

## Usage

```
staking-decommission-pool <POOL_ID> <OUTPUT_ADDRESS>
```

## Arguments

- **`<POOL_ID>`**: The id of the pool to decommission. The decommission key must be owned by the selected account in this wallet.

- **`<OUTPUT_ADDRESS>`**: The address that will receive the staker's balance (both pledge and proceeds from staking).

## Notes

If the decommission key is held in a separate (e.g. cold) wallet, use `staking-decommission-pool-request` instead to create an unsigned decommission transaction, then sign it with the cold wallet.

## Related

- [`staking-decommission-pool-request`](staking-decommission-pool-request-command-guide.md): Create a decommission request for signing by another wallet.
- [`staking-create-pool`](staking-create-pool-command-guide.md): Create a staking pool.
- [`staking-list-pools`](staking-list-pools-command-guide.md): List your pools.
