---
title: "standalone-add-watch-only-address"
sidebar_position: 94
---

Add a new standalone watch-only address not derived from the selected account's key chain.

A watch-only address allows the wallet to track its balance and transactions, but cannot be used to spend funds.

## Usage

```
standalone-add-watch-only-address [OPTIONS] <ADDRESS>
```

## Arguments

- **`<ADDRESS>`**: The address to watch.

## Options

- **`--label <LABEL>`**: Optionally assign a label to the new address.

- **`--no-rescan <NO_RESCAN>`**: Skip rescanning the blockchain after adding the address.
  - Possible values: `true`, `false`

## Related

- [`standalone-address-show`](standalone-address-show-command-guide.md): List all standalone addresses.
- [`standalone-add-private-key-from-hex`](standalone-add-private-key-from-hex-command-guide.md): Add a standalone address with spending capability.
