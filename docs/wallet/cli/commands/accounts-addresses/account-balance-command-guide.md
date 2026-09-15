---
title: "account-balance"
sidebar_position: 2
---

Get the total balance in the selected account in this wallet. See available options to include more categories, like locked coins.

## Usage

```
account-balance [WITH_LOCKED] [UTXO_STATES]...
```

## Arguments

- **`[WITH_LOCKED]`**: Whether to include locked outputs (outputs that cannot be spent and need time to mature).
  - Default: `unlocked`
  - Possible values: `any`, `unlocked`, `locked`

- **`[UTXO_STATES]...`**: The state of UTXOs to include. Multiple values can be specified.
  - Default: `confirmed`
  - Possible values: `confirmed`, `conflicted`, `in-mempool`, `inactive`, `abandoned`

## Examples

```
# Show confirmed, spendable balance only (default)
account-balance

# Include locked outputs as well
account-balance any

# Show balance including unconfirmed (mempool) transactions
account-balance unlocked in-mempool

# Show all balance categories
account-balance any confirmed in-mempool
```
