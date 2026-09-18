---
title: "Node client"
description: "Node client reference for the Mintlayer Rust SDK: chainstate, mempool, P2P, block submission, and trust policy."
sidebar_position: 2
---

# Node client

The `node` module is a JSON-RPC 2.0 client for the Mintlayer node daemon.

```rust
use mintlayer_sdk::node::{self, TrustPolicy};

let c = node::Client::new("http://127.0.0.1:3030");

// Or with options:
let c = node::Client::builder("http://127.0.0.1:3030")
    .basic_auth("user", "pass")                  // optional
    .timeout(std::time::Duration::from_secs(10)) // optional, default 30s
    .build()?;
```

**Default ports:** 3030 (mainnet), 13030 (testnet).

Credentials are sent as HTTP basic auth with every request. They are
redacted from `Debug` output, so logging a client never leaks the password.
Response bodies are capped at 64 MiB to guard against memory exhaustion
from a misconfigured endpoint.

Errors are returned as `node::Error`:

- `Error::Rpc { code, message }` — the daemon answered with a JSON-RPC error.
- `Error::Http(reqwest::Error)` — transport failure.
- `Error::Json(serde_json::Error)` — the response could not be decoded.
- `Error::IdMismatch { expected, actual }` — response id mismatch.
- `Error::ResponseTooLarge { limit }` — the 64 MiB cap was exceeded.

---


> **Transport security:** loopback `http://` is fine. For remote daemons use
> an `https://` URL (TLS is built in via rustls) or an authenticated tunnel —
> basic-auth credentials otherwise transit in cleartext with every request.

## Chain state

| Method | RPC method | Notes |
|--------|-----------|-------|
| `chainstate_info() -> Result<ChainstateInfo, Error>` | `chainstate_info` | Height, id, timestamps, IBD flag of the tip |
| `best_block_id() -> Result<String, Error>` | `chainstate_best_block_id` | Hex-encoded block id |
| `best_block_height() -> Result<u64, Error>` | `chainstate_best_block_height` | |
| `block_id_at_height(height: u64) -> Result<Option<String>, Error>` | `chainstate_block_id_at_height` | `None` when not on the main chain |
| `block_height_in_main_chain(block_id: &str) -> Result<Option<u64>, Error>` | `chainstate_block_height_in_main_chain` | `None` when orphaned or unknown |
| `block(id: &str) -> Result<Option<String>, Error>` | `chainstate_get_block` | Hex-encoded block; the genesis block cannot be retrieved |
| `block_json(id: &str) -> Result<serde_json::Value, Error>` | `chainstate_get_block_json` | |
| `mainchain_blocks(from: u64, max_count: u32) -> Result<Vec<String>, Error>` | `chainstate_get_mainchain_blocks` | Up to `max_count` hex-encoded blocks |
| `utxo(outpoint: &Outpoint) -> Result<Option<serde_json::Value>, Error>` | `chainstate_get_utxo` | `None` when spent or unknown |
| `stake_pool_balance(pool_address: &str) -> Result<Option<Amount>, Error>` | `chainstate_stake_pool_balance` | Pledge plus delegations |
| `staker_balance(pool_address: &str) -> Result<Option<Amount>, Error>` | `chainstate_staker_balance` | Staker's own balance only |
| `pool_decommission_destination(pool_address: &str) -> Result<Option<String>, Error>` | `chainstate_pool_decommission_destination` | |
| `delegation_share(pool_address, delegation_address) -> Result<Option<Amount>, Error>` | `chainstate_delegation_share` | |
| `token_info(token_id: &str) -> Result<Option<TokenInfo>, Error>` | `chainstate_token_info` | |
| `tokens_info(token_ids: &[String]) -> Result<Vec<TokenInfo>, Error>` | `chainstate_tokens_info` | Batch lookup, order preserved |
| `order_info(order_id: &str) -> Result<Option<OrderInfo>, Error>` | `chainstate_order_info` | See the nonce quirk below |
| `orders_info_by_currencies(ask, give) -> Result<BTreeMap<String, OrderInfo>, Error>` | `chainstate_orders_info_by_currencies` | `None` filters match every currency |
| `submit_block(block_hex: &str) -> Result<(), Error>` | `chainstate_submit_block` | For block producers |

