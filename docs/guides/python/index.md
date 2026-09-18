---
title: "Python Guides"
description: "The Mintlayer workflows in Python: the mintlayer SDK's sub-clients plus the embedded WASM runtime for full-custody transaction building."
sidebar_position: 1
---

# Python Guides

These guides implement Mintlayer's main workflows with the [Python SDK](../../build/sdks/python/index.md) (`pip install mintlayer`), a port of the Go SDK: the `wallet` sub-client talks to a running `wallet-rpc-daemon`, the `indexer` client reads chain state, and the `wasm` module builds and signs transactions standalone, with no wallet daemon in the loop (see [Developer Setup](../../build/development.md) for ports and authentication).

The wallet-cli versions of the same workflows live in the [command-line guides](../cli/index.md); the [Go](../go/index.md), [JavaScript](../javascript/index.md), and [Rust](../rust/index.md) versions in their own sections.

| Guide | Contents |
| ----- | -------- |
| [Issue a token](issue-token.md) | MLS-01 lifecycle: issue, mint, transfer, freeze, authority |
| [Issue an NFT](issue-nft.md) | MLS-03 issuance and transfers |
| [Staking and delegation](staking.md) | Pool lifecycle and delegations |
| [Trading with orders](trading-with-orders.md) | On-chain orders: create, discover, fill, conclude |
| [Atomic swap](atomic-swap.md) | The Mintlayer side of a BTC ⇄ ML swap with HTLCs |
| [Wallet & signing (WASM)](wallet-wasm.md) | Generate wallets, derive addresses, sign without a daemon |
| [Forging custom transactions](custom-transactions.md) | Mixed inputs/outputs, protocol fees, multi-party signing, intents |
| [Composing UTXOs](utxo-composition.md) | Update an order atomically: conclude input + create output |
