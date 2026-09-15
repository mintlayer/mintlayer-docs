---
title: "transaction-get-raw"
sidebar_position: 113
---

Get a transaction from the wallet, if present, as a hex encoded raw transaction.

## Usage

```
transaction-get-raw <TRANSACTION_ID>
```

## Arguments

- **`<TRANSACTION_ID>`**: The transaction id, encoded in hex.

## Notes

The returned hex can be passed to `transaction-inspect` to decode and review it, or to `node-submit-transaction` to rebroadcast it.

## Related

- [`transaction-get`](transaction-get-command-guide.md): Get a transaction in decoded form.
- [`transaction-get-signed-raw`](transaction-get-signed-raw-command-guide.md): Get the signed version as hex.
- [`transaction-inspect`](transaction-inspect-command-guide.md): Decode and inspect a raw transaction hex.
