---
title: "createnewaccount"
sidebar_position: 22
---

The `createnewaccount` command is used to create a new account within your existing Mintlayer wallet.

### What is an Account?

In the context of Mintlayer and many other blockchain platforms, an account is not a separate wallet but rather a different set of addresses. It's derived from the same wallet seed phrase but follows a different derivation path. This allows users to manage multiple accounts (and therefore multiple address sets) under a single seed phrase, providing organizational flexibility and privacy.

## Usage

To create a new account, use the following command:

```
createnewaccount [NAME]
```

### Arguments

- `[NAME]`: An optional name for the new account. If not provided, the system will assign a default name.

### Important Notes

- Each new account must have transaction history before another account can be created. If the last created account does not have any transaction history, the command will return an error.
- All accounts are derived from the same seed phrase but have different derivation paths, ensuring that they are distinct yet securely tied to your primary wallet.

## Options

- `-h, --help`: Displays the help message for the `createnewaccount` command.
