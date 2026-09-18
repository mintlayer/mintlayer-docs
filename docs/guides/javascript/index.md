---
title: "JavaScript Guides"
description: "The Mintlayer workflows in JavaScript: @mintlayer/sdk's Client with the Mojito wallet in the browser or standalone providers in Node.js."
sidebar_position: 1
---

# JavaScript Guides

These guides implement Mintlayer's main workflows with the [JavaScript SDK](../../build/sdks/javascript/index.md) (`npm install @mintlayer/sdk`). In the browser the `Client` talks to the [Mojito wallet](../../wallet/mojito-wallet.md) extension; in Node.js use the standalone [account providers](../../build/sdks/javascript/account-providers.md). Start with the [SDK Client](../../build/sdks/javascript/getting-started.md) page for creation options.

The wallet-cli versions of the same workflows live in the [command-line guides](../cli/index.md); the Go versions in the [Go guides](../go/index.md), and the Rust versions in the [Rust guides](../rust/index.md).

| Guide | Contents |
| ----- | -------- |
| [Issue a token](issue-token.md) | MLS-01 lifecycle: issue, mint, transfer, freeze, authority |
| [Issue an NFT](issue-nft.md) | MLS-03 issuance and transfers |
| [Staking and delegation](staking.md) | Create a delegation, stake, withdraw |
| [Trading with orders](trading-with-orders.md) | On-chain orders: create, discover, fill, conclude |
| [Atomic swap](atomic-swap.md) | The Mintlayer side of a BTC ⇄ ML swap with HTLCs |
