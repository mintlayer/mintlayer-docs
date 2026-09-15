---
title: "order-conclude"
sidebar_position: 64
---

Conclude an order, withdrawing the accumulated "asked" amount and any remaining "given" amount.

The conclude key for the order must be owned by the selected account.

## Usage

```
order-conclude <ORDER_ID> [OUTPUT_ADDRESS]
```

## Arguments

- **`<ORDER_ID>`**: The id of the order to conclude.

- **`[OUTPUT_ADDRESS]`**: *(Optional)* The address to receive the accumulated asked amount and any remaining given amount. If not specified, a new receive address is generated automatically.

## Notes

If the order is being actively filled, concluding may fail due to transaction conflicts. In that case, freeze the order first with `order-freeze`, wait for the freeze to confirm, then conclude.

## Related

- [`order-freeze`](order-freeze-command-guide.md): Freeze an order before concluding if it is actively being filled.
- [`order-create`](order-create-command-guide.md): Create an order.
- [`order-list-own`](order-list-own-command-guide.md): List orders whose conclude key you own.
