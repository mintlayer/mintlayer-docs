---
title: "wallet-encrypt-private-keys"
sidebar_position: 124
---

Encrypts the private keys with a new password. The wallet must be unlocked before running this command.

If the seed phrase is stored in the wallet file, it will also be encrypted.

## Usage

```
wallet-encrypt-private-keys <PASSWORD>
```

## Arguments

- **`<PASSWORD>`**: The new encryption password.

## Notes

This command is available in cold wallet mode (`--cold-wallet`). After encrypting, use `wallet-unlock-private-keys` to unlock the wallet for signing operations.

## Related

- [`wallet-unlock-private-keys`](wallet-unlock-private-keys-command-guide.md): Unlock the wallet with the password.
- [`wallet-lock-private-keys`](wallet-lock-private-keys-command-guide.md): Lock the wallet without removing encryption.
- [`wallet-disable-private-keys-encryption`](wallet-disable-private-keys-encryption-command-guide.md): Remove encryption entirely.
