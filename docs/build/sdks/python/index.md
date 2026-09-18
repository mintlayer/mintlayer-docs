---
title: "Python SDK"
description: "The Mintlayer Python SDK: one client for the node, indexer and wallet RPCs, plus WASM cryptography and transaction building via wasmtime."
sidebar_position: 1
---

# Python SDK

The Python SDK (`mintlayer`) is ported from the Go SDK: it wraps the node RPC, the indexer REST API and the wallet RPC as typed synchronous clients, and embeds the WASM cryptography runtime ([wasmtime](https://wasmtime.dev/), bundled with the package) for key management and transaction building.

```bash
pip install mintlayer
```

- Requires Python 3.10+; every remote method is synchronous and thread-safe
- Dependencies: `requests` and `wasmtime` only; the WASM binary is sha256-pinned at import
- Source: [github.com/mintlayer/python-sdk](https://github.com/mintlayer/python-sdk)

## Architecture

A top-level `Client` wires the sub-clients; `Config` constructs only the sub-clients whose URL field is non-empty. Use the top-level client when you need several, or import sub-modules (`mintlayer.node`, `mintlayer.indexer`, `mintlayer.wallet`, `mintlayer.wasm`) directly when you need one.

| Module | Purpose | Default port |
| ------ | ------- | ------------ |
| `mintlayer.node` | JSON-RPC 2.0 client for the node daemon | 3030 (mainnet) |
| `mintlayer.indexer` | REST client for the indexer (api-web-server) | 3000 (mainnet) |
| `mintlayer.wallet` | JSON-RPC 2.0 client for the wallet daemon | 3034 (mainnet) |
| `mintlayer.wasm` | Cryptography and transaction building via WASM | none |

The WASM runtime instantiates in ~400 ms; the first access triggers lazy construction, and `init_wasm()` makes the cost explicit (it is a no-op afterwards). Call `client.close()` when done, or use the client as a context manager.

The sub-clients map 1:1 to the services documented in [Developer Setup](../../development.md), and the indexer client mirrors the [API endpoints](../../../api/endpoints/chain.md) endpoint-for-endpoint.

## Amounts

All coin and token amounts use the `Amount` type, a decimal string of **atoms**: **1 ML = 100,000,000,000 atoms** (11 decimal places).

- `mintlayer.wasm.Amount`: built with `Amount(atoms="...")` or `Amount.from_atoms("...")`
- The indexer and wallet clients use their own `Amount` dataclass with `atoms` and `decimal` fields populated by the server

## Quick start

```python
import mintlayer

client = mintlayer.Client(
    mintlayer.Config(
        node_url="http://127.0.0.1:3030",
        indexer_url="http://127.0.0.1:3000",
        wallet_url="http://127.0.0.1:3034",
    )
)

# Query the chain tip from the indexer.
tip = client.indexer.get_tip()
print(f"chain tip: height={tip.block_height} id={tip.block_id}")

# Optionally initialise the embedded WASM cryptography runtime (~400 ms).
client.init_wasm()

priv_key = client.wasm.make_private_key()
pub_key = client.wasm.public_key_from_private_key(priv_key)
addr = client.wasm.pubkey_to_pubkeyhash_address(pub_key, mintlayer.MAINNET)
print("address:", addr)

client.close()  # or use `with mintlayer.Client(cfg) as client:`
```

Convenience re-exports (`mintlayer.Amount`, `mintlayer.Network`, `mintlayer.MAINNET`, ...) mirror the Go SDK's aliases, so callers that only import the top-level package do not need to also import `mintlayer.wasm`.

## Guides

| Guide | Contents |
| ----- | -------- |
| [Getting Started](getting-started.md) | Installation, first call, networks and ports, amounts, errors, testing |
| [Node client](node.md) | Chainstate, mempool, P2P, block submission, trust policy |
| [Indexer client](indexer.md) | Chain, blocks, transactions, addresses, pools, tokens, orders, statistics |
| [Wallet client](wallet.md) | Wallet lifecycle, accounts, balances, transactions, staking, tokens, orders |
| [WASM client](wasm.md) | Keys, addresses, inputs, outputs, signing, fees, intents |
| [Building transactions](transactions.md) | Full-custody flow: UTXOs, fees, signing, submission |
| [Staking](staking.md) | Pool creation, delegation, withdrawal |
| [Tokens and NFTs](tokens.md) | Fungible token and NFT lifecycle, and manual encoders |

Runnable examples live in the repository under [examples/](https://github.com/mintlayer/python-sdk/tree/main/examples) (`send_coins.py`, `issue_token.py`).
