---
title: "wallet-disable-private-keys-encryption"
sidebar_position: 123
---

Completely and totally remove any existing encryption from the wallet. The wallet must be unlocked before running this command.

**Warning:** After this, your wallet file will be USABLE BY ANYONE without a password.

## Usage

```
wallet-disable-private-keys-encryption
```

## Notes

This command is available in cold wallet mode (`--cold-wallet`). Use with extreme caution. To re-add encryption, use `wallet-encrypt-private-keys`.

## Related

- [`wallet-encrypt-private-keys`](wallet-encrypt-private-keys-command-guide.md): Encrypt the wallet with a password.
- [`wallet-unlock-private-keys`](wallet-unlock-private-keys-command-guide.md): Unlock the wallet before running this command.
