---
title: "node best-block"
description: "Show the best block id, height, and timestamp; pass flags to show a subset."
sidebar_position: 41
---

> **Legacy spelling:** this command was previously spelled `node-best-block`, `node-best-block-id`, `node-best-block-height`, or `node-best-block-timestamp`. All spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Returns the best block known to the node: its id, height, and timestamp. Pass one or more flags to show a subset; without flags, everything is shown.

## Usage

```
node best-block [--id] [--height] [--timestamp]
```

## Options

- **`--id`**: Show the best block id.
- **`--height`**: Show the best block height.
- **`--timestamp`**: Show the best block timestamp.

## Examples

```
node best-block --id
node best-block --height
node best-block --timestamp
```

## Related

- [`node block-id`](node-block-id-command-guide.md): Get the block id at a specific height.
- [`node block`](node-block-command-guide.md): Get a block by its id.
- [`node chainstate-info`](node-chainstate-info-command-guide.md): Returns the node's chainstate information.
