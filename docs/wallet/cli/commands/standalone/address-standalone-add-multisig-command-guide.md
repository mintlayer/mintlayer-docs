---
title: "address standalone add-multisig"
sidebar_position: 92
---

> **Legacy spelling:** this command was previously spelled `standalone-add-multisig`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Add a new standalone multi-signature address.

Use the `transaction compose` command to use the new multisig address as input or output.

## Usage

```
address standalone add-multisig [OPTIONS] <MIN_REQUIRED_SIGNATURES> [PUBLIC_KEYS]...
```

## Arguments

- **`<MIN_REQUIRED_SIGNATURES>`**: The minimum number of signatures required out of the specified public keys (M in an M-of-N multisig).

- **`[PUBLIC_KEYS]...`**: The public keys from which to create the multisig. Each key is a participant in the multisig.

## Options

- **`--label <LABEL>`**: Optionally assign a label to the new address.

- **`--no-rescan <NO_RESCAN>`**: Skip rescanning the blockchain after adding the address.
  - Possible values: `true`, `false`

## Examples

```
# Create a 2-of-3 multisig
address standalone add-multisig 2 <pubkey1> <pubkey2> <pubkey3>

# Create a 2-of-3 multisig with a label, skipping rescan
address standalone add-multisig --label "Treasury" --no-rescan true 2 <pubkey1> <pubkey2> <pubkey3>
```

## Notes

Since v1.4.1, the announced blockchain rescan completes before the command returns, so subsequent commands see the wallet fully synced (previously the process could exit before the background rescan finished).

## Related

- [`transaction compose`](../transactions/transaction-compose-command-guide.md): Use the multisig address as an input or output in a transaction.
- [`address standalone utxos`](address-standalone-utxos-command-guide.md): List UTXOs owned by multisig addresses.
- [`address standalone list`](address-standalone-list-command-guide.md): List all standalone addresses.
