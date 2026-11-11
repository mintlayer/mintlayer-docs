---
title: "peer discouraged"
sidebar_position: 53
---

> **Legacy spelling:** this command was previously spelled `node-list-discouraged-peers`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

List discouraged peers in the node.

Discouraged peers are peers that have accumulated a bad score but have not yet reached the ban threshold. The node will avoid connecting to them but does not block them entirely.

## Usage

```
peer discouraged
```

## Related

- [`peer undiscourage`](peer-undiscourage-command-guide.md): Remove discouragement from a peer.
- [`peer banned`](peer-banned-command-guide.md): List fully banned peers.
