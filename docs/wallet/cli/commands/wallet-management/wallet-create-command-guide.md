---
title: "wallet-create"
sidebar_position: 122
---

Create a new wallet. This will create a new file without scanning the blockchain.

Use this command if the seed phrase is brand new and has no associated transactions. If the seed phrase has been used in the past and may have associated transactions, use `wallet-recover` instead.

## Usage

```
wallet-create <COMMAND>
```

## Commands

| Command | Description |
|---------|-------------|
| `software` | Create a standard software wallet |
| `trezor` | *(Beta)* Create a wallet using a connected Trezor hardware wallet |

---

## wallet-create software

```
wallet-create software [OPTIONS] <WALLET_PATH> <WHETHER_TO_STORE_SEED_PHRASE> [MNEMONIC]
```

### Arguments

- **`<WALLET_PATH>`**: File path for the new wallet file.

- **`<WHETHER_TO_STORE_SEED_PHRASE>`**: Whether to store the seed phrase inside the wallet file or only print it on screen.
  - `store-seed-phrase`, saves the seed phrase in the wallet file. Consider encrypting the wallet with `wallet-encrypt-private-keys` to protect it.
  - `do-not-store-seed-phrase`, the seed phrase is only printed once and never saved. Use this as a security measure if the seed phrase is reused elsewhere.

- **`[MNEMONIC]`**: *(Optional)* An existing mnemonic phrase (12, 15, or 24 words, as a single quoted argument). If not specified, a new phrase is generated and printed.

### Options

- **`--passphrase <PASSPHRASE>`**: An optional passphrase to use alongside the mnemonic.

### Examples

```
# Create a new wallet, generate a new seed phrase, store it in the file
wallet-create software /path/to/wallet.dat store-seed-phrase

# Create a wallet from an existing mnemonic, do not store the phrase
wallet-create software /path/to/wallet.dat do-not-store-seed-phrase "word1 word2 ... word24"

# Create a wallet with a passphrase
wallet-create software /path/to/wallet.dat store-seed-phrase --passphrase "my passphrase"
```

---

## wallet-create trezor *(Beta)*

Create a wallet using a connected Trezor hardware wallet. Only the public keys are stored in the wallet file, the mnemonic stays on the device.

The mnemonic must have been set up on the device during its initial setup. The passphrase (if any) must be entered on the device each time it is connected.

```
wallet-create trezor [OPTIONS] <WALLET_PATH>
```

### Arguments

- **`<WALLET_PATH>`**: File path for the new wallet file.

### Options

- **`--device-id <DEVICE_ID>`**: *(Optional)* The ID of the Trezor device to use, if multiple devices are connected. If not specified and multiple devices are present, a selection prompt will appear.

---

## Related

- [`wallet-recover`](wallet-recover-command-guide.md): Recover a wallet from an existing seed phrase (scans the blockchain).
- [`wallet-open`](wallet-open-command-guide.md): Open an existing wallet file.
- [`wallet-encrypt-private-keys`](wallet-encrypt-private-keys-command-guide.md): Encrypt the wallet after creation.
