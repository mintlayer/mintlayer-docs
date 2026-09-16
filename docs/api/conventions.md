---
title: "Conventions"
description: "Conventions used across the Mintlayer indexer API: pagination, amounts, encodings, and errors."
sidebar_position: 1
---

# API Conventions

Behavior shared by all indexer API endpoints.

## Pagination

List endpoints accept two query parameters:

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `offset` | integer | `0` | Number of items to skip |
| `items` | integer | `10` | Page size, capped at `100` |

```bash
curl "https://api-server.mintlayer.org/api/v2/transaction?offset=0&items=20"
```

Invalid values (non-numeric, or `items` above 100) return a client error. The transaction list endpoint additionally accepts `offset_mode`:

| `offset_mode` | Behavior |
| ------------- | -------- |
| `legacy` (default) | Page over the index in storage order; newest pages can shift as new blocks arrive |
| `absolute` | Page over a stable, global transaction index (global index assigned at insert time) |

Use `absolute` when you need stable pagination (e.g. syncing all transactions); use the default for "recent activity" views.

## Amounts

All amounts are returned as an object with two representations:

```json
{"atoms": "148200000000", "decimal": "1.482"}
```

- `atoms` is the smallest unit (1 ML = 10^11 atoms), as a decimal string.
- `decimal` is the human-readable amount, as a string.

Both are strings to avoid losing precision in JSON number parsing. Always do arithmetic on `atoms`.

## Identifiers and encodings

| Kind | Format | Example |
| ---- | ------ | ------- |
| Block / transaction IDs | 64-character lowercase hex | `7c337ff1a81fea9d2b394d251b7f115abbef53535cfc4ec32b994a63d0f17b77` |
| Addresses | Bech32, network-prefixed | `mtc1q8n9u3g3aw4h40gsagxn7yw0jatdfe9xsuftnvur` |
| Token IDs | Bech32 (`mmltk1...` on mainnet) | `mmltk1q43gmfrsau2lnev65d56a4w02a70s7j6ccvc8jlx6twy2e75fa2q45h2wd` |
| Pool IDs | Bech32 (`mpool1...`) | `mpool18qt05uxz52fme32jxx5r64h5tlkxk9m6kw6lq84jezxpqr853x8sdat9x4` |
| Delegation IDs | Bech32 (`mdelg1...`) | `mdelg1zf3l695cfaa0vldfc3fv4q65f6n30w832jkptwgfry3du63hx9gq42t3f0` |
| Order IDs | Bech32 (`mordr1...`) | `mordr1u8kjudmqwpx0fv9nc3ltgcyfsrllepva9hh2zz9z3gwd6g0yql9sjkfr3l` |

Mainnet addresses and IDs start with `m`; testnet uses different HRP prefixes (`tmtr...`-style). An address format that is valid for the wrong network is rejected with a client error.

## Timestamps

Unix timestamps in seconds. Range-filtered endpoints (e.g. pool block stats) take `from` and `to` query parameters.

## Errors

- Unknown routes return a plain-text `404 page not found`.
- Malformed parameters or malformed IDs return HTTP 400 with a JSON body: `{"error": "..."}`.
- Resources that exist but are not found (e.g. an unknown transaction ID) return HTTP 404 with a JSON body describing the missing object.

Note that some list endpoints return an empty array `[]` rather than an error when no data matches.

## Data freshness

The indexer follows the chain tip; data appears after the scanner processes a block. Under normal operation this lag is a few seconds.
