---
deprecated: true
title: "newaddress"
sidebar_position: 37
---
:::note[Deprecated command name]

This page documents a legacy command name. In current wallet versions the command is called [`address-new`](address-new-command-guide.md).

:::



The `newaddress` command is used to generate a new, unused address within the currently selected account in your Mintlayer wallet.

### Why Generate a New Address?

Generating new addresses for different transactions can enhance privacy. By not reusing addresses, it becomes more challenging for third parties to associate transactions with a specific user or entity.

## Usage

To generate a new unused address, simply use the following command:

```
newaddress
```

### Output

Upon execution, the command will return a fresh address that hasn't been used for any previous transactions within the selected account.

### Important Notes

- It's a good practice to use a new address for each transaction to maintain privacy.
- Ensure you have selected the correct account (using the `selectaccount` command) before generating a new address if you have multiple accounts within your wallet.

### Limitation on Generating Unused Addresses

By default, you can only generate up to 20 unused addresses consecutively. This limitation exists because the wallet scans the blockchain to check for balances associated with each address. To maintain efficiency, it only searches for the next 20 addresses on the selected derivation path. If you frequently generate new addresses, ensure you use them in transactions to avoid hitting this limit prematurely.

### Get the list of addresses in the account

You can get the list of addresses using the command [showreceiveaddresses](showreceiveaddresses-command-guide.md)
## Options

- `-h, --help`: Displays the help message for the `newaddress` command.
