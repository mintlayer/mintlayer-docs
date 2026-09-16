---
title: "Fee rate"
description: "Mempool fee rate estimation endpoint of the Mintlayer indexer API."
sidebar_position: 11
---

# Fee rate endpoints

## GET /feerate

Returns the estimated fee rate needed for a transaction to be included in the most recent blocks, based on mempool state:

```bash
curl https://api-server.mintlayer.org/api/v2/feerate
```

```json
"100000000000"
```

The result is a JSON string: atoms per kilobyte (here 1000 ML per kB). There is no required fee for block inclusion in Mintlayer, but transactions paying below the current estimate may take longer to be picked up by block producers.

### Query parameters

| Parameter | Default | Description |
| --------- | ------- | ----------- |
| `in_top_x_mb` | `5` | Base the estimate on the highest-paying transactions that fill the top X megabytes of the mempool |

```bash
curl "https://api-server.mintlayer.org/api/v2/feerate?in_top_x_mb=1"
```

The value is cached server-side for 30 seconds; repeated calls within the window return the cached estimate.

## Go SDK

```go
feerate, err := client.Indexer.GetFeeRate(ctx, 5)   // GET /feerate
```

See the [indexer client reference](../../build/sdks/go/indexer.md).
