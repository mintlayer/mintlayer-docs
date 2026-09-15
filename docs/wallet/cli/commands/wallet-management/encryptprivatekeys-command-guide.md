---
title: "encryptprivatekeys"
sidebar_position: 29
---
:::note[Deprecated command name]

This page documents a legacy command name. In current wallet versions the command is called [`wallet-encrypt-private-keys`](wallet-encrypt-private-keys-command-guide.md).

:::



The `encryptprivatekeys` command is used to encrypt the private keys of the currently opened wallet in Mintlayer. The wallet is expected to be unlocked before using this command.

## Usage

```
encryptprivatekeys <PASSWORD>
```

### Arguments

- `<PASSWORD>`: The new password you want to use to encrypt the private keys.

### Options

- `-h, --help`: Displays the help message for the `encryptprivatekeys` command.

## Important Notes

- Encrypting your private keys adds an additional layer of security to your wallet. You will need to provide the password every time you want to access the encrypted keys.
- Always remember the password you set. If you forget the password, you won't be able to access the encrypted private keys, which means you might lose access to your funds.
