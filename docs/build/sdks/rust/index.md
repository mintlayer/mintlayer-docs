---
title: "Rust SDK"
description: "The Mintlayer Rust SDK: one client for the node, indexer and wallet RPCs, plus native cryptography and transaction building backed by mintlayer-core."
sidebar_position: 1
---

# Rust SDK

The Rust SDK (`mintlayer-sdk`) wraps the node RPC, the indexer REST API and the wallet RPC as typed async clients, and ships a native `crypto` module for key management and transaction building backed by mintlayer-core crates directly, with no runtime to initialize.

```toml
[dependencies]
mintlayer-sdk = { git = "https://github.com/mintlayer/rust-sdk", features = ["full"] }
```

- Requires Rust 1.92+ (edition 2024). Async (tokio + reqwest/rustls), `#![forbid(unsafe_code)]`
- Feature-gated: default enables `node`, `indexer`, `wallet`; `crypto` is opt-in (it pulls in the mintlayer-core dependency graph); `full` enables everything
- Source: [github.com/mintlayer/rust-sdk](https://github.com/mintlayer/rust-sdk)

:::note[Consumer requirement for the crypto feature]

The SDK depends on unpublished mintlayer-core crates, so Cargo ignores the repository's `[patch.crates-io]` section in downstream builds. Consumers must copy the `parity-scale-codec` git patch from the SDK's root `Cargo.toml` into their own workspace, or transactions encoded by the `crypto` feature may not match the encodings produced by mintlayer-core.

:::

## Architecture

A top-level `Client` wires the sub-clients; `Client::builder()` creates only the sub-clients whose URL is set. Import only what you need.

| Module | Purpose | Default port |
| ------ | ------- | ------------ |
| `node` *(feature)* | JSON-RPC 2.0 client for the node daemon | 3030 (mainnet), 13030 (testnet) |
| `indexer` *(feature)* | REST client for the indexer (api-web-server) | 3000 (mainnet), 13000 (testnet) |
| `wallet` *(feature)* | JSON-RPC 2.0 client for the wallet daemon | 3034 (mainnet) |
| `crypto` *(feature)* | Cryptography and transaction building, native | none |

Unlike the Go SDK there is no embedded WASM runtime, no `InitWASM` and no `Close`: the crypto module calls mintlayer-core directly and exchanges typed values (`Transaction`, `TxOutput`, `PrivateKey`, `Amount`) instead of opaque byte arrays. Every type participates in the SCALE encoding, and `mintlayer_sdk::crypto::types::{Encode, DecodeAll}` provide byte-level access. The functions mirror the Go SDK's `wasm` sub-client operation for operation.

The sub-clients map 1:1 to the services documented in [Developer Setup](../../development.md), and the indexer client mirrors the [API endpoints](../../../api/endpoints/chain.md) endpoint-for-endpoint.

## Amounts

All coin and token amounts are atom counts: **1 ML = 100,000,000,000 atoms** (11 decimal places). Each module has its own `Amount` type matching the daemon wire format:

- `crypto::Amount`: a `u128` atom value (re-exported from mintlayer-core), built with `Amount::from_atoms(n)`
- `node::Amount`: atoms as `u128`, decoded from the daemon's `{"atoms": "..."}` object
- `indexer::Amount`: `atoms` plus the daemon's `decimal` string
- `wallet::Amount`: optional `atoms`/`decimal`; requests typically set `atoms` only

## Quick start

```rust
use mintlayer_sdk::{Client, crypto};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::builder()
        .node_url("http://127.0.0.1:3030")
        .indexer_url("http://127.0.0.1:3000")
        .wallet_url("http://127.0.0.1:3034")
        .build()?;

    // Query the chain tip from the indexer.
    let tip = client.indexer.as_ref().unwrap().tip().await?;
    println!("chain tip: height={} id={}", tip.block_height, tip.block_id);

    // Derive an address natively (no runtime initialization).
    let account = crypto::make_default_account_privkey(MNEMONIC, crypto::Network::Testnet, None)?;
    let spend = crypto::make_receiving_address(&account, 0)?;
    let address = crypto::pubkey_to_pubkeyhash_address(
        &crypto::public_key_from_private_key(&spend),
        crypto::Network::Testnet,
    );
    println!("address: {address}");
    Ok(())
}

// The well-known public BIP39 test mnemonic. Never send real funds to
// addresses derived from it; use your own mnemonic read from an environment
// variable or an interactive prompt.
const MNEMONIC: &str = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
```

`mintlayer_sdk::prelude` re-exports the shared crypto types (`Amount`, `Network`, `SigHashType`, `TokenTotalSupply`, key and transaction types, the SCALE `Encode`/`DecodeAll` traits) so single-import callers do not need to reach into `crypto`.

## Guides

| Guide | Contents |
| ----- | -------- |
| [Node client](node.md) | Chainstate, mempool, P2P, block submission, trust policy |
| [Indexer client](indexer.md) | Chain, blocks, transactions, addresses, pools, tokens, orders, statistics |
| [Wallet client](wallet.md) | Wallet lifecycle, accounts, balances, transactions, tokens, orders |
| [Cryptography](crypto.md) | Keys, addresses, inputs, outputs, signing |
| [Building transactions](transactions.md) | Full-custody flow: UTXOs, fees, signing, submission |
| [Staking](staking.md) | Pool creation, delegation, withdrawal |
| [Tokens and NFTs](tokens.md) | Fungible tokens and NFTs: issuance, minting, freezing, orders |

Runnable examples live in the repository under [examples/](https://github.com/mintlayer/rust-sdk/tree/main/examples) (`send-coins`, `issue-token`).
