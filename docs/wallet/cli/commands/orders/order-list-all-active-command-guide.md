---
title: "order-list-all-active"
sidebar_position: 68
---

List all active (not concluded and not frozen) orders, optionally filtering by asked or given currency.

Orders belonging to the current account are marked with `*`.

## Usage

```
order-list-all-active [OPTIONS]
```

## Options

- **`--ask-currency <ASK_CURRENCY>`**: Filter by the asked currency. Pass a token id or `coin` for ML coins.

- **`--give-currency <GIVE_CURRENCY>`**: Filter by the given currency. Pass a token id or `coin` for ML coins.

## Examples

```
# List all active orders
order-list-all-active

# List orders asking for ML coins
order-list-all-active --ask-currency coin

# List orders giving a specific token
order-list-all-active --give-currency <token_id>

# Filter by both currencies
order-list-all-active --ask-currency coin --give-currency <token_id>
```

## Notes

Token tickers are not unique. Always verify the token id when evaluating an order, not just the ticker symbol.

## Related

- [`order-list-own`](order-list-own-command-guide.md): List only orders whose conclude key you own.
- [`order-fill`](order-fill-command-guide.md): Fill an order.
- [`order-create`](order-create-command-guide.md): Create an order.
