---
title: "purgeseedphrase"
sidebar_position: 70
---
:::note[Deprecated command name]

This page documents a legacy command name. In current wallet versions the command is called [`wallet-purge-seed-phrase`](wallet-purge-seed-phrase-command-guide.md).

:::



The `purgeseedphrase` command is used to delete the seed phrase from the currently loaded wallet in Mintlayer, but only if it has been saved within the wallet.

## Usage

```
purgeseedphrase
```

### Options

- `-h, --help`: Displays the help message for the `purgeseedphrase` command.

## Important Notes

- Before using this command, ensure you have securely backed up your seed phrase. Deleting the seed phrase from the wallet means it won't be retrievable from the wallet in the future.
- The seed phrase is essential for wallet recovery. If you lose access to your wallet and don't have the seed phrase, you might lose access to your funds permanently.
