---
title: "order list-own"
sidebar_position: 69
---

> **Legacy spelling:** this command was previously spelled `order-list-own`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

List orders whose conclude key is owned by the selected account.

## Usage

```
order list-own
```

## Notes

Orders belonging to this account are the ones you can freeze or conclude. Use `order list-all-active` to see all orders on the network regardless of ownership.

## Related

- [`order list-all-active`](order-list-all-active-command-guide.md): List all active orders on the network.
- [`order conclude`](order-conclude-command-guide.md): Conclude an order.
- [`order freeze`](order-freeze-command-guide.md): Freeze an order.
- [`order create`](order-create-command-guide.md): Create an order.