`Amount` is a `u128` atom count (1 ML = 100,000,000,000 atoms), serialized
as a decimal string inside an `{"atoms": "..."}` object on the wire.

**Quirk:** in [`OrderInfo`](#) the `nonce` field is
`Option<u64>` because the daemon returns `null` while an order has no
account spending history; handle both cases.

`TokenInfo` keeps the type-specific payload as raw JSON because its shape
depends on `kind` (`"FungibleToken"` or `"NonFungibleToken"`).

---

## Mempool

| Method | RPC method | Notes |
|--------|-----------|-------|
| `contains_tx(tx_id: &str) -> Result<bool, Error>` | `mempool_contains_tx` | |
| `contains_orphan_tx(tx_id: &str) -> Result<bool, Error>` | `mempool_contains_orphan_tx` | |
| `transaction(tx_id: &str) -> Result<Option<MempoolTx>, Error>` | `mempool_get_transaction` | Mempool and orphan pool |
| `submit_transaction(tx_hex: &str, trust_policy: TrustPolicy) -> Result<(), Error>` | `mempool_submit_transaction` | Local mempool only, no P2P broadcast |
| `fee_rate(in_top_x_mb: u32) -> Result<Option<FeeRate>, Error>` | `mempool_get_fee_rate` | Atoms per kilobyte; `None` when no estimate |
| `fee_rate_points() -> Result<Vec<FeeRatePoint>, Error>` | `mempool_get_fee_rate_points` | Curve of `[size, rate]` pairs |
| `memory_usage() -> Result<u64, Error>` | `mempool_memory_usage` | Bytes |

## P2P

| Method | RPC method | Notes |
|--------|-----------|-------|
| `peer_count() -> Result<u64, Error>` | `p2p_get_peer_count` | |
| `connected_peers() -> Result<Vec<PeerInfo>, Error>` | `p2p_get_connected_peers` | Addresses, roles, ban scores, pings |
| `bind_addresses() -> Result<Vec<String>, Error>` | `p2p_get_bind_addresses` | |
| `add_reserved_node(addr: &str) -> Result<(), Error>` | `p2p_add_reserved_node` | |
| `remove_reserved_node(addr: &str) -> Result<(), Error>` | `p2p_remove_reserved_node` | |
| `connect(addr: &str) -> Result<(), Error>` | `p2p_connect` | One-time connection |
| `disconnect(peer_id: u64) -> Result<(), Error>` | `p2p_disconnect` | |
| `list_banned() -> Result<Vec<BannedPeer>, Error>` | `p2p_list_banned` | |
| `ban(address: &str, duration: Duration) -> Result<(), Error>` | `p2p_ban` | Duration is sent as `[secs, nanos]` |
| `unban(address: &str) -> Result<(), Error>` | `p2p_unban` | |
| `broadcast_transaction(tx_hex: &str, trust_policy: TrustPolicy) -> Result<(), Error>` | `p2p_submit_transaction` | The normal path for publishing a transaction |

## Node management

| Method | RPC method | Notes |
|--------|-----------|-------|
| `node_version() -> Result<String, Error>` | `node_version` | e.g. `"1.3.0"` |
| `node_shutdown() -> Result<(), Error>` | `node_shutdown` | Graceful shutdown |

---

## Trust policy

`TrustPolicy` is applied when submitting a transaction:

| Variant | Meaning |
|---------|---------|
| `TrustPolicy::Trusted` (default) | Accept the transaction only if fully valid against the current chainstate |
| `TrustPolicy::Untrusted` | Accept the transaction even if some inputs are not yet known |

Use `Untrusted` for transactions received from external sources (so that
orphaned spends are not rejected), `Trusted` for transactions you
constructed yourself.

```rust
// Submit locally and broadcast in one call:
c.broadcast_transaction(&signed_tx_hex, TrustPolicy::Untrusted).await?;
```

## Top-level client

`Client::builder()` creates the node client only when a `node_url` is set;
`basic_auth` applies to the node and wallet clients but never to the
unauthenticated indexer.
