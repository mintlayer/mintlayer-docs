---
title: "standalone-add-private-key-from-hex"
sidebar_position: 93
---

Add a new standalone private key not derived from the selected account's key chain.

## Usage

```
standalone-add-private-key-from-hex [OPTIONS] <HEX_PRIVATE_KEY>
```

## Arguments

- **`<HEX_PRIVATE_KEY>`**: The hex encoded private key to add to the selected account.

## Options

- **`--label <LABEL>`**: Optionally assign a label to the new address.

- **`--no-rescan <NO_RESCAN>`**: Skip rescanning the blockchain after adding the key.
  - Possible values: `true`, `false`

## Notes

This is useful for importing keys generated externally or from another wallet. The imported key is stored independently from the wallet's HD key chain.

## Related

- [`standalone-address-show`](standalone-address-show-command-guide.md): List all standalone addresses.
- [`standalone-add-watch-only-address`](standalone-add-watch-only-address-command-guide.md): Add a watch-only address (no spending).
