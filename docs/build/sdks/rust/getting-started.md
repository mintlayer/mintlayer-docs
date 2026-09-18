---
title: "Getting Started"
description: "Set up the Mintlayer Rust SDK: installation, features, first call, networks, amounts, error handling, and testing."
sidebar_position: 2
---

# Getting Started

This page covers everything needed to get a project running with the Rust SDK: installation, the first call, networks, units, error handling, and testing. The sub-client references ([Node](node.md), [Indexer](indexer.md), [Wallet](wallet.md), [Cryptography](crypto.md)) document the full API surface.

## Requirements

- **Rust 1.92+** (edition 2024), async on tokio; the crate is `#![forbid(unsafe_code)]`
- Whichever services your code talks to: a synced [node-daemon](../../../node/index.md), an [api-web-server](../../../getting-started/install/install-from-docker.md#running-the-api-server-stack) indexer, and/or a wallet-rpc-daemon. For development setups see [Developer Setup](../../development.md).
- If you use the `crypto` feature, see the patch requirement under Installation.

## Installation

```toml
[dependencies]
mintlayer-sdk = { git = "https://github.com/mintlayer/rust-sdk", features = ["full"] }
```

Features: the default set enables `node`, `indexer`, and `wallet`; `crypto` is opt-in because it pulls in the mintlayer-core dependency graph; `full` enables everything.

:::note[Consumer requirement for the crypto feature]

The SDK depends on unpublished mintlayer-core crates, so Cargo ignores the repository's `[patch.crates-io]` section in downstream builds. Copy the `parity-scale-codec` git patch from the SDK's root `Cargo.toml` into your own workspace, or transactions encoded by the `crypto` feature may not match the encodings produced by mintlayer-core.

:::

## First call

`Client::builder()` creates only the sub-clients whose URL is set:

```rust
use mintlayer_sdk::Client;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::builder()
        .node_url("http://127.0.0.1:3030")
        .indexer_url("http://127.0.0.1:3000")
        .wallet_url("http://127.0.0.1:3034")
        .build()?;

    let tip = client.indexer.as_ref().unwrap().tip().await?;
    println!("chain tip: height={} id={}", tip.block_height, tip.block_id);
    Ok(())
}
```

Basic-auth credentials (`basic_auth("user", "pass")`) apply to the node and wallet clients only; the indexer API is unauthenticated. There is no runtime to initialize: unlike the Go SDK, the `crypto` module calls mintlayer-core natively and needs no `InitWASM` or `Close`.

## Networks and endpoints

| Service | Mainnet | Testnet | Protocol |
| ------- | ------- | ------- | -------- |
| node-daemon RPC | `3030` | `13030` | JSON-RPC 2.0 (HTTP and WebSocket) |
| api-web-server (indexer) | `3000` | `13000` | REST under `/api/v2/` |
| wallet-rpc-daemon RPC | `3034` | `13034` | JSON-RPC 2.0 |

Crypto operations take the network explicitly (`Network::Mainnet`, `Testnet`, `Regtest`, `Signet`), and fork-sensitive functions take a `current_block_height`: pass the predicted inclusion height (tip + 1) and refuse to operate near a fork height.

Loopback `http://` is fine; for remote daemons use `https://` (TLS via rustls) or an authenticated tunnel, since basic-auth credentials otherwise transit in cleartext.

## Amounts

All amounts are atom counts: **1 ML = 100,000,000,000 atoms** (11 decimal places). Each module has its own `Amount` type matching the daemon wire format:

- `crypto::Amount`: a `u128` atom value, built with `Amount::from_atoms(n)`
- `node::Amount`: atoms as `u128`, decoded from the daemon's `{"atoms": "..."}` object
- `indexer::Amount`: `atoms` plus the daemon's `decimal` string
- `wallet::Amount`: optional `atoms`/`decimal`; requests typically set `atoms` only

## Error handling

- `node::Error` / `wallet::Error`: `Rpc { code, message }` for JSON-RPC errors, plus transport/decoding variants.
- `indexer::Error`: `Http { status_code, body }` for non-2xx responses, plus transport/decoding variants.
- `crypto::Error`: typed variants (`InvalidMnemonic`, `AddressParse`, `InputSigning`, `Sighash`, `OrdersV1NotActivated`, ...).

Transport hardening is built in: request ids are unique per client, basic-auth credentials are redacted from `Debug` output, and response bodies are capped at 64 MiB.

## Testing

- The SDK repository carries its own test suite (`cargo test`) and runnable examples:

  ```bash
  cargo run --example send-coins --features crypto,indexer -- --mnemonic "..." --to mtc1q... --amount 100000000000 --network testnet
  cargo run --example issue-token --features wallet -- --wallet /tmp/wallet.dat --ticker MYTOKEN --supply 1000000
  ```

- For your own code, test against **testnet**: get TML from the [faucet](https://faucet.mintlayer.org) (testnet addresses start with `tmt1`) and point the clients at the testnet ports above.
- For fully local iteration, use `Network::Regtest` with a [regtest node](../../../build/development.md#running-a-node-for-development) and generate blocks on demand.
- Keep the committed `Cargo.lock` of the SDK for reproducible builds; mintlayer-core crates are pinned to an exact commit.

## Next steps

- [Node Client](node.md), [Indexer Client](indexer.md), [Wallet Client](wallet.md), [Cryptography](crypto.md): the full API references
- [Building transactions](transactions.md): the full-custody flow without the wallet daemon
- [Guides](../../../guides/rust/index.md): tokens, NFTs, staking, orders, and atomic swaps in Rust
