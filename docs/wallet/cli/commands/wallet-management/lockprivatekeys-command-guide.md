---
deprecated: true
title: "lockprivatekeys"
sidebar_position: 36
---
:::danger[Deprecated command name]

This page documents a legacy command name. In current wallet versions the command is called [`wallet-lock-private-keys`](wallet-lock-private-keys-command-guide.md).

:::



The `lockprivatekeys` command is used to lock the private keys of the currently opened wallet in Mintlayer, ensuring they are secured and cannot be accessed without the encryption password.

## Usage

```
lockprivatekeys
```

### Options

- `-h, --help`: Displays the help message for the `lockprivatekeys` command.

## Important Notes

- Locking your private keys is a security measure to prevent unauthorized access or transactions.
- To access the private keys again or perform operations that require them, you will need to use the `unlockprivatekeys` command with the correct password.
