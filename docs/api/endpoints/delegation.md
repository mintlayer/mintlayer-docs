---
title: "Delegations"
description: "Delegation lookup endpoint of the Mintlayer indexer API."
sidebar_position: 6
---

# Delegation endpoints

## GET /delegation/\{id\}

Returns a single delegation by its ID (`mdelg1...`):

```bash
curl https://api-server.mintlayer.org/api/v2/delegation/mdelg1zf3l695cfaa0vldfc3fv4q65f6n30w832jkptwgfry3du63hx9gq42t3f0
```

```json
{
  "balance": { "atoms": "14392100000000000", "decimal": "143921" },
  "creation_block_height": 684546,
  "next_nonce": 0,
  "pool_id": "mpool18qt05uxz52fme32jxx5r64h5tlkxk9m6kw6lq84jezxpqr853x8sdat9x4",
  "spend_destination": "mtc1q9v58t88cz7ptsu885csel4sf5x7y4mn9vl9uxmf"
}
```

- `pool_id` is the pool the delegation currently points to.
- `spend_destination` is where withdrawn funds are sent.
- `next_nonce` protects delegation switches against replay.

Delegations are created and switched between pools through the wallet (see [delegation commands](../../wallet/cli/commands/staking/delegation-create-command-guide.md) and the [staking guide](../../wallet/guides/managing-a-staking-pool.md)).

## Go SDK

```go
delg, err := client.Indexer.GetDelegation(ctx, delegationID)   // GET /delegation/:id
```

See the [indexer client reference](../../build/sdks/go/indexer.md#pools-and-delegations).
