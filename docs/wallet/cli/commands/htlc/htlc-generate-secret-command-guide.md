---
title: "htlc-generate-secret"
sidebar_position: 35
---

Generate a new random HTLC secret and print it to the console.

## Usage

```
htlc-generate-secret
```

## Notes

The secret is printed in hex. Store it securely, it is needed to spend the HTLC on the recipient side. Pass it to `htlc-calc-secret-hash` to obtain the hash required when creating the HTLC.

## Related

- [`htlc-calc-secret-hash`](htlc-calc-secret-hash-command-guide.md): Compute the hash of a secret.
- [`htlc-create-transaction`](htlc-create-transaction-command-guide.md): Create an HTLC output using the hash.
- [`utxo-spend`](../transactions/utxo-spend-command-guide.md): Spend an HTLC by providing the secret.
