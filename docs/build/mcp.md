---
title: MCP
description: "Mintlayer MCP servers: give your AI assistant access to the documentation, on-chain data, and your own node."
sidebar_position: 6
---

# MCP

Mintlayer exposes four Model Context Protocol servers. Point any MCP-compatible client (Claude Desktop, Cursor, opencode, ...) at them and your assistant can read the documentation, query on-chain data, talk to your own node, or inspect your wallet.

| # | Server | Endpoint | Runs | Tools |
| - | ------ | -------- | ---- | ----- |
| 1 | [Documentation](#docs-server) | `https://docs.mintlayer.org/mcp` | Mintlayer-hosted | `list_docs`, `search_docs`, `get_doc_page` |
| 2 | [Chain data](#chain-data-server) | `https://mojito-api.mintlayer.org/mcp` | Mintlayer-hosted | 6 chain query tools |
| 3 | [Your wallet (web-gui)](#self-hosted-web-gui) | stdio, from your own machine | Self-hosted via the web-gui | 11 wallet tools |
| 4 | [Your wallet (core)](#core-wallet-mcp-server) | stdio, from your own machine | Self-hosted via `wallet-mcp-server` (v1.4.5+) | 5 read-only wallet tools |

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

Hosted at `https://mojito-api.mintlayer.org/mcp`. Read-only queries against the Mintlayer blockchain, backed by the indexer: useful for checking balances, transactions, and blocks without running your own node. Requests are rate limited.

| Tool | Description |
| ---- | ----------- |
| `get_block_height` | Current chain tip height |
| `get_block_info` | Block details by hash or height |
| `get_transaction_info` | Transaction details by ID |
| `get_address_info` | Address information |
| `get_address_utxos` | UTXOs for an address |
| `get_utxo_info` | UTXO details by outpoint |

All tools accept an optional `network` parameter: `mainnet` (default) or `testnet`. The server uses the Streamable HTTP transport and requires session handling, which MCP clients manage automatically; when testing by hand, pass the `mcp-session-id` header returned by the `initialize` call on subsequent requests.

## 3. Self-hosted wallet server (web-gui) {#self-hosted-web-gui}

The [Mojito web-gui](https://github.com/mintlayer/web-gui) ships a **stdio** MCP server (`scripts/mcp-server.mjs`) that talks to your own `wallet-rpc-daemon`. Nothing leaves your machine, and the agent only ever sees what your wallet sees.

### Enable it

In the web-gui, open **Management → Settings → MCP Server**:

1. Toggle **Enabled** (read-only access).
2. Optionally grant **Allow wallet actions** and **Allow fund-moving operations**. Granting either requires 2FA to be configured and a valid authenticator code at save time.
3. Copy the client configuration shown in the panel (below) and add it to your MCP client.

```json
{
  "mcpServers": {
    "mintlayer-wallet": {
      "command": "docker",
      "args": [
        "compose", "-f", "/path/to/mintlayer-web-gui/docker-compose.yml",
        "run", "--rm", "-T", "--no-deps",
        "web-gui", "node", "scripts/mcp-server.mjs"
      ]
    }
  }
}
```

Permissions are re-read from the settings database on every tool call, so panel changes apply immediately without restarting the client.

### Tools

| Tier | Tools | Requires |
| ---- | ----- | -------- |
| read (default) | `get_status`, `get_balance`, `list_addresses`, `list_transactions`, `list_utxos`, `get_staking_overview`, `list_orders` | Enabled |
| actions | `new_address`, `set_staking` | Allow wallet actions |
| spend | `send_coins` | Allow fund-moving operations |
| escape hatch | `wallet_rpc` | per-method tier check |

- `send_coins` moves real funds and is additionally capped by the optional `mcp.max_send_amount` pref (decimal ML per transaction).
- Methods that expose secrets (`wallet_show_seed_phrase`, `wallet_unlock_private_keys`, wallet open/create) are **never** callable through MCP, regardless of settings.

### How it works

The server is a plain Node script inside the web-gui image. It reads permissions from the same SQLite preferences database as the settings panel (fresh read per call), and forwards tool calls to `wallet-rpc-daemon` over JSON-RPC using the standard `WALLET_RPC_URL` / `WALLET_RPC_USERNAME` / `WALLET_RPC_PASSWORD` environment variables.

## 4. Core wallet MCP server (v1.4.5+) {#core-wallet-mcp-server}

Mintlayer core (v1.4.5 and later) ships a standalone `wallet-mcp-server` binary: a **read-only** MCP server (stdio transport) that connects to a running `wallet-rpc-daemon` and lets MCP clients inspect your wallet without being able to move funds. Nothing leaves your machine.

### Run it

Point the server at your wallet RPC daemon and authenticate the same way you would with any wallet RPC client: via cookie file, username/password, or no auth (give exactly one):

```bash
# Cookie file authentication (recommended)
wallet-mcp-server --wallet-rpc-address 127.0.0.1:3034 --rpc-cookie-file ~/.mintlayer/mainnet/wallet-rpc-cookie

# Username/password (prefer the cookie file; a password on the command line
# is visible to other local users via ps)
WALLET_MCP_RPC_PASSWORD=secret wallet-mcp-server --wallet-rpc-address 127.0.0.1:3034 --rpc-username user

# No authentication (only for local testing)
wallet-mcp-server --wallet-rpc-address 127.0.0.1:3034 --rpc-no-auth
```

Client configuration example:

```json
{
  "mcpServers": {
    "mintlayer_wallet": {
      "command": "wallet-mcp-server",
      "args": [
        "--wallet-rpc-address", "127.0.0.1:3034",
        "--rpc-cookie-file", "/home/youruser/.mintlayer/mainnet/wallet-rpc-cookie"
      ]
    }
  }
}
```

Use an absolute path in the JSON config: MCP clients start the command directly, without a shell, so `~` is not expanded (the shell examples above are unaffected). The default wallet RPC ports are `3034` (mainnet), `13034` (testnet), `23034` (regtest), and `33034` (signet). Point the server at the RPC interface of a running `wallet-rpc-daemon` (see the [wallet RPC reference](../wallet/rpc/index.md)), or at the equivalent RPC interface exposed by `wallet-cli` via `--enable-wallet-rpc-interface`.

### Tools

All tools are read-only; there is no way to create, sign, or submit transactions through this server:

| Tool | Description |
| ---- | ----------- |
| `version` | Version of the connected wallet RPC daemon |
| `wallet_info` | General wallet state: chain, accounts, synchronization status |
| `best_block` | The best block known to the wallet |
| `balance` | Balances of one account (optional `account_index`, `utxo_states`, `with_locked`) |
| `standalone_addresses` | Standalone addresses of one account (optional `account_index`) |

Secret-exposing operations (`wallet_show_seed_phrase`, unlocking, wallet creation) are not offered at all. Compared with the [web-gui MCP server](#self-hosted-web-gui), the core server is lighter (no Docker or web interface required) but strictly read-only; use the web-gui server if you want your assistant to create addresses or send funds under your configured permissions.

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
