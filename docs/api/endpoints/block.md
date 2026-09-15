---
title: "Blocks"
description: "Block lookup endpoints of the Mintlayer indexer API: full block, header, reward, and transaction IDs."
sidebar_position: 2
---

# Block endpoints

All endpoints take a block ID (64-character hex). Replace `{id}` accordingly.

## GET /block/\{id\}

Returns the full block: header, consensus data, and body.

```bash
curl https://api-server.mintlayer.org/api/v2/block/7c337ff1a81fea9d2b394d251b7f115abbef53535cfc4ec32b994a63d0f17b77
```

```json
{
  "body": {
    "reward": [
      {
        "destination": "mptc1qgqq8jsnf5tvr22efc2pp797j5s70mza8stw3rglaunhgfeff05kmp8khyu54k",
        "pool_id": "mpool1950yszqq2cv8tqpy86u4wl6tzqp6acxvezr4hs2ryqdy4t5ta7js4s644y",
        "type": "ProduceBlockFromStake"
      }
    ],
    "transactions": []
  },
  "header": {
    "consensus_data": { "target": "0x000000000000000003bfc3000000..." },
    "merkle_root": "35d84b4f3fcf62e2a93eb614ccc2b2e8a77114ee52d62ec38adc98384967df00",
    "previous_block_id": "10afccafd0e4a75734713e3ecf081254b457e092a408dcd37659b21a9097fd9d",
    "timestamp": { "timestamp": 1789467559 },
    "witness_merkle_root": "35d84b4f3fcf62e2a93eb614ccc2b2e8a77114ee52d62ec38adc98384967df00"
  }
}
```

## GET /block/\{id\}/header

Returns just the block header (see `header` above).

## GET /block/\{id\}/reward

Returns the block reward as an array. Each entry has a `destination` (stake pool or block producer), an optional `pool_id`, and a `type` such as `ProduceBlockFromStake` or `Mint`.

```json
[
  {
    "destination": "mptc1qgqq8jsnf5tvr22efc2pp797j5s70mza8stw3rglaunhgfeff05kmp8khyu54k",
    "pool_id": "mpool1950yszqq2cv8tqpy86u4wl6tzqp6acxvezr4hs2ryqdy4t5ta7js4s644y",
    "type": "ProduceBlockFromStake"
  }
]
```

## GET /block/\{id\}/transaction-ids

Returns the IDs of the transactions included in the block (empty array for a block with no user transactions).

```json
["0d737672be3ab99eac02ad7bdbf22403f5c31369ce74774da2b438b74799a52c"]
```

## Go SDK

```go
block, err := client.Indexer.GetBlock(ctx, blockID)             // GET /block/:id
header, err := client.Indexer.GetBlockHeader(ctx, blockID)      // GET /block/:id/header
ids, err := client.Indexer.GetBlockTxIDs(ctx, blockID)          // GET /block/:id/transaction-ids
```

See the [indexer client reference](../../build/sdks/go/indexer.md#blocks).
