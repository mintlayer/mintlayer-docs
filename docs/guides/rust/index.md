---
title: "Rust Guides"
description: "The Mintlayer workflows in Rust: the mintlayer-sdk sub-clients plus native cryptography for full-custody transaction building."
sidebar_position: 1
---

# Rust Guides

These guides implement Mintlayer's main workflows with the [Rust SDK](../../build/sdks/rust/index.md) (`mintlayer-sdk`). The `wallet` sub-client talks to a running `wallet-rpc-daemon`, the `indexer` client reads chain state, and the `crypto` module builds and signs transactions natively, with no wallet daemon in the loop. Start with the SDK [overview](../../build/sdks/rust/index.md) for features and the mandatory `parity-scale-codec` patch when using the `crypto` feature.

The wallet-cli versions of the same workflows live in the [command-line guides](../cli/index.md); the [Go](../go/index.md), [JavaScript](../javascript/index.md), and [Python](../python/index.md) versions in their own sections.

| Guide | Contents |
| ----- | -------- |
| [Issue a token](issue-token.md) | MLS-01 lifecycle: issue, mint, transfer, freeze, authority |
| [Issue an NFT](issue-nft.md) | MLS-03 issuance and transfers |
| [Staking and delegation](staking.md) | Pool lifecycle and delegations |
| [Trading with orders](trading-with-orders.md) | On-chain orders: create, discover, fill, conclude |
| [Atomic swap](atomic-swap.md) | The Mintlayer side of a BTC ⇄ ML swap with HTLCs |

For full-custody transaction building beyond these recipes, see [Building transactions](../../build/sdks/rust/transactions.md) in the SDK reference; runnable programs live in the repository under [examples/](https://github.com/mintlayer/rust-sdk/tree/main/examples).
