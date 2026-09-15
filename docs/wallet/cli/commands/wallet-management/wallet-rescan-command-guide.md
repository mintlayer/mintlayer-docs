---
title: "wallet-rescan"
sidebar_position: 130
---

Rescan the blockchain and re-detect all operations related to the selected account in this wallet.

## Usage

```
wallet-rescan
```

## Notes

Use this if the wallet appears to be missing transactions or showing an incorrect balance. The rescan starts from the beginning of the blockchain and may take some time to complete.

## Related

- [`wallet-sync`](wallet-sync-command-guide.md): Scan only the remaining unprocessed blocks (faster than a full rescan).
