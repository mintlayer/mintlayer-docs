---
title: "node shutdown"
sidebar_position: 57
---

> **Legacy spelling:** this command was previously spelled `node-shutdown`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Shutdown the node.

## Usage

```
node shutdown
```

## Notes

Since v1.4.5 this command asks for confirmation. In non-interactive runs (`--exec`, `--commands-file`) pass `--yes` to proceed automatically.

This shuts down the connected `node-daemon` process. The wallet itself will continue running. To also exit the wallet, use `exit` or `rpc-shutdown-and-exit`.
