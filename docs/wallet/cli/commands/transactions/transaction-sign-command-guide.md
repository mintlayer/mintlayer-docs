---
title: "transaction sign"
sidebar_position: 118
---

> **Legacy spelling:** this command was previously spelled `account-sign-raw-transaction`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Signs transaction inputs that are not yet signed.

The input is a hex encoded transaction or PartiallySignedTransaction. This format is automatically used by commands such as `staking decommission-pool-request`.

Once all signatures are complete, the result can be broadcast to the network using `node submit-transaction`.

## Usage

```
transaction sign <TRANSACTION>
```

## Arguments

- **`<TRANSACTION>`**: Hex encoded transaction or PartiallySignedTransaction.

## Notes

Signing is intended for cold-storage workflows: compose a transaction on a hot machine, transfer the hex to the cold wallet for signing, then broadcast the result with `node submit-transaction`. Note that cold wallet mode (`--cold-wallet`) has no nested command groups; there the command is only available under its legacy flat spelling `account-sign-raw-transaction`. In a regular wallet session, use the nested spelling `transaction sign` shown above; it runs the same signing routine.
