---
title: "wallet lock"
sidebar_position: 126
---

> **Legacy spelling:** this command was previously spelled `wallet-lock-private-keys`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Locks the private keys so they can't be used until they are unlocked again.

## Usage

```
wallet lock
```

## Notes

This command is available in cold wallet mode (`--cold-wallet`). Locking does not remove the encryption, the password is preserved. Use `wallet unlock` to unlock again.

## Related

- [`wallet unlock`](wallet-unlock-command-guide.md): Unlock the private keys.
- [`wallet encrypt`](wallet-encrypt-command-guide.md): Set an encryption password.
- [`wallet decrypt`](wallet-decrypt-command-guide.md): Remove encryption entirely.
