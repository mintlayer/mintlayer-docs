---
title: "order fill"
sidebar_position: 66
---

> **Legacy spelling:** this command was previously spelled `order-fill`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Fill a specified order with an amount of the order's "asked" currency, receiving the corresponding amount of the "given" currency.

The fill can be partial; you do not need to fill the entire order at once.

## Usage

```
order fill <ORDER_ID> <AMOUNT> [OUTPUT_ADDRESS]
```

## Arguments

- **`<ORDER_ID>`**: The id of the order to fill.

- **`<AMOUNT>`**: The amount of the "asked" currency to fill the order with.

- **`[OUTPUT_ADDRESS]`**: *(Optional)* The address to receive the corresponding amount of the "given" currency. If not specified, a new receive address is generated automatically.

## Examples

```
# Fill an order, receiving funds to a new address
order fill <order_id> 10

# Fill an order, receiving funds to a specific address
order fill <order_id> 10 <my_address>
```

## Related

- [`order create`](order-create-command-guide.md): Create an order.
- [`order freeze`](order-freeze-command-guide.md): Freeze an order to stop new fills.
- [`order conclude`](order-conclude-command-guide.md): Conclude an order and withdraw funds.
- [`order list-all-active`](order-list-all-active-command-guide.md): List all active orders available to fill.
