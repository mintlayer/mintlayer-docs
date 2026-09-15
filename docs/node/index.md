---
title: "Node"
description: "Run a Mintlayer node: what the node daemon does, how to install and operate it, secure it, and talk to its RPC interface."
sidebar_position: 1
---

# Node

The Mintlayer node (`node-daemon`) is the backbone of the network: it connects to peers over the P2P network, synchronizes and validates the full blockchain, and exposes an RPC interface used by wallets, the blockchain scanner, and your own tooling.

A node never holds keys or balances, so it is safe (and normal) to run one on a public server. See [Node vs. wallet](../getting-started/index.md#node-vs-wallet) for how it differs from the wallet software.

## Running a node

1. **Install** the node daemon using any [installation method](../getting-started/install/index.md), including the one-command Docker installer.
2. **Start it** on your chosen network: `node-daemon mainnet` (or `testnet`, `regtest`). The full set of command-line options is in the [node-daemon CLI reference](../reference/cli/node-daemon.md).
3. **Wait for sync**: the node downloads and validates the chain automatically. Progress is visible in the logs or via the `chainstate_info` RPC method.
4. **Connect clients**: wallets and the blockchain scanner talk to the node over RPC (default port 3030 mainnet, 13030 testnet). See [Node RPC](node-rpc.md) and [Developer Setup](../build/development.md).

For a development setup with Docker Compose (including a full indexing stack), see [Install from Docker](../getting-started/install/install-from-docker.md).

## Operator basics

- **Data directory**: everything lives under `~/.mintlayer/<network>/` (e.g. `~/.mintlayer/mainnet/`), including the chainstate, logs, and the RPC `.cookie` file.
- **Networks**: `mainnet`, `testnet`, `regtest` (local development, dev-only RPC), and `signet`. Each has its own data directory and default ports.
- **Logs**: console output is controlled by `RUST_LOG` (e.g. `RUST_LOG=info`); `--log-to-file` additionally stores info-level logs in the data directory.
- **Cleaning up**: the top-level `--clean-data` option (e.g. `node-daemon --clean-data testnet`) wipes the network data directory before starting.

## Node RPC

The [Node RPC](node-rpc.md) page documents the JSON-RPC interface: modules (chainstate, mempool, p2p, blockprod), authentication, HTTP and WebSocket access, and event subscriptions.

To inspect a node from the terminal, the Wallet CLI ships a group of node commands (`node-chainstate-info`, `node-best-block-id`, `node-peer-count`, ...). See the [Wallet CLI command reference](../wallet/cli/commands.md), Node Control section.

## Securing and upgrading

- [Firewall configuration](firewall-configuration.md): open P2P and RPC ports safely
- [Upgrading](upgrading/index.md): general upgrade flow (binaries, source, Docker Compose) plus version-specific guides from v1.0.0 through v1.4.0
