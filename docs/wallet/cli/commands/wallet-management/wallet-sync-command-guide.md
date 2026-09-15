---
title: "wallet-sync"
sidebar_position: 133
---

Force the wallet to scan the remaining blocks from the node until the tip is reached.

## Usage

```
wallet-sync
```

## Notes

Unlike `wallet-rescan`, which starts from the beginning of the blockchain, `wallet-sync` only processes blocks that have not yet been scanned. Use this to catch up after the wallet has been offline or out of sync.

## Related

- [`wallet-rescan`](wallet-rescan-command-guide.md): Full rescan from the beginning of the blockchain.
