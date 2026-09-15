---
title: "account-create"
sidebar_position: 3
---

Creates a new account with an optional name.

Returns an error if the last created account does not have a transaction history.

## Usage

```
account-create [NAME]
```

## Arguments

- **`[NAME]`**: Optional name for the new account.

## Examples

```
# Create an unnamed account
account-create

# Create a named account
account-create "Savings"
```
