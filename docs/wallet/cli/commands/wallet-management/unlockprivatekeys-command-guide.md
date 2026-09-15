---
deprecated: true
title: "unlockprivatekeys"
sidebar_position: 118
---
:::note[Deprecated command name]

This page documents a legacy command name. In current wallet versions the command is called [`wallet-unlock-private-keys`](wallet-unlock-private-keys-command-guide.md).

:::



The `unlockprivatekeys` command is used to unlock the encrypted private keys of the currently opened wallet in Mintlayer.

## Usage

```
unlockprivatekeys <PASSWORD>
```

### Arguments

- `<PASSWORD>`: The password used to encrypt the private keys.

### Options

- `-h, --help`: Displays the help message for the `unlockprivatekeys` command.

## Important Notes

- Ensure you provide the correct password. 
- Once the private keys are unlocked, you can perform transactions or other operations that require access to these keys.
