---
title: "wallet-lock-private-keys"
sidebar_position: 126
---

Locks the private keys so they can't be used until they are unlocked again.

## Usage

```
wallet-lock-private-keys
```

## Notes

This command is available in cold wallet mode (`--cold-wallet`). Locking does not remove the encryption, the password is preserved. Use `wallet-unlock-private-keys` to unlock again.

## Related

- [`wallet-unlock-private-keys`](wallet-unlock-private-keys-command-guide.md): Unlock the private keys.
- [`wallet-encrypt-private-keys`](wallet-encrypt-private-keys-command-guide.md): Set an encryption password.
- [`wallet-disable-private-keys-encryption`](wallet-disable-private-keys-encryption-command-guide.md): Remove encryption entirely.
