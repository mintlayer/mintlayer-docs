---
title: "account-utxos"
sidebar_position: 8
---

Lists all the UTXOs owned by this account.

## Usage

```
account-utxos [UTXO_TYPE] [WITH_LOCKED] [UTXO_STATES]...
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
# List all confirmed, spendable UTXOs (default)
account-utxos

# List only transfer-type UTXOs
account-utxos transfer

# Include locked UTXOs
account-utxos all any

# Include unconfirmed (mempool) UTXOs
account-utxos all unlocked in-mempool
```
