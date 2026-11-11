---
title: "node submit-block"
sidebar_position: 58
---

> **Legacy spelling:** this command was previously spelled `node-submit-block`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Submit a block to be included in the chain.

## Usage

```
node submit-block <BLOCK>
```

## Arguments

- **`<BLOCK>`**: The hex encoded block to submit.

## Notes

Since v1.4.5 this command asks for confirmation. In non-interactive runs (`--exec`, `--commands-file`) pass `--yes` to proceed automatically.

## Related

- [`node generate-block`](node-generate-block-command-guide.md): Generate a block (regtest only).
