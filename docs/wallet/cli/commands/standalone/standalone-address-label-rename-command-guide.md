---
title: "standalone-address-label-rename"
sidebar_position: 96
---

Add, rename or delete a label for an already added standalone address.

Specifying a label will add or replace the existing one. Not specifying a label will remove the existing one.

## Usage

```
standalone-address-label-rename [OPTIONS] <ADDRESS>
```

## Arguments

- **`<ADDRESS>`**: The existing standalone address to update.

## Options

- **`--label <LABEL>`**: The new label to assign. Omit to remove the existing label.

## Examples

```
# Add or rename a label
standalone-address-label-rename --label "Cold storage" <address>

# Remove the existing label
standalone-address-label-rename <address>
```

## Related

- [`standalone-address-show`](standalone-address-show-command-guide.md): List all standalone addresses with their labels.
