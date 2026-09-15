---
title: "standalone-add-multisig"
sidebar_position: 92
---

Add a new standalone multi-signature address.

Use the `transaction-compose` command to use the new multisig address as input or output.

## Usage

```
standalone-add-multisig [OPTIONS] <MIN_REQUIRED_SIGNATURES> [PUBLIC_KEYS]...
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
standalone-add-multisig 2 <pubkey1> <pubkey2> <pubkey3>

# Create a 2-of-3 multisig with a label, skipping rescan
standalone-add-multisig --label "Treasury" --no-rescan true 2 <pubkey1> <pubkey2> <pubkey3>
```

## Related

- [`transaction-compose`](../transactions/transaction-compose-command-guide.md): Use the multisig address as an input or output in a transaction.
- [`standalone-multisig-utxos`](standalone-multisig-utxos-command-guide.md): List UTXOs owned by multisig addresses.
- [`standalone-address-show`](standalone-address-show-command-guide.md): List all standalone addresses.
