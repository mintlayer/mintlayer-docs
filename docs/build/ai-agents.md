---
title: "Set Up an AI Agent"
description: "Connect AI agents (Claude, Codex, Pi, Grok, Cursor, Hermes) to Mintlayer through MCP: documentation, chain data, and wallet servers."
sidebar_position: 7
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Set Up an AI Agent with Mintlayer

Mintlayer ships Model Context Protocol (MCP) servers that let AI agents read the documentation, query chain data, and inspect (or operate) a wallet. This page walks through connecting the most common agents: Claude, Codex, Pi, Grok, Cursor, and Hermes. For protocol details and the full tool tables, see the [MCP reference](mcp.md).

## The servers

| Server | Endpoint | Access | What the agent can do |
| ------ | -------- | ------ | --------------------- |
| Documentation | `https://docs.mintlayer.org/mcp` | Hosted, read-only, no auth | Search and read this entire site (`list_docs`, `search_docs`, `get_doc_page`) |
| Chain data | `https://mojito-api.mintlayer.org/mcp` | Hosted, read-only, rate limited | Query blocks, transactions, addresses, UTXOs on mainnet or testnet |
| Wallet (core) | stdio, via `wallet-mcp-server` | Local, read-only | Inspect wallet state, balances, best block, standalone addresses |
| Wallet (Nexus) | stdio, via the Nexus MCP script | Local, permission-gated | Everything above plus, if you allow it, address creation, staking changes, and fund transfers |

