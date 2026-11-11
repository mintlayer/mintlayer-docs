---
title: "peer reserved add"
sidebar_position: 39
---

> **Legacy spelling:** this command was previously spelled `node-add-reserved-peer`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Add a reserved peer in the node.

Reserved peers are always kept connected to, regardless of the normal peer management logic.

## Usage

```
peer reserved add <ADDRESS>
```

## Arguments

- **`<ADDRESS>`**: The address of the peer to add (IP address and port).

## Related

- [`peer reserved remove`](peer-reserved-remove-command-guide.md): Remove a reserved peer.
- [`peer reserved list`](peer-reserved-list-command-guide.md): List all reserved peers.
