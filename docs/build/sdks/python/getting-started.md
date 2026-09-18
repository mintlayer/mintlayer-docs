---
title: "Getting Started"
description: "Set up the Mintlayer Python SDK: installation, first call, networks and ports, amounts, error handling, and testing."
sidebar_position: 2
---

# Getting Started

This page covers everything needed to get a project running with the Python SDK: installation, the first call, networks, units, error handling, and testing. The sub-client references ([Node](node.md), [Indexer](indexer.md), [Wallet](wallet.md), [WASM](wasm.md)) document the full API surface.

## Requirements

- **Python 3.10+**; the package name on PyPI is `mintlayer`
- Dependencies: `requests` and `wasmtime` (the WASM cryptography binary is bundled with the package and sha256-pinned at import)
- Whichever services your code talks to: a synced [node-daemon](../../../node/index.md), an [api-web-server](../../../getting-started/install/install-from-docker.md#running-the-api-server-stack) indexer, and/or a wallet-rpc-daemon. For development setups see [Developer Setup](../../development.md).

## Installation

```bash
pip install mintlayer
```

## First call

Create the top-level client with the URLs of the services you need, and query the chain tip:

```python
import mintlayer

client = mintlayer.Client(
    mintlayer.Config(
        node_url="http://127.0.0.1:3030",
        indexer_url="http://127.0.0.1:3000",
        wallet_url="http://127.0.0.1:3034",
    )
)

tip = client.indexer.get_tip()
print(f"chain tip: height={tip.block_height} id={tip.block_id}")

client.close()  # or use `with mintlayer.Client(cfg) as client:`
```

Notes:

- `Config` only constructs the sub-clients whose URL field is non-empty (`node_url`, `indexer_url`, `wallet_url`, plus shared `username`, `password`, `timeout`); use the top-level client when you need several, or import sub-modules directly when you need one.
- All remote methods are synchronous and thread-safe; clients support the context-manager protocol.
- The WASM runtime instantiates lazily on first access; call `client.init_wasm()` to make the ~400 ms cost explicit (it is a no-op afterwards), and `client.wasm.close()` to release it.

## Networks and endpoints

| Service | Mainnet | Testnet | Protocol |
| ------- | ------- | ------- | -------- |
| node-daemon RPC | `3030` | `13030` | JSON-RPC 2.0 (HTTP and WebSocket) |
| api-web-server (indexer) | `3000` | `13000` | REST under `/api/v2` |
| wallet-rpc-daemon RPC | `3034` | `13034` | JSON-RPC 2.0 |

The node and wallet clients accept optional `username`/`password` (HTTP basic auth) and `timeout` (seconds, default 30); the indexer accepts `timeout` and an optional `requests.Session`, and is unauthenticated. Loopback `http://` is fine; for remote daemons prefer TLS or an authenticated tunnel.

Cryptography functions that derive addresses or encode transactions take the network explicitly: `mintlayer.MAINNET`, `TESTNET`, `REGTEST`, `SIGNET` (or the `Network` enum members).

## Amounts

All coin and token amounts are atom counts: **1 ML = 100,000,000,000 atoms** (11 decimal places).

```python
from mintlayer.wasm import Amount

one = Amount.from_atoms("100000000000")  # 1 ML
print(one.atoms)  # "100000000000"
```

The indexer and wallet clients use their own `Amount` dataclass with `atoms` and `decimal` fields populated by the server; requests typically set `atoms` only.

## Error handling

- `mintlayer.node.RPCError`: JSON-RPC error from the node daemon (`code`, `message`); transport failures raise `JSONRPCError`
- `mintlayer.wallet.RPCError`: JSON-RPC error from the wallet daemon
- `mintlayer.indexer.HTTPError`: non-2xx response (`status_code`, `body`); transport/decode failures raise `IndexerError`
- `mintlayer.wasm.WasmError`: WASM operation failures, with a message prefixed by `mintlayer:`

Error bodies are trimmed and stripped of control characters, and basic-auth credentials are redacted from the clients' `repr`.

## Testing

- The SDK repository carries an extensive pytest suite; development tooling is pytest, ruff, and mypy (via `uv`).
- For your own code, test against **testnet**: get TML from the [faucet](https://faucet.mintlayer.org) (testnet addresses start with `tmt1`) and point the clients at the testnet ports above.
- For fully local iteration, use `REGTEST` with a [regtest node](../../../build/development.md#running-a-node-for-development) and generate blocks on demand.
- The repository's runnable examples double as integration checks:

  ```bash
  uv run python examples/send_coins.py --to mtc1qrecipient... --amount 100000000000 --indexer http://127.0.0.1:3000
  uv run python examples/issue_token.py --wallet /path/to/wallet.dat --ticker MYTOKEN --decimals 2 --supply 1000000 --wallet-rpc http://127.0.0.1:3034
  ```

## Next steps

- [Node client](node.md), [Indexer client](indexer.md), [Wallet client](wallet.md), [WASM client](wasm.md): the full API references
- [Building transactions](transactions.md): the full-custody flow without the wallet daemon
- [Guides](../../../guides/python/index.md): tokens, NFTs, staking, orders, and atomic swaps in Python
