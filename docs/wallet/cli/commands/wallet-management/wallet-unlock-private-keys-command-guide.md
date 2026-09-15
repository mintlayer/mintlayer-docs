---
title: "wallet-unlock-private-keys"
sidebar_position: 134
---

Unlocks the private keys for usage.

## Usage

```
wallet-unlock-private-keys <PASSWORD>
```

## Arguments

- **`<PASSWORD>`**: The current encryption password.

## Notes

This command is available in cold wallet mode (`--cold-wallet`). After unlocking, the private keys remain available until `wallet-lock-private-keys` is called or the wallet is closed.

## Related

- [`wallet-lock-private-keys`](wallet-lock-private-keys-command-guide.md): Lock the private keys again.
- [`wallet-encrypt-private-keys`](wallet-encrypt-private-keys-command-guide.md): Set or change the encryption password.
- [`wallet-disable-private-keys-encryption`](wallet-disable-private-keys-encryption-command-guide.md): Remove encryption entirely.
