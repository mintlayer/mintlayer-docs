---
deprecated: true
title: "selectaccount"
sidebar_position: 74
---
:::danger[Deprecated command name]

This page documents a legacy command name. In current wallet versions the command is called [`account-select`](account-select-command-guide.md).

:::



The `selectaccount` command allows you to switch between different accounts within your Mintlayer wallet. By selecting an account, you set it as the active account for subsequent transactions and operations.

### Understanding Accounts

In Mintlayer, a single wallet can have multiple accounts. Each account is derived from the same seed phrase but follows a different derivation path. This structure provides flexibility, allowing users to organize their funds, maintain privacy, or manage different transaction purposes under a single seed phrase.

## Usage

To select and set an account as active, use the following command:

```
selectaccount <ACCOUNT_INDEX>
```

### Arguments

- `<ACCOUNT_INDEX>`: The index number of the account you want to select. This index corresponds to the order in which accounts were created within the wallet.

### Important Notes

- Ensure you select the correct account index, especially if you have multiple accounts with varying balances or transaction purposes.
- Once an account is selected, all subsequent operations will be performed from this account until another account is selected or the wallet session is closed.

## Options

- `-h, --help`: Displays the help message for the `selectaccount` command.
