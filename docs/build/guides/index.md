---
title: "Guides for Developers"
description: "The Mintlayer guides re-implemented with the JavaScript and Go SDKs: tokens, NFTs, staking, orders, and atomic swaps, no wallet-cli required."
sidebar_position: 1
---

# Guides for Developers

The step-by-step guides in the [Wallet guides](/docs/category/guides) are written around `wallet-cli`. This section mirrors the same workflows with **code**: the [JavaScript SDK](../sdks/javascript/index.md) for dApps and bots, and the [Go SDK](../sdks/go/index.md) for services and backends.

Where a workflow has no SDK equivalent (yet), the table says so and points at the CLI guide instead.

| Workflow | Developer guide | JavaScript | Go |
| -------- | --------------- | ---------- | -- |
| Issue and manage a fungible token | [Issue a token](issue-token.md) | ✅ `Client` | ✅ wallet + wasm |
| Issue and manage an NFT | [Issue an NFT](issue-nft.md) | ✅ `Client` | ✅ wallet + indexer |
| Run a staking pool / delegate | [Staking and delegation](staking.md) | ✅ delegations | ✅ pools + delegations |
| Trade with on-chain orders | [Trading with orders](trading-with-orders.md) | ✅ `Client` | ✅ indexer + wasm |
| Atomic swap with Bitcoin (HTLC) | [Atomic swap](atomic-swap.md) | ✅ `Client` | ✅ wasm |
| Manage a multisig address | CLI only | ❌ | ❌ |
| Migrate ERC-20 ML to mainnet | portal only | n/a | n/a |

WASM-specific deep dives (Go SDK, full custody, no wallet daemon):

| Guide | Contents |
| ----- | -------- |
| [Wallet & signing](wallet-wasm.md) | Generate/restore wallets, derive addresses, sign transactions and messages |
| [Forging custom transactions](custom-transactions.md) | Mixed inputs/outputs, protocol fees, fee estimation, multi-party signing, intents |
| [Composing UTXOs](utxo-composition.md) | Update an order atomically: conclude-order input + create-order output |

For the CLI version of any workflow, follow the link in the [Wallet guides](/docs/category/guides); every page here also links back to its CLI counterpart for the protocol-level explanation and concepts.

## Prerequisites

- **JavaScript**: `npm install @mintlayer/sdk`; see the [SDK Client](../sdks/javascript/getting-started.md) page for creation options and [account providers](../sdks/javascript/account-providers.md) for running outside a browser.
- **Go**: `go get github.com/mintlayer/go-sdk`: the `wallet` sub-client talks to a running `wallet-rpc-daemon`, the `wasm` package builds transactions standalone, and the `indexer` client reads chain state (see [Developer Setup](../development.md) for ports and authentication).
