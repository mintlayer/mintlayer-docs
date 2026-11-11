---
title: "wallet decrypt"
sidebar_position: 123
---

> **Legacy spelling:** this command was previously spelled `wallet-disable-private-keys-encryption`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Completely and totally remove any existing encryption from the wallet. The wallet must be unlocked before running this command.

**Warning:** After this, your wallet file will be USABLE BY ANYONE without a password.

## Usage

```
wallet decrypt
```

## Notes

This command is available in cold wallet mode (`--cold-wallet`). Use with extreme caution. To re-add encryption, use `wallet encrypt`.

## Related

- [`wallet encrypt`](wallet-encrypt-command-guide.md): Encrypt the wallet with a password.
- [`wallet unlock`](wallet-unlock-command-guide.md): Unlock the wallet before running this command.
