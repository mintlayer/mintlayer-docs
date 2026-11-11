---
title: "transaction get-signed-raw"
sidebar_position: 114
---

> **Legacy spelling:** this command was previously spelled `transaction-get-signed-raw`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Get a signed transaction from the wallet, if present, as a hex encoded raw transaction.

## Usage

```
transaction get-signed-raw <TRANSACTION_ID>
```

## Arguments

- **`<TRANSACTION_ID>`**: The transaction id, encoded in hex.

## Related

- [`transaction get-raw`](transaction-get-raw-command-guide.md): Get the unsigned raw transaction as hex.
- [`transaction inspect`](transaction-inspect-command-guide.md): Decode and inspect a raw transaction hex.
- [`node submit-transaction`](../node-control/node-submit-transaction-command-guide.md): Broadcast a signed transaction.
