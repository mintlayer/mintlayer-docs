---
title: "transaction-list-by-address"
sidebar_position: 116
---

List transactions owned by this account that have already been included in a block, with an optional address filter.

## Usage

```
transaction-list-by-address [OPTIONS] [ADDRESS]
```

## Arguments

- **`[ADDRESS]`**: *(Optional)* Filter results to only show transactions involving this address.

## Options

- **`--limit <LIMIT>`**: Maximum number of transactions to print. Default: `100`.

## Examples

```
# List the last 100 confirmed transactions
transaction-list-by-address

# List confirmed transactions for a specific address
transaction-list-by-address <address>

# List the last 10 confirmed transactions
transaction-list-by-address --limit 10

# List the last 10 confirmed transactions for a specific address
transaction-list-by-address --limit 10 <address>
```

## Related

- [`transaction-list-pending`](transaction-list-pending-command-guide.md): List unconfirmed pending transactions.
- [`transaction-get`](transaction-get-command-guide.md): Get a specific transaction by id.
