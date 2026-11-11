---
title: "address standalone rename-label"
sidebar_position: 96
---

> **Legacy spelling:** this command was previously spelled `standalone-address-label-rename`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Add, rename or delete a label for an already added standalone address.

Specifying a label will add or replace the existing one. Not specifying a label will remove the existing one.

## Usage

```
address standalone rename-label [OPTIONS] <ADDRESS>
```

## Arguments

- **`<ADDRESS>`**: The existing standalone address to update.

## Options

- **`--label <LABEL>`**: The new label to assign. Omit to remove the existing label.

## Examples

```
# Add or rename a label
address standalone rename-label --label "Cold storage" <address>

# Remove the existing label
address standalone rename-label <address>
```

## Related

- [`address standalone list`](address-standalone-list-command-guide.md): List all standalone addresses with their labels.
