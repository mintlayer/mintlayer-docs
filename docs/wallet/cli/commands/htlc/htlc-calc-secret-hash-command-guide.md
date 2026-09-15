---
title: "htlc-calc-secret-hash"
sidebar_position: 33
---

Calculate the hash of a given HTLC secret.

## Usage

```
htlc-calc-secret-hash <SECRET>
```

## Arguments

- **`<SECRET>`**: The hex-encoded HTLC secret to hash.

## Notes

The resulting hash is what you provide to `htlc-create-transaction` when setting up the HTLC. The secret itself is kept off-chain and revealed only when spending the HTLC.

## Related

- [`htlc-generate-secret`](htlc-generate-secret-command-guide.md): Generate a random HTLC secret.
- [`htlc-create-transaction`](htlc-create-transaction-command-guide.md): Create an HTLC output using the hash.
- [`utxo-spend`](../transactions/utxo-spend-command-guide.md): Spend an HTLC by providing the secret.
