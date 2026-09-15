---
title: "Orders"
description: "On-chain trading with the Mintlayer JavaScript SDK: creating, filling, and concluding decentralized orders."
sidebar_position: 7
---

# Orders

Orders are Mintlayer's on-chain primitive for decentralized trading: one party locks an amount (`give`) and asks for another asset (`ask`) in return. Anyone can fill an order; the creator can conclude it to reclaim the balance. See [Trading with Orders (SDK)](../../guides/trading-with-orders.md) for a walkthrough, and the [wallet-cli orders guide](../../../wallet/guides/trading-with-orders.md) for the concepts.

The SDK's `Client` exposes the full order lifecycle. Every method also has a `buildX` variant — see [Transactions](transactions.md#manual-building).

## Creating an order

```ts
const signedTx = await client.createOrder({
  give_token: 'tmltk1...',      // what you lock into the order ('0' for the base coin)
  give_amount: 100,
  ask_token: 'tmltk2...',       // what you ask for in return
  ask_amount: 10,
  conclude_destination: 'tmt1q...', // where concluded leftovers return to
});
```

## Filling an order

```ts
const signedTx = await client.fillOrder({
  order_id: 'ord1...',
  amount: 5,               // how much of the ask you fulfill
  destination: 'tmt1q...', // where you receive your side of the trade
});
```

## Concluding an order

The order creator can close an order and reclaim the remaining balance:

```ts
const signedTx = await client.concludeOrder('ord1...');
```

## Querying orders

```ts
const mine = await client.getAccountOrders();      // orders created by this account
const open = await client.getAvailableOrders();    // orders fillable on the network
```

Both return `OrderData` objects with the order's ask/give currencies, balances, and conclusion destination.

## Example: market-maker loop

```ts
import { Client } from '@mintlayer/sdk';

const client = await Client.create({ network: 'testnet' });
await client.connect();

// Quote an order
await client.createOrder({
  give_token: 'tmltk1...',
  give_amount: 100,
  ask_token: '0', // base coin
  ask_amount: 10,
  conclude_destination: client.getAddresses().receiving[0],
});

// Watch the book and fill interesting orders
for (const order of await client.getAvailableOrders()) {
  // ... decide whether to fill `order` ...
}
```
