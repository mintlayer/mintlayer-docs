---
title: "rpc-shutdown-and-exit"
sidebar_position: 72
---

Shutdown the RPC interface or the remote wallet it is connected to, and exit the wallet.

## Usage

```
rpc-shutdown-and-exit
```

## Notes

Use this instead of `exit` when the wallet CLI is connected to a `wallet-rpc-daemon` via `--remote-rpc-wallet-address`, or when the wallet CLI is running with its own RPC server enabled via `--enable-wallet-rpc-interface`. This command ensures the RPC service is cleanly shut down before exiting.

## Related

- [`exit`](../wallet-management/exit-command-guide.md): Exit the wallet without shutting down any RPC interface.
- [`node-shutdown`](node-shutdown-command-guide.md): Shutdown the connected node.
