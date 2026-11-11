---
title: "node p2p"
sidebar_position: 48
---

> **Legacy spelling:** this command was previously spelled `node-enable-p2p-networking`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Enable or disable p2p networking in the node.

## Usage

```
node p2p <ENABLE>
```

## Arguments

- **`<ENABLE>`**: Possible values: `enable`, `disable`

## Examples

```
# Disable networking (e.g. to operate in offline/maintenance mode)
node p2p disable

# Re-enable networking
node p2p enable
```
