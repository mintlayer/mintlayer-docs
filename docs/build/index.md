---
title: Building on Mintlayer
description: Tools and APIs for building dApps and services on Mintlayer, SDKs, wallet integration, blockchain APIs, and the bridge.
sidebar_position: 2
---

# Building on Mintlayer

Mintlayer gives you the primitives, UTXO-based transactions, native token issuance (MLS-01/MLS-02), on-chain orders, and Bitcoin anchoring, plus the tooling to build on top of them. This page maps out what to use for what.

## Local development setup

For ports, RPC authentication, WebSocket subscriptions, regtest, and the WASM wrappers, start with the [Developer Setup](development.md) quick reference. For guided SDK walkthroughs of the workflows covered by the [wallet-cli guides](/docs/guides/cli) (tokens, NFTs, staking, orders, atomic swaps), see the [Guides for Developers](../guides/index.md).

## Integrate a wallet into your dApp

- **[Mojito Inject](mojito-inject.md)**, the Mojito browser extension injects a `window.mojito` provider, similar to MetaMask's `window.ethereum`. Request accounts, sign, and send transactions directly from your frontend.
- **[JavaScript SDK](sdks/javascript/index.md)**, a typed `Client` for the Mojito wallet extension, plus standalone key/mnemonic providers and a headless `WalletState` engine for scripts and bots.

## Use a full SDK

- **[Go SDK](sdks/go/index.md)**, full coverage of the node, indexer, and wallet RPCs plus the embedded WASM cryptography runtime (no CGO). Recommended for services, exchanges, and backends.

## Accept addresses from users

Mintlayer addresses are Bech32m, and their checksum can locate up to two mistyped characters: implement [address typo recovery](../wallet/addresses/address-format.md#address-typo-recovery) to suggest a fix whenever a user pastes a broken address (and validate the network prefix while you are at it).

## Query chain data

- **[API](../api/index.md)**, the indexer REST API for blockchain data (blocks, transactions, tokens, addresses), backed by PostgreSQL. Start with the [endpoint reference](../api/endpoints/chain.md).
- You can run the whole indexing stack yourself with Docker Compose, see [Running the API server stack](../getting-started/install/install-from-docker.md#running-the-api-server-stack).

## Cross-chain

- **[Atomic Swap with Bitcoin](../guides/cli/atomic-swap-with-bitcoin.md)**, trustless BTC ⇄ ML swaps using Hash Time-Locked Contracts, directly on-chain.
- **[Bridge](bridge.md)**, transfer fungible tokens between Mintlayer and Ethereum.

## Automate wallets

- **[Wallet RPC](../wallet/rpc/overview.md)**, full JSON-RPC 2.0 API for wallet management, transactions, staking, and token operations. Suitable for exchanges, custodians, and back-office services.
- **[Node](../node/index.md)**, chain queries, peer management, and block submission over the node's RPC interface.

## Integrate AI agents

- **[MCP](mcp.md)**, hosted MCP endpoint that lets MCP-compatible AI assistants interact with Mintlayer services.
- Agent-facing documentation: fetch [`/llms.txt`](https://docs.mintlayer.org/llms.txt) for a machine-readable index of this whole site.

## Understand the protocol

- **[Whitepaper](../whitepaper/1-blockchain-architecture.md)**, the architecture, tokenization standard, DEX design, and token economics.
- **[Pulsar consensus](https://arxiv.org/abs/2411.14245)**, the proof-of-stake protocol paper (Afach, Marsh, Rubboli).
- **[Block and transaction serialization](../reference/block-and-transaction-serialization.md)**, the on-chain data format, if you are writing low-level tooling.
