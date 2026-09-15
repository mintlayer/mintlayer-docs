---
title: "transaction-abandon"
sidebar_position: 109
---

Abandon an unconfirmed transaction in the wallet database, and make the consumed inputs available to be used again.

Note that this doesn't necessarily mean the network will agree. This assumes the transaction is either still unconfirmed on the network or somehow invalid.

## Usage

```
transaction-abandon <TRANSACTION_ID>
```

## Arguments

- **`<TRANSACTION_ID>`**: The id of the transaction to abandon, in hex.

## Related

- [`transaction-list-pending`](transaction-list-pending-command-guide.md): List pending transactions that can be abandoned.
- [`node-submit-transaction`](../node-control/node-submit-transaction-command-guide.md): Resubmit a transaction to the network.
