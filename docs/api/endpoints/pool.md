---
title: "Pools"
description: "Staking pool endpoints of the Mintlayer indexer API: list, lookup, block stats, and delegations."
sidebar_position: 5
---

# Pool endpoints

## GET /pool

Lists staking pools, with [pagination](../conventions.md#pagination).

```bash
curl "https://api-server.mintlayer.org/api/v2/pool?items=1"
```

```json
[
  {
    "cost_per_block": { "atoms": "0", "decimal": "0" },
    "decommission_destination": "mtc1q8vjgka6sv2wytvfnhvt799re8e49hwq9sxjamcz",
    "delegations_balance": { "atoms": "14392100000000000", "decimal": "143921" },
    "margin_ratio_per_thousand": "100%",
    "pool_id": "mpool18qt05uxz52fme32jxx5r64h5tlkxk9m6kw6lq84jezxpqr853x8sdat9x4",
    "staker_balance": { "atoms": "30067818500000000", "decimal": "300678.185" },
    "vrf_public_key": "mvrfpk1qpj0wly5ku4v4ccmu53p5h0w4dqrqufru57kpsk0fr0avaayn6gzs8dryws"
  }
]
```

- `margin_ratio_per_thousand` is the pool's commission in per-mille (e.g. `100%` means 10%... represented as per-thousand of the reward).
- `staker_balance` is the pool founder's pledge; `delegations_balance` is the total delegated by other users.

## GET /pool/\{id\}

Returns a single pool by ID (same shape as the list entries).

## GET /pool/\{id\}/block-stats

Returns the pool's block production counts within a time range. Both bounds are required Unix timestamps (seconds):

```bash
curl "https://api-server.mintlayer.org/api/v2/pool/mpool18qt05uxz52fme32jxx5r64h5tlkxk9m6kw6lq84jezxpqr853x8sdat9x4/block-stats?from=1757800000&to=1757900000"
```

```json
{ "block_count": 0 }
```

## GET /pool/\{id\}/delegations

Lists the delegations to this pool, with [pagination](../conventions.md#pagination):

```json
[
  {
    "balance": { "atoms": "14392100000000000", "decimal": "143921" },
    "creation_block_height": 684546,
    "delegation_id": "mdelg1zf3l695cfaa0vldfc3fv4q65f6n30w832jkptwgfry3du63hx9gq42t3f0",
    "next_nonce": 0,
    "spend_destination": "mtc1q9v58t88cz7ptsu885csel4sf5x7y4mn9vl9uxmf"
  }
]
```

## Go SDK

```go
pools, err := client.Indexer.ListPools(ctx, indexer.PageOpts{Items: 10})   // GET /pool
pool, err := client.Indexer.GetPool(ctx, poolID)                           // GET /pool/:id
stats, err := client.Indexer.GetPoolBlockStats(ctx, poolID, from, to)      // .../block-stats
delgs, err := client.Indexer.GetPoolDelegations(ctx, poolID, opts)         // .../delegations
```

See the [indexer client reference](../../build/sdks/go/indexer.md#pools-and-delegations) and the [staking guide](../../build/sdks/go/staking.md).
