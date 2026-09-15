---
deprecated: true
title: "removeprivatekeysencryption"
sidebar_position: 71
---
:::danger[Deprecated command name]

This page documents a legacy command name. In current wallet versions the command is called [`wallet-disable-private-keys-encryption`](wallet-disable-private-keys-encryption-command-guide.md).

:::



The `removeprivatekeysencryption` command is used to remove any existing encryption from the private keys of the currently opened wallet in Mintlayer. The wallet is expected to be unlocked before using this command.

## Usage

```
removeprivatekeysencryption
```

### Options

- `-h, --help`: Displays the help message for the `removeprivatekeysencryption` command.

## Important Notes

- Removing encryption from your private keys means they will be stored in plain text within the wallet. This can be a security risk if someone gains unauthorized access to your wallet file.
- Always ensure you have a secure backup of your wallet and consider the risks before removing encryption.
