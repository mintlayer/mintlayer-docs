---
title: "staking decommission-pool-request"
sidebar_position: 80
---

> **Legacy spelling:** this command was previously spelled `staking-decommission-pool-request`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Create a request to decommission a pool. This assumes that the decommission key is owned by another wallet.

The output of this command should be passed to `transaction sign` in the wallet that owns the decommission key. The result from signing, assuming success, can then be broadcast to the network to commence the decommissioning.

## Usage

```
staking decommission-pool-request <POOL_ID> <OUTPUT_ADDRESS>
```

## Arguments

- **`<POOL_ID>`**: The id of the pool to decommission.

- **`<OUTPUT_ADDRESS>`**: The address that will receive the staker's balance (both pledge and proceeds from staking).

## Workflow

This command is used when the decommission key is held in a separate (e.g. cold) wallet:

1. Run `staking decommission-pool-request` in the hot wallet to produce an unsigned transaction hex.
2. Transfer the hex to the cold wallet.
3. Run `transaction sign <HEX>` in the cold wallet to sign it.
4. Broadcast the signed transaction with `node submit-transaction`.

## Related

- [`staking decommission-pool`](staking-decommission-pool-command-guide.md): Decommission directly when the decommission key is in the current wallet.
- [`transaction sign`](../transactions/transaction-sign-command-guide.md): Sign the unsigned transaction in the wallet holding the decommission key.
- [`node submit-transaction`](../node-control/node-submit-transaction-command-guide.md): Broadcast the signed transaction.
