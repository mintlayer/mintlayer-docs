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

## Go SDK

```go
orders, err := client.Indexer.ListOrders(ctx, indexer.PageOpts{})       // GET /order
order, err := client.Indexer.GetOrder(ctx, orderID)                     // GET /order/:id
pair, err := client.Indexer.ListOrdersByPair(ctx, "ML", tokenID, opts)  // GET /order/pair/:pair
```

See the [indexer client reference](../../build/sdks/go/indexer.md#orders) and the [orders guide](../../build/sdks/go/indexer.md).
