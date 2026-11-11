---
title: "wallet create"
sidebar_position: 122
---

> **Legacy spelling:** this command was previously spelled `wallet-create`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Create a new wallet. This will create a new file without scanning the blockchain.

Use this command if the seed phrase is brand new and has no associated transactions. If the seed phrase has been used in the past and may have associated transactions, use `wallet recover` instead.

## Usage

```
wallet create <COMMAND>
```

## Commands

| Command | Description |
|---------|-------------|
| `software` | Create a standard software wallet |
| `trezor` | *(Beta)* Create a wallet using a connected Trezor hardware wallet |
| `ledger` | *(Beta)* Create a wallet using a connected Ledger hardware wallet |

---

## wallet create software

```
wallet create software [OPTIONS] <WALLET_PATH> [MNEMONIC]
```

### Arguments

- **`<WALLET_PATH>`**: File path for the new wallet file.

- **`[MNEMONIC]`**: *(Optional)* An existing mnemonic phrase (12, 15, 18, 21, or 24 words, as a single quoted argument). If not specified, a new phrase is generated and printed. Alternatively, pass the mnemonic with `--mnemonic`.

### Options

- **`--store-seed-phrase <true|false>`**: Whether to store the seed phrase inside the wallet file or only print it on screen. Defaults to `true`.
  - `true` saves the seed phrase in the wallet file. Consider encrypting the wallet with `wallet encrypt` to protect it.
  - `false` means the seed phrase is only printed once and never saved. Use this as a security measure if the seed phrase is reused elsewhere.
- **`--mnemonic <WORDS>`**: The mnemonic phrase, as an alternative to the positional spelling. If both are given, they must agree.
- **`--passphrase <PASSPHRASE>`**: An optional passphrase to use alongside the mnemonic.

### Examples

```
# Create a new wallet, generate a new seed phrase, store it in the file (default)
wallet create software /path/to/wallet.dat

# Create a new wallet, print the seed phrase but do not store it
wallet create software /path/to/wallet.dat --store-seed-phrase=false

# Create a wallet from an existing mnemonic, do not store the phrase
wallet create software /path/to/wallet.dat --store-seed-phrase=false --mnemonic "word1 word2 ... word24"

# Create a wallet with a passphrase
wallet create software /path/to/wallet.dat --passphrase "my passphrase"
```

### Legacy positional spelling

Before v1.4.5 the storage choice was a mandatory positional argument placed before the mnemonic:

```
wallet create software /path/to/wallet.dat store-seed-phrase
wallet create software /path/to/wallet.dat do-not-store-seed-phrase "word1 word2 ... word24"
```

This spelling still works, but it is hidden from `help` and tab completion. When passing the mnemonic positionally, the legacy storage slot must still precede it; to skip that slot, pass the mnemonic with `--mnemonic` instead.

---

## wallet create trezor *(Beta)*

Create a wallet using a connected Trezor hardware wallet. Only the public keys are stored in the wallet file, the mnemonic stays on the device.

The mnemonic must have been set up on the device during its initial setup. The passphrase (if any) must be entered on the device each time it is connected.

```
wallet create trezor [OPTIONS] <WALLET_PATH>
```

### Arguments

- **`<WALLET_PATH>`**: File path for the new wallet file.

### Options

- **`--device-id <DEVICE_ID>`**: *(Optional)* The ID of the Trezor device to use, if multiple devices are connected. If not specified and multiple devices are present, a selection prompt will appear.

---

## wallet create ledger *(Beta)*

Create a wallet using a connected Ledger hardware wallet. Only the public keys are stored in the wallet file; the mnemonic and passphrase are managed on the device.

Depending on its configuration, the passphrase may need to be entered manually each time or may be applied automatically after unlocking with a secondary PIN.

```
wallet create ledger [OPTIONS] <WALLET_PATH>
```

### Arguments

- **`<WALLET_PATH>`**: File path for the new wallet file.

---

## Related

- [`wallet recover`](wallet-recover-command-guide.md): Recover a wallet from an existing seed phrase (scans the blockchain).
- [`wallet open`](wallet-open-command-guide.md): Open an existing wallet file.
- [`wallet encrypt`](wallet-encrypt-command-guide.md): Encrypt the wallet after creation.
