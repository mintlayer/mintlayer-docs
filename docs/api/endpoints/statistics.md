---
title: "Statistics"
description: "Supply statistics endpoints of the Mintlayer indexer API: coin and per-token."
sidebar_position: 7
---

# Statistics endpoints

## GET /statistics/coin

Returns ML supply statistics:

```bash
curl https://api-server.mintlayer.org/api/v2/statistics/coin
```

```json
{
  "burned": { "atoms": "451000000000000", "decimal": "4510" },
  "circulating_supply": { "atoms": "51095609900000000000", "decimal": "510956099" },
  "preminted": { "atoms": "40000000000000000000", "decimal": "400000000" },
  "staked": { "atoms": "18923740491080455517", "decimal": "189237404.91080455517" }
}
```

All amounts follow the [atoms/decimal convention](../conventions.md#amounts).

## GET /statistics/token/\{id\}

Returns the same statistics for a specific token, identified by its bech32 token ID (`mmltk1...`):

```json
{
  "burned": { "atoms": "0", "decimal": "0" },
  "circulating_supply": { "atoms": "0", "decimal": "0" },
  "preminted": { "atoms": "0", "decimal": "0" },
  "staked": { "atoms": "0", "decimal": "0" },
  "total_supply": { "atoms": "0", "decimal": "0" }
}
```

## Go SDK

```go
coin, err := client.Indexer.GetCoinStatistics(ctx)        // GET /statistics/coin
tok, err := client.Indexer.GetTokenStatistics(ctx, id)    // GET /statistics/token/:id
```

See the [indexer client reference](../../build/sdks/go/indexer.md#statistics).
