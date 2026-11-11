---
title: "wallet encrypt"
sidebar_position: 124
---

> **Legacy spelling:** this command was previously spelled `wallet-encrypt-private-keys`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Encrypts the private keys with a new password. The wallet must be unlocked before running this command.

If the seed phrase is stored in the wallet file, it will also be encrypted.

## Usage

```
wallet encrypt [OPTIONS]
```

## Options

- **`--password-file <FILE>`**: File containing the new encryption password, or `-` for standard input. If omitted on a terminal, the password is read with a hidden prompt and must be entered twice.

## Notes

Passing the password on the command line is insecure and only supported by the legacy `wallet-encrypt-private-keys` spelling; the wallet logs a warning when it is used.

In cold wallet mode (`--cold-wallet`), this command is only available through its legacy flat spelling `wallet-encrypt-private-keys`; cold wallets do not accept the nested grammar.

After encrypting, use `wallet unlock` to unlock the wallet for signing operations.

## Examples

```
# Encrypt, entering the password at the hidden prompt
wallet encrypt

# Encrypt, reading the new password from a file
wallet encrypt --password-file /path/to/new-password.txt

# Encrypt, reading the new password from standard input
cat /path/to/new-password.txt | wallet encrypt --password-file -
```

## Related

- [`wallet unlock`](wallet-unlock-command-guide.md): Unlock the wallet with the password.
- [`wallet lock`](wallet-lock-command-guide.md): Lock the wallet without removing encryption.
- [`wallet decrypt`](wallet-decrypt-command-guide.md): Remove encryption entirely.
