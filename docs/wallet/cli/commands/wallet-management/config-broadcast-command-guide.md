---
title: "config-broadcast"
sidebar_position: 20
---

Configure broadcasting to Mempool to yes or no.

If set to `no`, any command that creates a transaction will return it to the user and not submit it automatically. The transaction will need to be submitted manually with `node-submit-transaction`.

The effect of this setting is not preserved when the CLI wallet is closed.

## Usage

```
config-broadcast <BROADCAST>
```

## Arguments

- **`<BROADCAST>`**: Possible values: `yes`, `no`

## Examples

```
# Disable automatic broadcasting
config-broadcast no

# Re-enable automatic broadcasting
config-broadcast yes
```

## Related

- [`node-submit-transaction`](../node-control/node-submit-transaction-command-guide.md): Manually submit a transaction to the mempool.
