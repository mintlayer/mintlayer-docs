---
title: "Command-line Guides"
description: "Step-by-step Mintlayer guides using wallet-cli: issue tokens and NFTs, run a staking pool, trade with orders, manage multisig, and atomic swaps with Bitcoin."
sidebar_position: 1
---

# Command-line Guides

These guides walk through Mintlayer's main workflows with `wallet-cli`, the interactive command-line wallet. They are the reference versions of the workflows: the [Go](../go/index.md), [JavaScript](../javascript/index.md), and [Rust](../rust/index.md) guides implement the same flows in code.

Prerequisites for all of them: a running, synced `node-daemon`, `wallet-cli` connected to the node (see [installation](../../getting-started/install/index.md)), and a small amount of ML for transaction fees. Examples use **testnet** values (TML); on mainnet the commands are identical apart from the network.

| Guide | Contents |
| ----- | -------- |
| [Managing a staking pool](managing-a-staking-pool.md) | Pool lifecycle: create, operate, decommission; delegation flow |
| [Issuing and managing a token](issue-new-token.md) | MLS-01 lifecycle: issue, mint, send, freeze, lock supply |
| [Issuing and managing an NFT](issuing-and-managing-an-nft.md) | MLS-03 issuance and transfers |
| [Trading with orders](trading-with-orders.md) | On-chain DEX orders: create, fill, freeze, conclude |
| [Atomic swap with Bitcoin](atomic-swap-with-bitcoin.md) | Trustless BTC ⇄ ML swaps with hash time-locked contracts |
| [Managing a multisig address](managing-a-multisig-address.md) | Multi-signature addresses and spending |
| [Migrate token to mainnet](migrate-erc20-token-to-mainnet.md) | Convert ERC-20 ML tokens to mainnet coins |
