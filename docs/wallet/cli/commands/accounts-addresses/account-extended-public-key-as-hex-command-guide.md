---
title: "account-extended-public-key-as-hex"
sidebar_position: 4
---

Shows the account's extended public key.

The returned extended public key can be used to derive receiving or change addresses for this account.

## Usage

```
account-extended-public-key-as-hex
```

## Notes

This command is available in cold wallet mode (`--cold-wallet`). The extended public key can be shared safely, it contains no private key material, and can be used by watch-only wallets or external tools to derive addresses for this account without exposing the seed phrase.
