---
title: "Guides"
description: "Step-by-step Mintlayer guides in five flavors: wallet-cli on the command line, Go, JavaScript, Rust, and Python, with room for more languages."
sidebar_position: 1
---

# Guides

The Mintlayer guides exist in five flavors, one folder per language or interface. They cover the same workflows: issuing tokens and NFTs, staking, trading with on-chain orders, and atomic swaps with Bitcoin.

| Section | For | Contents |
| ------- | --- | -------- |
| [Command-line guides](cli/index.md) | Operators and power users | Step-by-step walkthroughs with `wallet-cli` |
| [Go guides](go/index.md) | Services, exchanges, backends | The `go-sdk`: wallet RPC client and the embedded WASM runtime |
| [JavaScript guides](javascript/index.md) | dApps, bots, scripts | `@mintlayer/sdk`: the `Client` in the browser (Mojito) or Node.js |
| [Rust guides](rust/index.md) | Services and full-custody tooling | `mintlayer-sdk`: RPC sub-clients plus native crypto backed by mintlayer-core |
| [Python guides](python/index.md) | Scripts, tooling, data jobs | `mintlayer`: the Go SDK ported to Python, WASM runtime bundled |

New languages can be added alongside these; the workflows are the same, only the code changes.

## Workflow map

| Workflow | Command line | Go | JavaScript | Rust | Python |
| -------- | ------------ | -- | ---------- | ---- | ------ |
| Issue and manage a fungible token | [guide](cli/issue-new-token.md) | [guide](go/issue-token.md) | [guide](javascript/issue-token.md) | [guide](rust/issue-token.md) | [guide](python/issue-token.md) |
| Issue and manage an NFT | [guide](cli/issuing-and-managing-an-nft.md) | [guide](go/issue-nft.md) | [guide](javascript/issue-nft.md) | [guide](rust/issue-nft.md) | [guide](python/issue-nft.md) |
| Run a staking pool / delegate | [guide](cli/managing-a-staking-pool.md) | [guide](go/staking.md) (pools + delegations) | [guide](javascript/staking.md) (delegations) | [guide](rust/staking.md) (pools + delegations) | [guide](python/staking.md) (pools + delegations) |
| Trade with on-chain orders | [guide](cli/trading-with-orders.md) | [guide](go/trading-with-orders.md) | [guide](javascript/trading-with-orders.md) | [guide](rust/trading-with-orders.md) | [guide](python/trading-with-orders.md) |
| Atomic swap with Bitcoin (HTLC) | [guide](cli/atomic-swap-with-bitcoin.md) | [guide](go/atomic-swap.md) | [guide](javascript/atomic-swap.md) | [guide](rust/atomic-swap.md) | [guide](python/atomic-swap.md) |
| Manage a multisig address | [guide](cli/managing-a-multisig-address.md) | CLI only | CLI only | CLI only | CLI only |
| Migrate ERC-20 ML to mainnet | [guide](cli/migrate-erc20-token-to-mainnet.md) | Portal only | Portal only | Portal only | Portal only |

Deeper full-custody dives with the embedded WASM runtime (Go and Python, no wallet daemon): [Wallet & signing](go/wallet-wasm.md), [Forging custom transactions](go/custom-transactions.md), and [Composing UTXOs](go/utxo-composition.md), each also available in the [Python guides](python/index.md). The Rust equivalent is the native `crypto` module, covered by [Cryptography](../build/sdks/rust/crypto.md) and [Building transactions](../build/sdks/rust/transactions.md).
