---
title: "staking-start"
sidebar_position: 88
---

Start staking, assuming there are staking pools in the selected account in this wallet.

## Usage

```
staking-start
```

## Notes

The node must be running and the wallet must be synced before staking can begin. Use `staking-status` to confirm staking is active after starting.

Staking can also be started automatically on wallet launch with the `--start-staking-for-account <INDEX>` startup option.

## Related

- [`staking-stop`](staking-stop-command-guide.md): Stop staking.
- [`staking-status`](staking-status-command-guide.md): Show current staking status.
- [`staking-create-pool`](staking-create-pool-command-guide.md): Create a staking pool.
