---
title: "history clear"
sidebar_position: 31
---

> **Legacy spelling:** this command was previously spelled `history-clear`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Clear command history for this execution.

## Usage

```
history clear
```

## Notes

This command is available in cold wallet mode (`--cold-wallet`). Only clears the in-session history. If `--history-file` was specified at startup, the file on disk is not affected.

## Related

- [`history print`](history-print-command-guide.md): Print the command history.
