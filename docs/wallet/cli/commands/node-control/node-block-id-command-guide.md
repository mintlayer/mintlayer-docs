---
title: "node block-id"
sidebar_position: 44
---

> **Legacy spelling:** this command was previously spelled `node-block-id`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Get the block id of the block at a given height.

## Usage

```
node block-id <HEIGHT>
```

## Arguments

- **`<HEIGHT>`**: The block height to query.

## Examples

```
node block-id 100000
```

## Related

- [`node best-block --id`](node-best-block-command-guide.md): Get the current best block id.
- [`node block`](node-block-command-guide.md): Get a full block by its id.
