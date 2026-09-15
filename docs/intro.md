---
sidebar_position: 0
title: Introduction
---

# Mintlayer Documentation

Mintlayer is a Bitcoin sidechain with a built-in PoS consensus, native token issuance (MLS-01/MLS-02), and DeFi primitives such as atomic swaps and order-based trading. This site covers everything from running a node to building dApps on top of the network.

## Where to start

- **Run a node**, [install](getting-started/index.md) from source, binaries, or Docker, then follow the [upgrade guide](node/upgrading/index.md) to stay current.
- **Use the wallet**, the [Wallet CLI reference](wallet/cli/commands.md) documents every command; for automation use the [Wallet RPC API](wallet/rpc/overview.md).
- **Issue a token**, the [token guide](guides/issue-new-token.md) walks through issuing, minting, and sending MLS-01 tokens; there is a separate guide for [NFTs](guides/issuing-and-managing-an-nft.md).
- **Use the Mojito Wallet**, the non-custodial mobile and browser-extension wallet: see [Mojito Wallet](wallet/mojito-wallet.md).
- **Build dApps**, integrate wallets with the [JavaScript SDK](build/sdks/javascript/getting-started.md) or [Mojito Inject](build/sdks/javascript/getting-started.md), and query chain data via the [API](api/index.md).

## Documentation map

| Section | Contents |
| ------- | -------- |
| [Getting Started](getting-started/index.md) | Node vs. wallet, installation methods |
| [Guides](guides/managing-a-staking-pool.md) | Staking pools, tokens, NFTs, multisig, orders, atomic swaps |
| [Node](node/index.md) | Running, upgrading, firewall, node commands |
| [Wallet](wallet/mojito-wallet.md) | Mojito Wallet, addresses, Wallet CLI, Wallet RPC, Trezor |
| [API](api/index.md) | Indexer REST API: endpoints, conventions |
| [Build](build/index.md) | SDKs (Go, JavaScript), developer setup, Mojito Inject, MCP, Bridge |
| [Whitepaper](whitepaper/1-blockchain-architecture.md) | Protocol concepts and design |
| [Reference](reference/block-and-transaction-serialization.md) | Serialization, CLI reference, advanced tools |
| [FAQ](faq.md) | Testnet tokens, fees, finality, staking requirements |

For the protocol design behind Mintlayer, see the [whitepaper](whitepaper/1-blockchain-architecture.md).
