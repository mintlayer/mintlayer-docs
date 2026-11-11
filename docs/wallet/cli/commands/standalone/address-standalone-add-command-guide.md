---
title: "address standalone add"
sidebar_position: 94
---

> **Legacy spelling:** this command was previously spelled `standalone-add-watch-only-address`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Add a new standalone watch-only address not derived from the selected account's key chain.

A watch-only address allows the wallet to track its balance and transactions, but cannot be used to spend funds.

## Usage

```
address standalone add [OPTIONS] <ADDRESS>
```

## Arguments

- **`<ADDRESS>`**: The address to watch.

## Options

- **`--label <LABEL>`**: Optionally assign a label to the new address.

- **`--no-rescan <NO_RESCAN>`**: Skip rescanning the blockchain after adding the address.
  - Possible values: `true`, `false`

## Examples

```
# Add a watch-only address with a label
address standalone add --label "Exchange deposit" <address>
```

## Notes

Since v1.4.1, the announced blockchain rescan completes before the command returns, so subsequent commands see the wallet fully synced (previously the process could exit before the background rescan finished).

## Related

- [`address standalone list`](address-standalone-list-command-guide.md): List all standalone addresses.
- [`address standalone add-private-key`](address-standalone-add-private-key-command-guide.md): Add a standalone address with spending capability.
