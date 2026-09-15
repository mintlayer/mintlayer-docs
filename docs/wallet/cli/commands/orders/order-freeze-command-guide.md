---
title: "order-freeze"
sidebar_position: 67
---

Freeze an order, preventing it from being filled. The only operation allowed on a frozen order is conclusion.

Freezing is optional, you can conclude a non-frozen order directly. However, if an order is being actively filled, a conclude transaction may fail due to conflicts. In that case, freeze the order first, wait for the freeze transaction to be included in a block, then conclude.

The conclude key for the order must be owned by the selected account.

## Usage

```
order-freeze <ORDER_ID>
```

## Arguments

- **`<ORDER_ID>`**: The id of the order to freeze.

## Related

- [`order-conclude`](order-conclude-command-guide.md): Conclude the order and withdraw funds.
- [`order-create`](order-create-command-guide.md): Create an order.
- [`order-list-own`](order-list-own-command-guide.md): List orders whose conclude key you own.
