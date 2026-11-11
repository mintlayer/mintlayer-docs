---
title: "wallet recover"
sidebar_position: 129
---

> **Legacy spelling:** this command was previously spelled `wallet-recover`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Recover a wallet. This will create a new wallet file and scan the blockchain for associated transactions.

Use this command if the seed phrase has been used in the past. If the seed phrase is brand new, use `wallet create` instead, it skips the blockchain scan and is much faster.

## Usage

```
wallet recover <COMMAND>
```

## Commands

| Command | Description |
|---------|-------------|
| `software` | Recover a software wallet |
| `trezor` | *(Beta)* Recover a wallet using a connected Trezor hardware wallet |
| `ledger` | *(Beta)* Recover a wallet using a connected Ledger hardware wallet |

---

## wallet recover software

```
wallet recover software [OPTIONS] <WALLET_PATH> [MNEMONIC]
```

### Arguments

- **`<WALLET_PATH>`**: File path for the new wallet file.

- **`[MNEMONIC]`**: The mnemonic phrase to recover from (12, 15, 18, 21, or 24 words, as a single quoted argument). Required, either positionally or via `--mnemonic`. Note: when passing the mnemonic positionally, the legacy storage-choice slot precedes it; to skip that slot, pass the mnemonic with `--mnemonic` instead.

### Options

- **`--mnemonic <WORDS>`**: The mnemonic phrase, as an alternative to the positional spelling. If both are given, they must agree.
- **`--store-seed-phrase <true|false>`**: Whether to store the seed phrase inside the wallet file or only print it on screen. Defaults to `true`.
  - `true` saves the seed phrase in the wallet file. Consider encrypting the wallet with `wallet encrypt` to protect it.
  - `false` means the seed phrase is not saved. Use this as a security measure if the seed phrase is reused elsewhere.
- **`--passphrase <PASSPHRASE>`**: The passphrase associated with the mnemonic, if one was used.

### Examples

```
# Recover a wallet from a 24-word seed phrase
wallet recover software /path/to/wallet.dat --mnemonic "word1 word2 ... word24"

# Recover without storing the seed phrase in the wallet file
wallet recover software /path/to/wallet.dat --mnemonic "word1 word2 ... word24" --store-seed-phrase=false

# Recover with a passphrase
wallet recover software /path/to/wallet.dat --mnemonic "word1 word2 ... word24" --passphrase "my passphrase"
```

### Legacy positional spelling

Before v1.4.5 the storage choice was a mandatory positional argument placed before the mnemonic:

```
wallet recover software /path/to/wallet.dat store-seed-phrase "word1 word2 ... word24"
```

This spelling still works, but it is hidden from `help` and tab completion.

---

## wallet recover trezor *(Beta)*

Recover a wallet file associated with a Trezor hardware wallet. Only public keys are stored in the wallet file, the mnemonic remains on the device.

```
wallet recover trezor [OPTIONS] <WALLET_PATH>
```

### Arguments

- **`<WALLET_PATH>`**: File path for the new wallet file.

### Options

- **`--device-id <DEVICE_ID>`**: *(Optional)* The ID of the Trezor device to use, if multiple devices are connected. If not specified and multiple devices are present, a selection prompt will appear.

---

## wallet recover ledger *(Beta)*

Recover a wallet file associated with a Ledger hardware wallet. Only public keys are stored in the wallet file; the mnemonic remains on the device.

```
wallet recover ledger [OPTIONS] <WALLET_PATH>
```

### Arguments

- **`<WALLET_PATH>`**: File path for the new wallet file.

---

## Related

- [`wallet create`](wallet-create-command-guide.md): Create a wallet with a brand new seed phrase (no blockchain scan).
- [`wallet open`](wallet-open-command-guide.md): Open an existing wallet file.
- [`wallet encrypt`](wallet-encrypt-command-guide.md): Encrypt the wallet after recovery.
