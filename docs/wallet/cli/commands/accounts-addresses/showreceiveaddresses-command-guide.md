---
deprecated: true
title: "showreceiveaddresses"
sidebar_position: 76
---
:::danger[Removed command]

This command is no longer available in current wallet-cli versions. use [`address-show`](address-show-command-guide.md) instead.

:::



The `showreceiveaddresses` command allows you to view all the receive addresses along with their usage state in your Mintlayer wallet. It helps you to identify which addresses have been used in transactions that are recorded on the blockchain.

### Usage

To display the list of receive addresses and their usage state, use the following command:

```sh
showreceiveaddresses
```

### Output

The command outputs a table with the following columns:

- **Index**: The index number of the address in your wallet.
- **Address**: The actual receive address.
- **Is used in transaction history**: Indicates whether the address has been used in a transaction that is recorded on the blockchain. It will show "Yes" if the address has been used in a transaction that is included in a block, and "No" otherwise.

### Example

Here is an example of what the output might look like:

```
+-------+----------------------------------------------+--------------------------------+
| Index | Address                                      | Is used in transaction history |
+=======+==============================================+================================+
| 0     | tmt1q8duxru0ranld7r73c6meezkwndftdma9vmmnzyc | No                             |
+-------+----------------------------------------------+--------------------------------+
| 1     | tmt1qyy6vcyzv66y9ls3ex9zyvxzz6yfd9vkhylmdnwy | No                             |
+-------+----------------------------------------------+--------------------------------+
```

### Note

- The "Is used in transaction history" is determined based on the blockchain, not the wallet. Therefore, an address will be marked as used only when a transaction involving it is included in a block.
- The command does not have any arguments or options other than `-h, --help` to print the help message.
