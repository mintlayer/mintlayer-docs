---
title: "openwallet"
sidebar_position: 63
---
:::note[Deprecated command name]

This page documents a legacy command name. In current wallet versions the command is called [`wallet-open`](wallet-open-command-guide.md).

:::



The `openwallet` command is used to open an existing wallet in Mintlayer.

## Usage

```
openwallet <WALLET_PATH> [PASSWORD]
```

### Arguments

- `<WALLET_PATH>`: Specifies the file path of the existing wallet you want to open.
  
- `[PASSWORD]`: Optional argument. If the wallet is encrypted, provide the password to unlock it.

### Options

- `-h, --help`: Displays the help message for the `openwallet` command.

## Examples

To open a wallet:

```
openwallet /path/to/existing/wallet.dat
```

To open an encrypted wallet:

```
openwallet /path/to/existing/wallet.dat yourpasswordhere
```

## Important Notes

- If the wallet is encrypted and you provide the wrong password, you won't be able to access the wallet.
- Always ensure you remember the password for encrypted wallets. Losing access to your password means losing access to your wallet and funds.
