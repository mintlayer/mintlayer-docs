---
title: "abandontransaction"
sidebar_position: 1
---
:::note[Deprecated command name]

This page documents a legacy command name. In current wallet versions the command is called [`transaction-abandon`](transaction-abandon-command-guide.md).

:::



The `abandontransaction` command allows you to abandon an unconfirmed transaction within your Mintlayer wallet. By doing so, the inputs consumed by the abandoned transaction are made available for reuse in subsequent transactions.

### Understanding Transaction Abandonment

In some cases, you might want to abandon a transaction, especially if it remains unconfirmed for an extended period. This could be due to various reasons, such as setting a low transaction fee. Abandoning the transaction allows you to regain control over the consumed inputs and potentially create a new transaction with a higher fee or different parameters.

## Usage

To abandon an unconfirmed transaction, use the following command:

```
abandontransaction <TRANSACTION_ID>
```

### Arguments

- `<TRANSACTION_ID>`: The unique identifier of the transaction you wish to abandon.

### Output

Upon successful execution, the command will confirm the abandonment of the transaction, and the consumed inputs will be made available for reuse.

### Important Notes

- **Local Operation**: The `abandontransaction` command operates locally on your Mintlayer wallet. This means that even if you abandon a transaction in your wallet, if it has already been propagated to the network, there's no guarantee that it won't be included in a future block. Always be cautious and understand that once a transaction is broadcasted, it's out of your control, and this command doesn't reverse that.

### Note on Using the `abandontransaction` Command:

The `abandontransaction` command allows users to "abandon" a transaction within their Mintlayer wallet. Here's what it means and its implications:

- **Effects on UTXOs**: When a transaction is abandoned, its UTXOs (Unspent Transaction Outputs) will not be considered for future transactions. In other words, the wallet will not use these UTXOs or broadcast the abandoned transaction anymore.
  
- **Use Case**: The primary use case for this command is if you've created a transaction and later decide to change your mind. For instance, if you mistakenly sent tokens to the wrong address, you might want to abandon that transaction. However, this doesn't mean the transaction will be reversed; it just means the wallet won't consider or broadcast it further.

- **Caution on Future Transactions**: Abandoning a transaction will effectively "lock" the associated tokens or coins. If you wish to transact with those tokens again, you'll need to manually create a new transaction. The wallet won't automatically use the UTXOs from the abandoned transaction.

- **Mempool Considerations**: The primary reason to abandon a transaction is to prevent it from being in the mempool. If a transaction remains in the wallet without being abandoned, the wallet assumes you still want to proceed with it and will base future transactions on it. This can have implications related to mempool fee calculations and transaction preference.

**Final Word**: Users should exercise extreme caution when using the `abandontransaction` command. It's essential to understand its implications and use it judiciously.

## Options

- `-h, --help`: Displays the help
