---
title: "account-sign-raw-transaction"
sidebar_position: 7
---

Signs transaction inputs that are not yet signed.

The input is a hex encoded transaction or PartiallySignedTransaction. This format is automatically used by commands such as `staking-decommission-pool-request`.

Once all signatures are complete, the result can be broadcast to the network using `node-submit-transaction`.

## Usage

```
account-sign-raw-transaction <TRANSACTION>
```

## Arguments

- **`<TRANSACTION>`**: Hex encoded transaction or PartiallySignedTransaction.

## Notes

This command is available in cold wallet mode (`--cold-wallet`), making it suitable for air-gapped signing workflows: compose a transaction on a hot machine, transfer the hex to a cold wallet for signing, then broadcast the result.
