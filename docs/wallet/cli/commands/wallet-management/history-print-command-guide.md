---
title: "history print"
sidebar_position: 32
---

> **Legacy spelling:** this command was previously spelled `history-print`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Print command history in the wallet for this execution.

## Usage

```
history print
```

## Notes

This command is available in cold wallet mode (`--cold-wallet`). History is session-only unless `--history-file` was specified at startup.

## Related

- [`history clear`](history-clear-command-guide.md): Clear the command history.
