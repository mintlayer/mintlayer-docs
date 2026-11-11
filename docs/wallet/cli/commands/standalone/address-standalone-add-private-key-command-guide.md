---
title: "address standalone add-private-key"
sidebar_position: 93
---

> **Legacy spelling:** this command was previously spelled `standalone-add-private-key-from-hex`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Add a new standalone private key not derived from the selected account's key chain.

## Usage

```
address standalone add-private-key [OPTIONS] <HEX_PRIVATE_KEY>
```

## Arguments

- **`<HEX_PRIVATE_KEY>`**: The hex encoded private key to add to the selected account.

## Options

- **`--label <LABEL>`**: Optionally assign a label to the new address.

- **`--no-rescan <NO_RESCAN>`**: Skip rescanning the blockchain after adding the key.
  - Possible values: `true`, `false`

## Examples

```
# Import an externally generated private key
address standalone add-private-key <hex-private-key> --label "Imported key"
```

## Notes

This is useful for importing keys generated externally or from another wallet. The imported key is stored independently from the wallet's HD key chain.

Since v1.4.1, the announced blockchain rescan completes before the command returns, so subsequent commands see the wallet fully synced (previously the process could exit before the background rescan finished).

## Related

- [`address standalone list`](address-standalone-list-command-guide.md): List all standalone addresses.
- [`address standalone add`](address-standalone-add-command-guide.md): Add a watch-only address (no spending).
