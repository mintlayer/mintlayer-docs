---
title: "node-list-discouraged-peers"
sidebar_position: 53
---

List discouraged peers in the node.

Discouraged peers are peers that have accumulated a bad score but have not yet reached the ban threshold. The node will avoid connecting to them but does not block them entirely.

## Usage

```
node-list-discouraged-peers
```

## Related

- [`node-undiscourage-peer-address`](node-undiscourage-peer-address-command-guide.md): Remove discouragement from a peer.
- [`node-list-banned-peers`](node-list-banned-peers-command-guide.md): List fully banned peers.
