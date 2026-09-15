---
title: "Node RPC"
description: "The node-daemon JSON-RPC interface: modules, authentication, HTTP and WebSocket access, and event subscriptions."
sidebar_position: 2
---

# Node RPC

The node daemon exposes a JSON-RPC 2.0 interface over a single port that serves both HTTP and WebSocket. Wallets, the blockchain scanner, and your own tooling use it to query chain state, inspect the mempool, manage peers, and submit data to the network.

- **Port**: 3030 (mainnet), 13030 (testnet)
- **Protocols**: HTTP and WebSocket on the same port
- **Auth**: `.cookie` file (default) or username/password
- **Full method reference**: [node-daemon RPC documentation](https://github.com/mintlayer/mintlayer-core/blob/master/node-daemon/docs/RPC.md) (generated per release)

For ports, authentication details, and language clients, see [Developer Setup](../build/development.md); the [Go SDK node client](../build/sdks/go/node.md) wraps the whole interface.

## Method modules

| Module | Purpose | Example methods |
| ------ | ------- | --------------- |
| `node` | Node control and info | `node_version`, `node_shutdown` |
| `chainstate` | Chain queries | `chainstate_info`, `chainstate_best_block_id`, `chainstate_block_id_at_height` |
| `mempool` | Unconfirmed transactions | `mempool_transactions`, `mempool_get_config` (v1.4.0+) |
| `p2p` | Peer management | `p2p_get_peer_info`, `p2p_connect`, `p2p_discourage` |
| `blockprod` | Block production (staking/regtest) | `blockprod_generate_block` |
| `test_functions` | Dev-only helpers | regtest only: `test_functions_generate_block` |

The exact method list and their parameters are generated per release; always consult the reference for the version you run.

## Calling over HTTP

Authentication options, in order of convenience:

1. **Cookie file**: the node writes `~/.mintlayer/<network>/.cookie` containing `username:password` on one line. Any HTTP basic-auth client can use it directly.
2. **Username/password**: set with the `ML_<NETWORK>_NODE_RPC_USERNAME` / `ML_<NETWORK>_NODE_RPC_PASSWORD` environment variables (e.g. `ML_MAINNET_NODE_RPC_USERNAME`). Required when connecting from another machine or container.

```bash
curl -H 'Content-Type: application/json' \
  --user $(cat ~/.mintlayer/mainnet/.cookie) \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "chainstate_info", "params": []}' \
  http://127.0.0.1:3030
```

To make the RPC reachable from other hosts, set the bind address (e.g. `ML_MAINNET_NODE_RPC_BIND_ADDRESS: "0.0.0.0:3030"`) and prefer explicit credentials over the cookie file.

## WebSocket and subscriptions

The same port speaks WebSocket. Simple calls work identically, and you can additionally subscribe to events and receive notifications on the open connection:

```
{"jsonrpc": "2.0", "method": "chainstate_subscribe_to_events", "params": [], "id": 1}
{"jsonrpc": "2.0", "method": "mempool_subscribe_to_events", "params": [], "id": 2}
```

After a successful subscription the node pushes a message for every matching event (new best block, mempool changes).

## Inspecting the node from wallet-cli

The wallet CLI embeds a full set of node inspection commands (they forward to the node RPC over your wallet connection): `node-chainstate-info`, `node-best-block-id`, `node-get-block`, `node-peer-count`, `node-connect-to-peer`, `node-submit-transaction`, and more. See the Node Control group in the [Wallet CLI command reference](../wallet/cli/commands.md).

## Regtest helpers

On regtest, dev-only methods enable deterministic testing: on-demand block generation (`test_functions_generate_block`), mock time (`node_set_mock_time`), and more. See the [test functions reference](https://github.com/mintlayer/mintlayer-core/blob/master/node-daemon/docs/RPC_DEV.md).
