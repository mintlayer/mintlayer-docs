---
deprecated: true
title: "`createwallet` Command Guide"
sidebar_position: 24
---
:::note[Deprecated command name]

This page documents a legacy command name. In current wallet versions the command is called [`wallet-create`](wallet-create-command-guide.md).

:::



The `createwallet` command is used to create a new wallet in Mintlayer.

## Usage

```
createwallet <WALLET_PATH> <SAVE_SEED_PHRASE> [MNEMONIC]
```

### Arguments

- `<WALLET_PATH>`: Specifies the file path where the wallet will be created.
  
- `<SAVE_SEED_PHRASE>`: Determines how the seed phrase is stored.
  - `store-seed-phrase`: The seed phrase will be stored in the wallet file.
  - `do-not-store-seed-phrase`: The seed phrase will only be displayed on the screen. This option can be seen as a security measure to ensure secrecy in case the seed phrase is reused elsewhere or if this wallet is compromised.

- `[MNEMONIC]`: Optional argument. It represents the mnemonic phrase which can be 12, 15, or 24 words. This should be provided as a single quoted argument. If not specified, a new mnemonic phrase will be generated and displayed.

### Options

- `-h, --help`: Displays the help message for the `createwallet` command.

## Examples

To create a new wallet with the seed phrase stored in the wallet file:

```
createwallet /path/to/wallet.dat store-seed-phrase
```

To create a new wallet without storing the seed phrase in the wallet file:

```
createwallet /path/to/wallet.dat do-not-store-seed-phrase
```

To create a new wallet with a specific mnemonic:

```
createwallet /path/to/wallet.dat store-seed-phrase 'word1 word2 word3 ... word12'
```

## Important Notes

- Always remember to back up your seed phrase securely. Losing access to your seed phrase means losing access to your wallet and funds.
- If you choose not to store the seed phrase in the wallet file, ensure you note it down and store it in a secure location.