Agents can also fetch [`https://docs.mintlayer.org/llms.txt`](https://docs.mintlayer.org/llms.txt) for a machine-readable index of the documentation without MCP.

## Before you start

- The two hosted servers work from any MCP client, no local setup needed.
- The core wallet server needs a running `wallet-rpc-daemon` (or `wallet-cli` with `--enable-wallet-rpc-interface`) and the `wallet-mcp-server` binary built from mintlayer-core (it is not yet in the release packages, see the [command-line reference](../reference/cli/wallet-mcp-server.md#availability)).
- The Nexus (the former web GUI, [github.com/mintlayer/web-gui](https://github.com/mintlayer/web-gui)) ships its own MCP server that can be granted write access; see [enable the Nexus wallet server](#enable-the-nexus-wallet-server).

## Claude

### Claude Desktop

Remote servers are added as connectors: open **Settings → Connectors → Add connector** and enter the endpoint URL:

- `https://docs.mintlayer.org/mcp`
- `https://mojito-api.mintlayer.org/mcp`

For the local wallet server, edit the configuration file (macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`, Windows: `%APPDATA%\Claude\claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "mintlayer-wallet": {
      "command": "/path/to/wallet-mcp-server",
      "args": [
        "--wallet-rpc-address", "127.0.0.1:3034",
        "--rpc-cookie-file", "/home/youruser/.mintlayer/mainnet/wallet-rpc-cookie"
      ]
    }
  }
}
```

Restart Claude Desktop afterwards. Use absolute paths: desktop clients start the command directly, so `~` is not expanded.

### Claude Code

```bash
# Hosted servers (user scope so every project can use them)
claude mcp add mintlayer_docs -s user --transport http https://docs.mintlayer.org/mcp
claude mcp add mintlayer_chain -s user --transport http https://mojito-api.mintlayer.org/mcp

# Local wallet server
claude mcp add mintlayer_wallet -s user -- \
  /path/to/wallet-mcp-server --wallet-rpc-address 127.0.0.1:3034 \
  --rpc-cookie-file /home/youruser/.mintlayer/mainnet/wallet-rpc-cookie

claude mcp list
```

## Codex

Codex reads MCP servers from `~/.codex/config.toml`. Add:

```toml
[mcp_servers.mintlayer_docs]
url = "https://docs.mintlayer.org/mcp"

[mcp_servers.mintlayer_chain]
url = "https://mojito-api.mintlayer.org/mcp"

[mcp_servers.mintlayer_wallet]
command = "/path/to/wallet-mcp-server"
args = [
  "--wallet-rpc-address", "127.0.0.1:3034",
  "--rpc-cookie-file", "/home/youruser/.mintlayer/mainnet/wallet-rpc-cookie",
]
```

The CLI can write stdio entries for you: `codex mcp add mintlayer_wallet -- /path/to/wallet-mcp-server --wallet-rpc-address 127.0.0.1:3034 --rpc-cookie-file /home/youruser/.mintlayer/mainnet/wallet-rpc-cookie`. Verify with `codex mcp list`.

## Pi

```bash
# Hosted servers
pi mcp add mintlayer_docs --url https://docs.mintlayer.org/mcp
pi mcp add mintlayer_chain --url https://mojito-api.mintlayer.org/mcp

# Local wallet server
pi mcp add mintlayer_wallet -- /path/to/wallet-mcp-server \
  --wallet-rpc-address 127.0.0.1:3034 \
  --rpc-cookie-file /home/youruser/.mintlayer/mainnet/wallet-rpc-cookie

pi mcp list
```

Entries land in `~/.pi/agent/mcp.json` (project-scoped entries go to `.pi/mcp.json` with `-l`). Inside a session, `/mcp` inspects connections and `/reload` picks up config changes.

## Grok

```bash
# Hosted servers (HTTP transport)
grok mcp add --transport http mintlayer_docs https://docs.mintlayer.org/mcp
grok mcp add --transport http mintlayer_chain https://mojito-api.mintlayer.org/mcp

# Local wallet server (stdio)
grok mcp add mintlayer_wallet -- /path/to/wallet-mcp-server \
  --wallet-rpc-address 127.0.0.1:3034 \
  --rpc-cookie-file /home/youruser/.mintlayer/mainnet/wallet-rpc-cookie

grok mcp list
```

Grok stores servers in `~/.grok/config.toml` under `[mcp_servers.<name>]` using the same `command`/`args` shape as Codex.

## Cursor

Cursor reads MCP servers from `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project). You can also manage servers in **Settings → MCP & Tools**:

```json
{
  "mcpServers": {
    "mintlayer_docs": {
      "url": "https://docs.mintlayer.org/mcp"
    },
    "mintlayer_chain": {
      "url": "https://mojito-api.mintlayer.org/mcp"
    },
    "mintlayer_wallet": {
      "command": "/path/to/wallet-mcp-server",
      "args": [
        "--wallet-rpc-address", "127.0.0.1:3034",
        "--rpc-cookie-file", "/home/youruser/.mintlayer/mainnet/wallet-rpc-cookie"
      ]
    }
  }
}
```

## Hermes

Hermes reads MCP servers from `~/.hermes/config.yaml` under `mcp_servers`:

```yaml
mcp_servers:
  mintlayer_docs:
    url: "https://docs.mintlayer.org/mcp"
  mintlayer_chain:
    url: "https://mojito-api.mintlayer.org/mcp"
  mintlayer_wallet:
    command: "/path/to/wallet-mcp-server"
    args:
      - "--wallet-rpc-address"
      - "127.0.0.1:3034"
      - "--rpc-cookie-file"
      - "/home/youruser/.mintlayer/mainnet/wallet-rpc-cookie"
```

The CLI can add servers too: `hermes mcp add mintlayer_docs --url https://docs.mintlayer.org/mcp` (stdio servers use `--command`). Restart `hermes chat` and ask it to list the tools to confirm.

## Enable the Nexus wallet server

The Nexus wallet (the former web GUI) ships a permission-gated MCP server that can do more than the read-only core server. In the Nexus interface open **Management → Settings → MCP Server**:

1. Toggle **Enabled** (this gives read-only access).
2. Optionally grant **Allow wallet actions** and **Allow fund-moving operations**. Granting either requires 2FA and a valid authenticator code at save time.
3. Copy the client configuration shown in the panel and add it to any of the clients above in place of the `mintlayer_wallet` entry. It runs the MCP script inside the Nexus Docker stack, for example:

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

See the [MCP reference](mcp.md#self-hosted-web-gui) for the full Nexus tool table and permission tiers.

## Which wallet server should you use?

| | Core `wallet-mcp-server` | Nexus MCP server |
| --- | ------------------------ | ---------------- |
| Setup | One binary, one command | Requires the Nexus Docker stack |
| Access | Strictly read-only | Read-only by default, writable tiers with 2FA |
| Best for | Quick local inspection, conservative setups | Agents that manage addresses, staking, or payments under your control |

If you only want the agent to answer questions about balances and wallet state, use the core server. Enable the Nexus server only when you want the agent to act, and only after configuring the permission tiers deliberately.

## Security notes

- Prefer the cookie file over usernames and passwords; a password on a command line is visible to other local users through `ps`.
- The hosted documentation and chain-data servers are read-only and safe to add anywhere.
- Never paste seed phrases or private keys into an agent. No Mintlayer MCP server exposes them; keep it that way.
- Grant fund-moving permissions on the Nexus server only when needed, and rely on its 2FA gate and the optional per-transaction send cap.
- Use absolute paths in JSON and TOML client configs: `~` is not expanded when a client starts a stdio server directly.

## Related

- [MCP](mcp.md): server endpoints, tool tables, and protocol details
- [`wallet-mcp-server` reference](../reference/cli/wallet-mcp-server.md): flags, tools, and protocol behavior
- [Wallet RPC reference](../wallet/rpc/index.md): the underlying wallet daemon interface
