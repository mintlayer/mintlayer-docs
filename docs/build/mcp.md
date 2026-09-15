---
title: MCP
description: "Mintlayer MCP servers: give your AI assistant access to the documentation, on-chain data, and your own node."
sidebar_position: 6
---

# MCP

Mintlayer exposes three Model Context Protocol servers. Point any MCP-compatible client (Claude Desktop, Cursor, opencode, ...) at them and your assistant can read the documentation, query on-chain data, or talk to your own node.

| # | Server | Endpoint | Runs | Tools |
| - | ------ | -------- | ---- | ----- |
| 1 | [Documentation](#docs-server) | `https://docs.mintlayer.org/mcp` | Mintlayer-hosted | `list_docs`, `search_docs`, `get_doc_page` |
| 2 | [Chain data](#chain-data-server) | `https://mojito-api.mintlayer.org/mcp` | Mintlayer-hosted | 6 chain query tools |
| 3 | [Your node](#node-gui) | local to your machine | Self-hosted via node-gui | your node and wallet |

## 1. Documentation server {#docs-server}

Serves this entire documentation site to your agent: page index, full-text search, and per-page markdown.

- Endpoint: `https://docs.mintlayer.org/mcp` (Streamable HTTP, read-only, no auth)
- Tools:
  - `list_docs`: all pages with title, URL, and description
  - `search_docs`: full-text search with snippets
  - `get_doc_page`: one page as markdown

Client configuration:

```json
{
  "mcpServers": {
    "mintlayer_docs": {
      "url": "https://docs.mintlayer.org/mcp"
    }
  }
}
```

For clients without remote-MCP support, bridge it locally with `npx -y mcp-remote https://docs.mintlayer.org/mcp`.

## 2. Chain data server (mojito-api) {#chain-data-server}

Hosted at `https://mojito-api.mintlayer.org/mcp`. Read-only queries against the Mintlayer blockchain, backed by the indexer — useful for checking balances, transactions, and blocks without running your own node. Requests are rate limited.

| Tool | Description |
| ---- | ----------- |
| `get_block_height` | Current chain tip height |
| `get_block_info` | Block details by hash or height |
| `get_transaction_info` | Transaction details by ID |
| `get_address_info` | Address information |
| `get_address_utxos` | UTXOs for an address |
| `get_utxo_info` | UTXO details by outpoint |

All tools accept an optional `network` parameter: `mainnet` (default) or `testnet`. The server uses the Streamable HTTP transport and requires session handling, which MCP clients manage automatically; when testing by hand, pass the `mcp-session-id` header returned by the `initialize` call on subsequent requests.

## 3. Self-hosted (node-gui) {#node-gui}

If you prefer to keep everything local, node-gui ships its own MCP server that runs on your machine and exposes your node and wallet to your assistant: chain and wallet queries never leave your network, and the agent can only see what your local node sees.

Enable it in the node-gui settings and point your MCP client at the local endpoint it provides. See the node-gui documentation for the exact endpoint and available tools.

## Client configuration

Most MCP clients accept the servers as a JSON list in their settings file. Combine the hosted ones like this:

```json
{
  "mcpServers": {
    "mintlayer_docs": {
      "url": "https://docs.mintlayer.org/mcp"
    },
    "mintlayer_chain": {
      "url": "https://mojito-api.mintlayer.org/mcp"
    }
  }
}
```

Clients without remote-MCP support can bridge both locally with `npx -y mcp-remote <endpoint>`.
