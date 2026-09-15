---
title: "Tokens"
description: "Fungible token endpoints of the Mintlayer indexer API: list, lookup, per-token transactions, ticker lookup."
sidebar_position: 8
---

# Token endpoints

## GET /token

Lists fungible token IDs, with [pagination](../conventions.md#pagination). Entries are bare token-ID strings:

```bash
curl "https://api-server.mintlayer.org/api/v2/token?items=2"
```

```json
[
  "mmltk1q43gmfrsau2lnev65d56a4w02a70s7j6ccvc8jlx6twy2e75fa2q45h2wd",
  "mmltk1pncjq62qx93z67e9vx5vvsufglx4sc2hdyza9xapd00we4u3zuys6cmswt"
]
```

## GET /token/\{id\}

Returns the token's current data:

```bash
curl https://api-server.mintlayer.org/api/v2/token/mmltk1q43gmfrsau2lnev65d56a4w02a70s7j6ccvc8jlx6twy2e75fa2q45h2wd
```

```json
{
  "authority": "mmtc1q3v0hye8eg6vg7f7thmpy6y834u8h0r4as0hyax2",
  "circulating_supply": { "atoms": "0", "decimal": "0" },
  "frozen": false,
  "is_locked": false,
  "is_token_freezable": true,
  "is_token_unfreezable": null,
  "metadata_uri": { "hex": "697066733a2f2f..." },
  "next_nonce": 0,
  "number_of_decimals": 18,
  "token_ticker": "EXAMPLE",
  "total_supply": { "atoms": "1000000000000000000000", "decimal": "1000" }
}
```

- `metadata_uri` is returned hex-encoded; decode it for the URI string (typically `ipfs://...`).
- `authority` is the address holding the token authority key (freeze/mint/unmint/change-authority rights).
- See the [token guide](../../wallet/guides/issue-new-token.md) for the token lifecycle operations these fields reflect.

## GET /token/\{id\}/transactions

Lists transactions involving the token, with [pagination](../conventions.md#pagination). Each entry contains `tx_global_index` and `tx_id`:

```json
[
  {
    "tx_global_index": 1234567,
    "tx_id": "0d737672be3ab99eac02ad7bdbf22403f5c31369ce74774da2b438b74799a52c"
  }
]
```

> **Note:** as of September 2026, the production deployment returns `400 Bad request` for this endpoint. It works as documented when running `api-web-server` from current sources yourself.

## GET /token/ticker/\{ticker\}

Lists token IDs whose ticker matches (case-insensitive). Returns an array of token IDs; an empty array when the ticker is unknown:

```bash
curl https://api-server.mintlayer.org/api/v2/token/ticker/usdt
```

```json
[]
```

## Go SDK

```go
ids, err := client.Indexer.ListTokens(ctx, indexer.PageOpts{})     // GET /token
tok, err := client.Indexer.GetToken(ctx, tokenID)                    // GET /token/:id
txs, err := client.Indexer.GetTokenTransactions(ctx, tokenID, opts)  // GET /token/:id/transactions
ids, err := client.Indexer.FindTokensByTicker(ctx, "usdt")          // GET /token/ticker/:ticker
```

See the [indexer client reference](../../build/sdks/go/indexer.md#tokens-and-nfts).
