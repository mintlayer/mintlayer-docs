---
deprecated: true
title: "showseedphrase"
sidebar_position: 77
---
:::note[Deprecated command name]

This page documents a legacy command name. In current wallet versions the command is called [`wallet-show-seed-phrase`](wallet-show-seed-phrase-command-guide.md).

:::



The `showseedphrase` command is used to display the seed phrase for the currently loaded wallet in Mintlayer, but only if it has been saved within the wallet.

## Usage

```
showseedphrase
```

### Options

- `-h, --help`: Displays the help message for the `showseedphrase` command.

## Important Notes

- The seed phrase is a critical piece of information that can be used to recover your wallet. Always ensure it's kept in a secure and private location.
- Never share your seed phrase with anyone, as possession of the seed phrase can grant full access to the funds within the wallet.
