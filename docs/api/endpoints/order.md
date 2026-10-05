---
title: "Orders"
description: "On-chain order book endpoints of the Mintlayer indexer API."
sidebar_position: 10
---

# Order endpoints

Mintlayer's DEX is an on-chain order book: an order locks one currency and asks for another. See [Trading with Orders](../../guides/cli/trading-with-orders.md) for the lifecycle.

## GET /order

Lists open orders, with [pagination](../conventions.md#pagination):

```bash
curl "https://api-server.mintlayer.org/api/v2/order?items=1"
```

```json
[
  {
    "ask_balance": { "atoms": "98250000000000", "decimal": "982.5" },
    "ask_currency": { "type": "Coin" },
    "conclude_destination": "mtc1q9sl5xwkfypf7gutvnwfscvzs9w9gjqc0vs90e34",
    "give_balance": { "atoms": "9825000000", "decimal": "9825" },
    "give_currency": {
      "token_id": "mmltk18e0xfgmw3sn4s8vqu0ypjsnlv2fhnm6ye4zcazwqpr9dujrrdf6qjyhh0e",
      "type": "Token"
    },
    "initially_asked": { "atoms": "100000000000000", "decimal": "1000" },
    "initially_given": { "atoms": "10000000000", "decimal": "10000" },
    "order_id": "mordr1u8kjudmqwpx0fv9nc3ltgcyfsrllepva9hh2zz9z3gwd6g0yql9sjkfr3l"
  }
]
```

- `give_*` / `ask_*` describe what the order offers and wants; `initially_*` is the original size, so remaining/burned amounts can be derived.
- `ask_currency` / `give_currency` are either `{"type": "Coin"}` or `{"type": "Token", "token_id": "mmltk1..."}`.

## GET /order/\{id\}

Returns a single order by ID (`mordr1...`), same shape as above.

## GET /order/pair/\{pair\}

Lists open orders for a trading pair. The pair is `{FIRST}_{SECOND}` where each side is the coin ticker (`ML` on mainnet) or a raw token ID:

```bash
curl "https://api-server.mintlayer.org/api/v2/order/pair/ML_mmltk18e0xfgmw3sn4s8vqu0ypjsnlv2fhnm6ye4zcazwqpr9dujrrdf6qjyhh0e?items=1"
```

The pair direction is normalized (matching orders for the pair are returned regardless of give/ask orientation).

## GET /order/pair/\{pair\}/book

Returns the aggregated order book for a trading pair: open orders are grouped by price, and each price level's `amount` is the summed available balance across the orders at that price (an order filled partially contributes its remaining balance, which is carried as it fills).

The pair is `{BASE}_{QUOTE}` — exactly two non-empty, `_`-separated sides, each the coin ticker (`ML` on mainnet, case-insensitive) or a token ID. Both sides must be the native coin or a registered token; anything else is a client error (`400 {"error": "Invalid order trading pair"}`). The direction is normalized: requesting the reversed pair works and shows the mirrored side of the same orders.

Query parameters:

| Parameter | Description |
| --------- | ----------- |
| `side` | Required. `ask` lists the orders asking for the base currency (first in the pair) while giving the quote; `bid` lists the reverse (asking for quote, giving base) |
| `items` | Page size, capped at `100`. See [Conventions](../conventions.md#pagination) |
| `cursor` | [Keyset pagination](../conventions.md#keyset-pagination-cursors) cursor from `next_cursor`. Cursors are side-specific: a cursor from the ask book is rejected (HTTP 400) on the bid walk, and vice versa |

Ask levels are ordered by ascending price, bid levels by descending price (best price first). Each level's `price` is quote-per-base in two forms: `atoms` is the exact rational in atoms as a `numer/denom` string (quote atoms per base atom), and `decimal` is a display string floored from the exact value.

```bash
curl "https://api-server.mintlayer.org/api/v2/order/pair/ML_mmltk18e0xfgmw3sn4s8vqu0ypjsnlv2fhnm6ye4zcazwqpr9dujrrdf6qjyhh0e/book?side=ask&items=2"
```

```json
{
  "items": [
    {
      "price": { "decimal": "1", "atoms": "1/1" },
      "amount": { "atoms": "10000000000000", "decimal": "100" }
    },
    {
      "price": { "decimal": "3", "atoms": "3/1" },
      "amount": { "atoms": "98250000000000", "decimal": "982.5" }
    }
  ],
  "next_cursor": null
}
```

- `amount` is in the base currency of the pair; both amounts follow the [atoms/decimal convention](../conventions.md#amounts).
- A request scans at most 10,000 open orders. If the scan hit that cap, the response carries an additional `"truncated": true` and **no `next_cursor`**: the levels in hand may be an incomplete view of the book, so re-issue the request (e.g. with different parameters) rather than continuing from a cursor.
- Otherwise `next_cursor` follows the usual [keyset pagination](../conventions.md#keyset-pagination-cursors) contract, and `null` means the end of the book.
- The book is computed per request from a live snapshot of open orders. While the scanner is still catching up, a concurrent walk may skip or repeat a level — re-fetch from the start (`cursor=`) when you need a consistent view.

## Go SDK

```go
orders, err := client.Indexer.ListOrders(ctx, indexer.PageOpts{})       // GET /order
order, err := client.Indexer.GetOrder(ctx, orderID)                     // GET /order/:id
pair, err := client.Indexer.ListOrdersByPair(ctx, "ML", tokenID, opts)  // GET /order/pair/:pair
```

See the [indexer client reference](../../build/sdks/go/indexer.md#orders) and the [orders guide](../../build/sdks/go/indexer.md).
