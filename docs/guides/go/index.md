---
title: "Go Guides"
description: "The Mintlayer workflows in Go: the go-sdk wallet client, indexer reads, and the embedded WASM runtime for full-custody transaction building."
sidebar_position: 1
---

# Go Guides

These guides implement Mintlayer's main workflows with the [Go SDK](../../build/sdks/go/index.md) (`go get github.com/mintlayer/go-sdk`). The `wallet` sub-client talks to a running `wallet-rpc-daemon`, the `indexer` client reads chain state, and the `wasm` package builds and signs transactions standalone, with no wallet daemon (see [Developer Setup](../../build/development.md) for ports and authentication).

The wallet-cli versions of the same workflows live in the [command-line guides](../cli/index.md); the JavaScript versions in the [JavaScript guides](../javascript/index.md).

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
