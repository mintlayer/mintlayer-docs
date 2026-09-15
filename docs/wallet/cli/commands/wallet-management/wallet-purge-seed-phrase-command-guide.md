---
title: "wallet-purge-seed-phrase"
sidebar_position: 128
---

Delete the seed phrase from the loaded wallet's database, if it has been stored.

## Usage

```
wallet-purge-seed-phrase
```

## Notes

This command is available in cold wallet mode (`--cold-wallet`). Once purged, the seed phrase cannot be recovered from the wallet file. Make sure you have a secure backup of the seed phrase before purging.

## Related

- [`wallet-show-seed-phrase`](wallet-show-seed-phrase-command-guide.md): Show the stored seed phrase before purging.
