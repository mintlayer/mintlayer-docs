---
title: "node-generate-block"
sidebar_position: 49
---

Generate a block with the given transactions to the specified reward destination.

If no transactions are provided, the block will be generated with available transactions from the mempool.

## Usage

```
node-generate-block [TRANSACTIONS]...
```

## Arguments

- **`[TRANSACTIONS]...`**: *(Optional)* Hex encoded transactions to include in the block. If omitted, transactions are taken from the mempool.

## Notes

This command is only useful in `regtest` mode. It is not available on mainnet or testnet where block production is handled by the staking process.
