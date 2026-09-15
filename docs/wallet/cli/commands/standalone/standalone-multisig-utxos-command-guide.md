---
title: "standalone-multisig-utxos"
sidebar_position: 98
---

Lists all the UTXOs owned by multisig addresses watched by this account.

## Usage

```
standalone-multisig-utxos [UTXO_TYPE] [WITH_LOCKED] [UTXO_STATES]...
```

## Arguments

- **`[UTXO_TYPE]`**: The type of UTXOs to list.
  - Default: `all`
  - Possible values: `all`, `transfer`, `lock-then-transfer`, `create-stake-pool`, `produce-block-from-stake`

- **`[WITH_LOCKED]`**: Whether to include locked outputs.
  - Default: `unlocked`
  - Possible values: `any`, `unlocked`, `locked`

- **`[UTXO_STATES]...`**: The state of the UTXOs to include. Multiple values can be specified.
  - Default: `confirmed`
  - Possible values: `confirmed`, `conflicted`, `in-mempool`, `inactive`, `abandoned`

## Examples

```
# List all confirmed, spendable multisig UTXOs (default)
standalone-multisig-utxos

# Include locked outputs
standalone-multisig-utxos all any

# Include unconfirmed UTXOs
standalone-multisig-utxos all unlocked in-mempool
```

## Related

- [`standalone-add-multisig`](standalone-add-multisig-command-guide.md): Add a multisig address.
- [`account-utxos`](../accounts-addresses/account-utxos-command-guide.md): List UTXOs for regular account addresses.
