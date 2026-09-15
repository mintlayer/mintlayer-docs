---
title: "wallet-show-seed-phrase"
sidebar_position: 132
---

Show the seed phrase for the loaded wallet if it has been stored.

## Usage

```
wallet-show-seed-phrase
```

## Notes

This command is available in cold wallet mode (`--cold-wallet`). The seed phrase is only available if it was stored when the wallet was created or recovered (i.e. using the `store-seed-phrase` option). If it was not stored, or has been purged with `wallet-purge-seed-phrase`, this command will return nothing.

Keep the seed phrase secure, anyone who has it can fully recover the wallet and access all funds.

## Related

- [`wallet-purge-seed-phrase`](wallet-purge-seed-phrase-command-guide.md): Delete the seed phrase from the wallet database.
- [`wallet-create`](wallet-create-command-guide.md): Create a wallet and choose whether to store the seed phrase.
