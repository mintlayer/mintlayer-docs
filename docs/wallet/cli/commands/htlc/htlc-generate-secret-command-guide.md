---
title: "htlc generate-secret"
sidebar_position: 35
---

> **Legacy spelling:** this command was previously spelled `htlc-generate-secret`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Generate a new random HTLC secret and print it to the console.

## Usage

```
htlc generate-secret
```

## Notes

The secret is printed in hex. Store it securely; it is needed to spend the HTLC on the recipient side. Pass it to `htlc calc-secret-hash` to obtain the hash required when creating the HTLC.

## Related

- [`htlc calc-secret-hash`](htlc-calc-secret-hash-command-guide.md): Compute the hash of a secret.
- [`htlc create`](htlc-create-command-guide.md): Create an HTLC output using the hash.
- [`utxo-spend`](../transactions/utxo-spend-command-guide.md): Spend an HTLC by providing the secret.
