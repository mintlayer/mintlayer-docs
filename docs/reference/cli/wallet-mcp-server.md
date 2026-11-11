---
title: "Wallet MCP Server"
description: "wallet-mcp-server command-line reference: read-only MCP server exposing a Mintlayer wallet to AI clients over stdio."
sidebar_position: 6
---

The `wallet-mcp-server` is a read-only Model Context Protocol (MCP) server that connects to a running `wallet-rpc-daemon` and exposes wallet inspection tools to MCP clients (AI assistants such as Claude, Codex, Cursor, or Pi). It speaks JSON-RPC 2.0 over **stdio** and implements MCP protocol revision `2024-11-05`.

All tools are read-only by design: there is no way to create, sign, or submit transactions, and no tool exposes the seed phrase or passwords.

## Availability

The binary is part of the mintlayer-core workspace but is **not yet included in the release packages** (deb, rpm, Arch, Windows, macOS). Build it from source:

```bash
cargo build --release -p wallet-mcp-server
# binary at target/release/wallet-mcp-server
```

## Usage

```bash
wallet-mcp-server --wallet-rpc-address <ADDR> <AUTH OPTION>
```

The server reads one JSON-RPC message per line from standard input and writes responses to standard output. Startup reports go to standard error. Point an MCP client at the binary as the `command` of a stdio server (see the [AI agent setup guide](../../build/ai-agents.md) for per-client examples).

## Required Options

- **`--wallet-rpc-address <ADDR>`**: Address of the wallet RPC daemon to connect to, for example `127.0.0.1:3034`. Default wallet RPC ports are `3034` (mainnet), `13034` (testnet), `23034` (regtest), and `33034` (signet).

## Authentication (exactly one required)

The server must be given exactly one authentication method; passing none or several fails at startup.

- **`--rpc-cookie-file <PATH>`**: Cookie file used for authentication against the daemon. Recommended. The daemon writes the cookie to its data directory by default (`~/.mintlayer/<network>/wallet-rpc-cookie`).
- **`--rpc-username <USER>`** together with **`--rpc-password <PASS>`**: Basic authentication. The password can be passed through the environment variable `WALLET_MCP_RPC_PASSWORD` instead of the command line, which keeps it out of `ps` output. A password on the command line is visible to other local users.
- **`--rpc-no-auth`**: Connect without authentication. Only appropriate for local testing.

## Tools

| Tool | Arguments | Description |
| ---- | --------- | ----------- |
| `version` | none | Version of the connected wallet RPC daemon |
| `wallet_info` | none | General wallet state: chain, accounts, synchronization status |
| `best_block` | none | The best block known to the wallet |
| `balance` | `account_index` (int, default 0), `utxo_states` (list of `confirmed`, `in-mempool`, `conflicted`, `inactive`, `abandoned`; default `["confirmed"]`), `with_locked` (`unlocked`, `locked`, `any`; default `unlocked`) | Balances of one account |
| `standalone_addresses` | `account_index` (int, default 0) | Standalone addresses of one account |

## Protocol behavior

- Only single JSON-RPC request or notification objects are accepted; batched arrays are answered with a single error.
- The initialize handshake echoes the client's requested protocol version only when it is `2024-11-05`, and otherwise falls back to that version.
- Requests are bounded with a timeout, and the server resynchronizes the stream after an oversized message instead of desynchronizing.
- Unknown tool names are answered as protocol errors (per the MCP spec), not as tool results.
- Notifications (messages without an `id`) never produce a response.

## Example

```bash
# Cookie file authentication against a mainnet wallet daemon
wallet-mcp-server --wallet-rpc-address 127.0.0.1:3034 \
  --rpc-cookie-file ~/.mintlayer/mainnet/wallet-rpc-cookie

# Username and password, password supplied through the environment
WALLET_MCP_RPC_PASSWORD=secret wallet-mcp-server \
  --wallet-rpc-address 127.0.0.1:3034 --rpc-username myuser
```

## Related

- [MCP](../../build/mcp.md): All Mintlayer MCP servers, including the Nexus (web GUI) wallet server
- [AI agent setup guide](../../build/ai-agents.md): Per-client configuration for Claude, Codex, Pi, Grok, Cursor, and Hermes
- [Wallet RPC reference](../../wallet/rpc/index.md): The underlying `wallet-rpc-daemon` interface
