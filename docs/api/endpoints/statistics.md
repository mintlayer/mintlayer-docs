---
title: "Statistics"
description: "Supply statistics endpoints of the Mintlayer indexer API: coin and per-token supply counters and address balance holders."
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

The counters are maintained by the scanner while it indexes the chain (and rolled back on reorgs), so they are always up to date with the indexed tip:

- `preminted` — the total amount that has entered circulation: for the coin, transfer outputs and pool-creation pledges; for a token, transfer outputs since issuance.
- `staked` — the amount currently staked in pools (the founder's pledge plus delegated balances).
- `circulating_supply` — the amount currently in circulation: `preminted` minus everything `burned`. Burns are subtracted during indexing, so this counter already reflects everything counted in `burned`; the total amount ever minted is therefore `circulating_supply + burned`.
- `burned` — the total amount destroyed: outputs sent to burn destinations, plus the fees of token account commands (minting, freezing, authority changes, ...), which are burned rather than paid to anyone.

Consumers should treat an absent statistic as zero: the endpoint lists the statistics that have been written, and a counter with no recorded activity is omitted from the underlying listing rather than returned as `0`. The endpoints above render such absent counters as zero, as in the token example below.

## GET /statistics/token/\{id\}

Returns the same statistics for a specific token, identified by its bech32 token ID (`mmltk1...`):

```bash
curl https://api-server.mintlayer.org/api/v2/statistics/token/mmltk18e0xfgmw3sn4s8vqu0ypjsnlv2fhnm6ye4zcazwqpr9dujrrdf6qjyhh0e
```

```json
{
  "burned": { "atoms": "0", "decimal": "0" },
  "circulating_supply": { "atoms": "0", "decimal": "0" },
  "preminted": { "atoms": "0", "decimal": "0" },
  "staked": { "atoms": "0", "decimal": "0" }
}
```

For tokens, `circulating_supply` increases with transfer outputs and mint commands and decreases with everything burned. An unknown token returns HTTP 404 with `{"error": "Token not found"}`; a malformed token ID returns HTTP 400.

## GET /statistics/coin/holders

Lists the top addresses by coin balance, largest first:

```bash
curl "https://api-server.mintlayer.org/api/v2/statistics/coin/holders?items=2"
```

```json
{
  "items": [
    {
      "address": "mtc1q8n9u3g3aw4h40gsagxn7yw0jatdfe9xsuftnvur",
      "amount": { "atoms": "18923740491080455517", "decimal": "189237404.91080455517" }
    },
    {
      "address": "mtc1q9sl5xwkfypf7gutvnwfscvzs9w9gjqc0vs90e34",
      "amount": { "atoms": "98250000000000", "decimal": "982.5" }
    }
  ],
  "next_cursor": null
}
```

- Entries are ordered by balance, descending; ties are broken by address in descending byte order, so equal balances keep a stable order. Addresses with a zero balance are not listed.
- `amount` follows the [atoms/decimal convention](../conventions.md#amounts).
- The response is always the `{items, next_cursor}` envelope. Walk the full listing with [keyset pagination](../conventions.md#keyset-pagination-cursors): pass `next_cursor` back as `cursor`; `null` means the listing is exhausted.

## GET /statistics/token/\{id\}/holders

The same listing for the holders of a specific token, identified by its bech32 token ID (`mmltk1...`):

```bash
curl "https://api-server.mintlayer.org/api/v2/statistics/token/mmltk18e0xfgmw3sn4s8vqu0ypjsnlv2fhnm6ye4zcazwqpr9dujrrdf6qjyhh0e/holders?items=1"
```

Same response shape and ordering as the coin holders listing. An unknown token returns HTTP 404 with `{"error": "Token not found"}`.

## Go SDK

```go
coin, err := client.Indexer.GetCoinStatistics(ctx)        // GET /statistics/coin
tok, err := client.Indexer.GetTokenStatistics(ctx, id)    // GET /statistics/token/:id
```

See the [indexer client reference](../../build/sdks/go/indexer.md#statistics).
