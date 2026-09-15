---
title: "wallet-recover"
sidebar_position: 129
---

Recover a wallet. This will create a new wallet file and scan the blockchain for associated transactions.

Use this command if the seed phrase has been used in the past. If the seed phrase is brand new, use `wallet-create` instead, it skips the blockchain scan and is much faster.

## Usage

```
wallet-recover <COMMAND>
```

## Commands

| Command | Description |
|---------|-------------|
| `software` | Recover a software wallet |
| `trezor` | *(Beta)* Recover a wallet using a connected Trezor hardware wallet |

---

## wallet-recover software

```
wallet-recover software [OPTIONS] <WALLET_PATH> <WHETHER_TO_STORE_SEED_PHRASE> <MNEMONIC>
```

### Arguments

- **`<WALLET_PATH>`**: File path for the new wallet file.

- **`<WHETHER_TO_STORE_SEED_PHRASE>`**: Whether to store the seed phrase inside the wallet file.
  - `store-seed-phrase`, saves the seed phrase in the wallet file. Consider encrypting the wallet with `wallet-encrypt-private-keys` to protect it.
  - `do-not-store-seed-phrase`, the seed phrase is not saved. Use this as a security measure if the seed phrase is reused elsewhere.

- **`<MNEMONIC>`**: The mnemonic phrase to recover from (12, 15, or 24 words, as a single quoted argument).

### Options

- **`--passphrase <PASSPHRASE>`**: The passphrase associated with the mnemonic, if one was used.

### Examples

```
# Recover a wallet from a 24-word seed phrase
wallet-recover software /path/to/wallet.dat store-seed-phrase "word1 word2 ... word24"

# Recover with a passphrase
wallet-recover software /path/to/wallet.dat store-seed-phrase "word1 word2 ... word24" --passphrase "my passphrase"
```

---

## wallet-recover trezor *(Beta)*

Recover a wallet file associated with a Trezor hardware wallet. Only public keys are stored in the wallet file, the mnemonic remains on the device.

```
wallet-recover trezor [OPTIONS] <WALLET_PATH>
```

### Arguments

- **`<WALLET_PATH>`**: File path for the new wallet file.

### Options

- **`--device-id <DEVICE_ID>`**: *(Optional)* The ID of the Trezor device to use, if multiple devices are connected. If not specified and multiple devices are present, a selection prompt will appear.

---

## Related

- [`wallet-create`](wallet-create-command-guide.md): Create a wallet with a brand new seed phrase (no blockchain scan).
- [`wallet-open`](wallet-open-command-guide.md): Open an existing wallet file.
- [`wallet-encrypt-private-keys`](wallet-encrypt-private-keys-command-guide.md): Encrypt the wallet after recovery.
