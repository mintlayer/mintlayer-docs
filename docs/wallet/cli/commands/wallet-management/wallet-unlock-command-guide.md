---
title: "wallet unlock"
sidebar_position: 134
---

> **Legacy spelling:** this command was previously spelled `wallet-unlock-private-keys`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Unlocks the private keys for usage.

## Usage

```
wallet unlock [OPTIONS]
```

## Options

- **`--password-file <FILE>`**: File containing the current encryption password, or `-` for standard input. If omitted on a terminal, the password is read with a hidden prompt.

## Notes

Passing the password on the command line is insecure and only supported by the legacy `wallet-unlock-private-keys` spelling; the wallet logs a warning when it is used.

In cold wallet mode (`--cold-wallet`), this command is only available through its legacy flat spelling `wallet-unlock-private-keys`; cold wallets do not accept the nested grammar.

After unlocking, the private keys remain available until `wallet lock` is called or the wallet is closed.

## Examples

```
# Unlock, entering the password at the hidden prompt
wallet unlock

# Unlock, reading the password from a file
wallet unlock --password-file /path/to/password.txt

# Unlock, reading the password from standard input
cat /path/to/password.txt | wallet unlock --password-file -
```

## Related

- [`wallet lock`](wallet-lock-command-guide.md): Lock the private keys again.
- [`wallet encrypt`](wallet-encrypt-command-guide.md): Set or change the encryption password.
- [`wallet decrypt`](wallet-decrypt-command-guide.md): Remove encryption entirely.
