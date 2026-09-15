---
title: "Chain"
description: "Genesis, tip, and block-ID-by-height endpoints of the Mintlayer indexer API."
sidebar_position: 1
---

# Chain endpoints

## GET /chain/genesis

Returns the genesis block details.

```bash
curl https://api-server.mintlayer.org/api/v2/chain/genesis
```

```json
{
  "block_id": "2cf01f196066bb6f3a4856deb7999294ff520f633fe48e118e8044390e409870",
  "genesis_message": "In a free-market economy, every individual should be free to ...",
  "timestamp": { "timestamp": 1693504760 }
}
```

## GET /chain/tip

Returns the current chain tip: height and block ID.

```bash
curl https://api-server.mintlayer.org/api/v2/chain/tip
```

```json
{
  "block_height": 686593,
  "block_id": "7c337ff1a81fea9d2b394d251b7f115abbef53535cfc4ec32b994a63d0f17b77"
}
```

## GET /chain/\{height\}

Returns the block ID at a given mainchain height. The ID is returned as a bare JSON string.

```bash
curl https://api-server.mintlayer.org/api/v2/chain/686593
```

```json
"7c337ff1a81fea9d2b394d251b7f115abbef53535cfc4ec32b994a63d0f17b77"
```

Returns `null` if no block exists at that height (e.g. height above the tip or an orphaned height).

## Go SDK

```go
tip, err := client.Indexer.GetTip(ctx)          // GET /chain/tip
id, err := client.Indexer.GetBlockIDAtHeight(ctx, 686593)  // GET /chain/:height
```

See the [indexer client reference](../../build/sdks/go/indexer.md#chain).
