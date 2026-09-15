---
title: "wallet-open"
sidebar_position: 127
---

Open an existing wallet file.

## Usage

```
wallet-open <COMMAND>
```

## Commands

| Command | Description |
|---------|-------------|
| `software` | Open a software wallet |
| `trezor` | *(Beta)* Open a wallet connected to a Trezor hardware wallet |

---

## wallet-open software

```
wallet-open software [OPTIONS] <WALLET_PATH> [ENCRYPTION_PASSWORD]
```

### Arguments

- **`<WALLET_PATH>`**: File path of the wallet file.

- **`[ENCRYPTION_PASSWORD]`**: *(Optional)* The decryption password, if the wallet is encrypted.

### Options

- **`--force-change-wallet-type`**: Force-change the wallet type between hot and cold.

---

## wallet-open trezor *(Beta)*

Open a wallet file associated with a Trezor hardware wallet.

```
wallet-open trezor [OPTIONS] <WALLET_PATH> [ENCRYPTION_PASSWORD]
```

### Arguments

- **`<WALLET_PATH>`**: File path of the wallet file.

- **`[ENCRYPTION_PASSWORD]`**: *(Optional)* The decryption password, if the wallet is encrypted.

### Options

- **`--device-id <DEVICE_ID>`**: *(Optional)* The ID of the Trezor device to use, if multiple devices are connected. If not specified and multiple devices are present, a selection prompt will appear.

---

## Related

- [`wallet-create`](wallet-create-command-guide.md): Create a new wallet file.
- [`wallet-recover`](wallet-recover-command-guide.md): Recover a wallet from a seed phrase.
- [`wallet-close`](wallet-close-command-guide.md): Close the currently opened wallet.
