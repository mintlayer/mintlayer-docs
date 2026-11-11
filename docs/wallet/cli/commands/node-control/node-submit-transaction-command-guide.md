---
title: "node submit-transaction"
sidebar_position: 59
---

> **Legacy spelling:** this command was previously spelled `node-submit-transaction`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Submits a transaction to mempool, and if it is valid, broadcasts it to the network.

## Usage

```
node submit-transaction [OPTIONS] <TRANSACTION>
```

## Arguments

- **`<TRANSACTION>`**: Hex encoded transaction to submit.

## Options

- **`--do-not-store`**: Do not store the transaction in the wallet database.

## Notes

This command is useful when `config broadcast` has been set to `no`, or when submitting a transaction that was signed externally (e.g. via `transaction sign` in a cold wallet).

## Related

- [`config broadcast`](../wallet-management/config-broadcast-command-guide.md): Configure automatic broadcasting.
- [`transaction sign`](../transactions/transaction-sign-command-guide.md): Sign a raw transaction.
- [`transaction abandon`](../transactions/transaction-abandon-command-guide.md): Abandon a pending transaction.
