---
title: "order-create"
sidebar_position: 65
---

Create an order for exchanging an amount of one ("given") currency for a certain amount of another ("asked") currency.

Either currency can be coins or tokens. The ratio between the asked and given amounts determines the exchange rate. The entire given amount is locked inside the order and released to fillers. The accumulated asked amount and any remaining given amount can be withdrawn by concluding the order.

## Usage

```
order-create <ASK_CURRENCY> <ASK_AMOUNT> <GIVE_CURRENCY> <GIVE_AMOUNT> <CONCLUDE_ADDRESS>
```

## Arguments

- **`<ASK_CURRENCY>`**: The currency you are asking for. Use a token id, or `coin` for ML coins.

- **`<ASK_AMOUNT>`**: The amount of the asked currency you want to receive.

- **`<GIVE_CURRENCY>`**: The currency you will be giving. Use a token id, or `coin` for ML coins.

- **`<GIVE_AMOUNT>`**: The amount of the given currency to lock in the order.

- **`<CONCLUDE_ADDRESS>`**: The address whose key can authorize concluding or freezing the order.

## Examples

```
# Offer 100 ML coins in exchange for 50 units of a token
order-create <token_id> 50 coin 100 <conclude_address>

# Offer 1000 units of a token in exchange for 10 ML coins
order-create coin 10 <token_id> 1000 <conclude_address>
```

## Related

- [`order-fill`](order-fill-command-guide.md): Fill this order (partially or fully).
- [`order-freeze`](order-freeze-command-guide.md): Freeze the order to stop new fills.
- [`order-conclude`](order-conclude-command-guide.md): Withdraw accumulated funds and close the order.
- [`order-list-own`](order-list-own-command-guide.md): List orders you can conclude.
- [`order-list-all-active`](order-list-all-active-command-guide.md): List all active orders.
