---
title: "account show-xpub"
sidebar_position: 4
---

> **Legacy spelling:** this command was previously spelled `account-extended-public-key-as-hex`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Shows the account's extended public key.

The returned extended public key can be used to derive receiving or change addresses for this account.

## Usage

```
account show-xpub
```

## Notes

In cold wallet mode (`--cold-wallet`), this command is only available through its legacy flat spelling `account-extended-public-key-as-hex`; cold wallets do not accept the nested grammar. The extended public key can be shared safely, it contains no private key material, and can be used by watch-only wallets or external tools to derive addresses for this account without exposing the seed phrase.
