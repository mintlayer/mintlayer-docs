---
title: "exit"
sidebar_position: 30
---

Exit the wallet.

## Usage

```
exit
```

## Notes

This command is available in cold wallet mode (`--cold-wallet`). To also shut down a connected RPC interface or remote wallet before exiting, use `rpc-shutdown-and-exit` instead.

## Related

- [`rpc-shutdown-and-exit`](../node-control/rpc-shutdown-and-exit-command-guide.md): Shutdown the RPC interface and exit.
- [`wallet-close`](wallet-close-command-guide.md): Close the wallet file without exiting the REPL.
