---
title: "account rename"
sidebar_position: 5
---

> **Legacy spelling:** this command was previously spelled `account-rename`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Renames the selected account with an optional name. If the name is not specified, it will remove any existing name for the account.

## Usage

```
account rename [NAME]
```

## Arguments

- **`[NAME]`**: The new name for the account. If omitted, the account's name is removed.

## Examples

```
# Rename the current account
account rename "Trading"

# Remove the name from the current account
account rename
```
