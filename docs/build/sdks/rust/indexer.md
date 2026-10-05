---
title: "Indexer client"
description: "Indexer client reference for the Mintlayer Rust SDK: chain, blocks, transactions, addresses, pools, tokens, orders, statistics."
sidebar_position: 4
---

# Indexer client

The `indexer` module is a REST client for the Mintlayer indexer
(`api-web-server`). All paths are relative to `/api/v2/`, which the client
appends to the base URL automatically.

```rust
use mintlayer_sdk::indexer::{self, PageOpts, PoolListOpts, PoolSort};

let c = indexer::Client::new("http://127.0.0.1:3000");

// Or with options:
let c = indexer::Client::builder("http://127.0.0.1:3000")
    .timeout(std::time::Duration::from_secs(15)) // optional, default 30s
    .http_client(reqwest::Client::new())         // optional
    .build()?;
```

**Default ports:** 3000 (mainnet), 13000 (testnet).

The indexer API is unauthenticated; there are no credential options.

Errors are returned as `indexer::Error`:

- `Error::Http { status_code, body }` — any non-2xx response; the body is
  trimmed and stripped of control characters.
- `Error::Transport(reqwest::Error)` — the request failed.
- `Error::Json(serde_json::Error)` — the response could not be decoded.
- `Error::InvalidUrl { message }` — a path segment contained characters
  outside `[A-Za-z0-9_-]` (ids, addresses and tickers are validated before
  being interpolated into the path).
- `Error::ResponseTooLarge { limit }` — the response exceeded 64 MiB.
- `Error::InvalidCursor` — the indexer rejected a cursor (`400`, body
  `Invalid cursor`): malformed, oversized, from a different listing, or
  minted for the other side of an order book.
- `Error::InvalidNumItems` — the page size was not in `1..=100` (`400`,
  body `Invalid number of items`).
- `Error::BadRequest` — incompatible query parameters (`400`, body
  `Bad request`), e.g. a cursor together with an `offset_mode`, or a
  cursor with a non-default pools sort.
- `Error::TokenNotFound` — unknown token id (`404`, body `Token not
  found`).

:::note[Requires api-server 1.4.1+ and an unreleased SDK]

Cursor pagination, the holders listings, and the order book documented
below were added for api-server 1.4.1 (mintlayer-core PR #2130). They
ship in the next SDK release after v0.1.0
([mintlayer/rust-sdk#4](https://github.com/mintlayer/rust-sdk/pull/4),
unreleased at the time of writing); the offset-based `PageOpts` methods
work against every api-server version.

:::

---


> **Transport security:** loopback `http://` is fine; the indexer API is
> unauthenticated. For remote indexers prefer an `https://` URL so response
> data cannot be tampered with in transit.

## Pagination

List endpoints take `PageOpts`:

```rust
use mintlayer_sdk::indexer::PageOpts;

let opts = PageOpts { offset: 20, items: 10 };
// zero values are omitted from the query; the server defaults
// to offset 0 and 10 items per page
```

`PoolListOpts` extends the same pagination with a `sort` field
(`PoolSort::ByHeight`, the server default, or `PoolSort::ByPledge`).
`PageOpts.offset` is a `u64`: the server accepts the full range, and the
transaction listing's absolute offset mode uses global transaction
indexes as offsets.

### Cursor pagination

Four listings support keyset (cursor) pagination: the pools listing, the
global transaction listing, the coin/token holders, and the order book.
A cursor page is an envelope, not a bare array:

```rust
use mintlayer_sdk::indexer::Page;

pub struct Page<T> {
    pub items: Vec<T>,
    pub next_cursor: Option<String>, // None on the last page
}
```

A `None` `next_cursor` means the listing is exhausted. Cursors are
opaque, server-minted values (base64 JSON ≤ 1 KiB): pass `next_cursor`
back verbatim, never construct or modify one.

Single-page methods (`*_paged`) take an explicit `Option<&str>` cursor;
`None` starts from the beginning. Where the REST endpoint also accepts an
offset, a cursor silently overrides the offset page position on the
server (`items` still applies):

```rust
list_pools_paged(cursor: Option<&str>, items: u32)
    -> Result<Page<Pool>, Error>
list_transactions_paged(cursor: Option<&str>, items: u32)
    -> Result<Page<Transaction>, Error>
coin_holders(opts: HoldersOpts) -> Result<Page<Holder>, Error>
token_holders(token_id: &str, opts: HoldersOpts)
    -> Result<Page<Holder>, Error>
order_pair_book(base: &str, quote: &str, side: OrderBookSide,
    opts: OrderBookOpts) -> Result<OrderBook, Error>
```

`HoldersOpts` and `OrderBookOpts` are `{ offset, items, cursor }`
triples — the offset is used only on no-cursor requests. For full walks
use the pagers: `Pager<T>` follows `next_cursor` automatically and stops
on `None` (including a truncated order book, whose cursor cannot be
continued). A failed fetch leaves the pager positioned at the same
cursor, so the walk may simply be retried:

```rust
use mintlayer_sdk::indexer::Client;

let indexer = Client::new("http://127.0.0.1:3000");
let mut holders = indexer.coin_holders_pager(100);
while let Some(holder) = holders.next().await {
    let holder = holder?;
    println!("{}  {}", holder.address, holder.amount.decimal);
}
```

Pager constructors:

```rust
pools_pager(items: u32) -> Pager<Pool>
transactions_pager(items: u32) -> Pager<Transaction>
coin_holders_pager(items: u32) -> Pager<Holder>
token_holders_pager(token_id: &str, items: u32) -> Result<Pager<Holder>, Error>
order_book_pager(base: &str, quote: &str, side: OrderBookSide, items: u32)
    -> Result<Pager<OrderBookLevel>, Error>
```

`Pager` offers two views over the same walk — `next()` yields item by
item, `next_page()` page by page (don't mix them); `start_from(cursor)`
resumes (or rewinds) a walk from a persisted cursor; `cursor()` returns
the position the next fetch resumes from. `items` are clamped to
`1..=100` on all constructors.

Per-endpoint rules:

- **Pools**: cursors follow the default `by_height` order only —
  `list_pools_paged` sends no sort parameter; for `by_pledge` use the
  offset-based `list_pools`. Ordering is newest creation height first,
  ties broken by pool id in descending byte order.
- **Transactions**: a cursor and an `offset_mode` are mutually exclusive
  (`Error::BadRequest`); see the transactions section below.
- **Order book**: cursors are side-specific (`book-ask`/`book-bid`) — an
  ask cursor on a bid walk is `Error::InvalidCursor`.
- Pages are guaranteed stable only once the indexer's scanner is fully
  caught up; a walk during catch-up or a reorg may skip or repeat an
  entry.

### Offset modes

The global transaction listing accepts an `offset_mode` parameter (no
cursor):

```rust
use mintlayer_sdk::indexer::{OffsetMode, PageOpts};

// offset is a skip-N offset into the listing as scanned right now
// (the server default)
let legacy = indexer
    .list_transactions_with_offset_mode(OffsetMode::Legacy,
        PageOpts { offset: 10_000, items: 50 })
    .await?;
// offset is a global transaction index: the page holds the transactions
// with global indexes below it — stable across scanner catch-up
let absolute = indexer
    .list_transactions_with_offset_mode(OffsetMode::Absolute,
        PageOpts { offset: 10_000, items: 50 })
    .await?;
```

---

## Chain

| Method | REST path | Notes |
|--------|-----------|-------|
| `tip() -> Result<ChainTip, Error>` | `GET /chain/tip` | `ChainTip { block_height, block_id }` |
| `genesis() -> Result<GenesisInfo, Error>` | `GET /chain/genesis` | Genesis block id, message, UTXO set |
| `block_id_at_height(height: u64) -> Result<String, Error>` | `GET /chain/{height}` | 404 `Error::Http` beyond the tip |

## Blocks

| Method | REST path | Notes |
|--------|-----------|-------|
| `block(id: &str) -> Result<Block, Error>` | `GET /block/{id}` | Header, reward outputs, transactions |
| `block_header(id: &str) -> Result<BlockHeader, Error>` | `GET /block/{id}/header` | Cheaper than `block` |
| `block_reward(id: &str) -> Result<Vec<serde_json::Value>, Error>` | `GET /block/{id}/reward` | Raw JSON outputs |
| `block_transaction_ids(id: &str) -> Result<Vec<String>, Error>` | `GET /block/{id}/transaction-ids` | |

## Addresses

| Method | REST path | Notes |
|--------|-----------|-------|
| `address_info(address: &str) -> Result<AddressInfo, Error>` | `GET /address/{address}` | Coin and token balances, history |
| `spendable_utxos(address: &str) -> Result<Vec<Utxo>, Error>` | `GET /address/{address}/spendable-utxos` | Confirmed, immediately spendable |
| `all_utxos(address: &str) -> Result<Vec<Utxo>, Error>` | `GET /address/{address}/all-utxos` | Includes locked outputs |
| `delegations(address: &str) -> Result<Vec<DelegationInfo>, Error>` | `GET /address/{address}/delegations` | |
| `token_authority(address: &str) -> Result<Vec<String>, Error>` | `GET /address/{address}/token-authority` | Token ids the address controls |

## Transactions

| Method | REST path | Notes |
|--------|-----------|-------|
| `list_transactions(opts: PageOpts) -> Result<Vec<Transaction>, Error>` | `GET /transaction` | Newest first; plain array (offset listing) |
| `list_transactions_paged(cursor, items) -> Result<Page<Transaction>, Error>` | `GET /transaction` | Cursor walk; newest block first, in block order within each block |
| `list_transactions_with_offset_mode(mode, opts) -> Result<Vec<Transaction>, Error>` | `GET /transaction` | `OffsetMode::Legacy` (skip-N, default) or `Absolute` (offset = global tx index, stable across catch-up); exclusive with a cursor |
| `transactions_pager(items: u32) -> Pager<Transaction>` | `GET /transaction` | Full cursor walk |
| `transaction(id: &str) -> Result<Transaction, Error>` | `GET /transaction/{id}` | See the pending-transaction note below |
| `transaction_merkle_path(id: &str) -> Result<MerklePath, Error>` | `GET /transaction/{id}/merkle-path` | 404 before confirmation |
| `transaction_output(tx_id: &str, index: u32) -> Result<serde_json::Value, Error>` | `GET /transaction/{tx_id}/output/{index}` | Raw JSON |
| `submit_transaction(signed_tx_hex: &str) -> Result<String, Error>` | `POST /transaction` | Requires `--enable-post-routes`; returns the tx id |

**Pending transactions:** since api-server 1.4.1 the `Transaction`
fields `block_id`, `timestamp` and `confirmations` are `Option<String>`;
a pending (mempool) transaction has `None` for all three on the wire,
and no `fee` field. Older api-servers rendered those fields as empty
strings.

## Pools and delegations

| Method | REST path | Notes |
|--------|-----------|-------|
| `list_pools(opts: PoolListOpts) -> Result<Vec<Pool>, Error>` | `GET /pool` | `sort=by_height` (default) or `by_pledge` |
| `list_pools_paged(cursor, items) -> Result<Page<Pool>, Error>` | `GET /pool` | Cursor walk, `by_height` order only (send `list_pools` for `by_pledge`) |
| `pools_pager(items: u32) -> Pager<Pool>` | `GET /pool` | Full cursor walk, newest creation height first |
| `pool(id: &str) -> Result<Pool, Error>` | `GET /pool/{id}` | |
| `pool_block_stats(id: &str, from: i64, to: i64) -> Result<u64, Error>` | `GET /pool/{id}/block-stats` | Block count in `[from, to)`, UNIX seconds |
| `pool_delegations(id: &str) -> Result<Vec<PoolDelegation>, Error>` | `GET /pool/{id}/delegations` | Includes `creation_block_height` |
| `delegation(id: &str) -> Result<Delegation, Error>` | `GET /delegation/{id}` | |

## Tokens and NFTs

| Method | REST path | Notes |
|--------|-----------|-------|
| `list_tokens(opts: PageOpts) -> Result<Vec<String>, Error>` | `GET /token` | Bech32 token ids |
| `token(id: &str) -> Result<TokenInfo, Error>` | `GET /token/{id}` | |
| `token_transactions(id: &str, opts: PageOpts) -> Result<Vec<TokenTx>, Error>` | `GET /token/{id}/transactions` | |
| `tokens_by_ticker(ticker: &str, opts: PageOpts) -> Result<Vec<String>, Error>` | `GET /token/ticker/{ticker}` | Tickers are not unique |
| `nft(id: &str) -> Result<NftInfo, Error>` | `GET /nft/{id}` | Owner, token id, metadata |

## Orders

| Method | REST path | Notes |
|--------|-----------|-------|
| `list_orders(opts: PageOpts) -> Result<Vec<Order>, Error>` | `GET /order` | |
| `order(id: &str) -> Result<Order, Error>` | `GET /order/{id}` | |
| `orders_by_pair(ask, give, opts) -> Result<Vec<Order>, Error>` | `GET /order/pair/{ask}_{give}` | Currencies are the coin ticker (e.g. `ML`) or a bech32 token id |
| `order_pair_book(base, quote, side, opts) -> Result<OrderBook, Error>` | `GET /order/pair/{base}_{quote}/book` | Aggregated book, one side per call; requires api-server 1.4.1+ |
| `order_book_pager(base, quote, side, items) -> Result<Pager<OrderBookLevel>, Error>` | `GET /order/pair/{base}_{quote}/book` | Full walk of one side |

`order_pair_book` returns the aggregated order book of a pair:
`{base}_{quote}` with the native coin ticker matched case-insensitively
and token ids as exact bech32 strings; `OrderBookSide::Ask` lists
ascending prices (orders giving the quote to buy the base),
`OrderBookSide::Bid` descending. Each `OrderBookLevel` carries
`price: OrderBookPrice` — `atoms` is the exact price as a reduced
rational `"numer/denom"` (quote atoms per base atom), `decimal` that
price floored toward zero — and `amount`, the remaining base-currency
balance summed across orders at that price.

Book-specific invariants:

- Cursors are side-specific: an ask cursor on a bid walk is
  `Error::InvalidCursor`, and vice versa.
- Each request scans at most 10,000 live orders. When the cap truncates
  the scan, `OrderBook::truncated` is `true` and `next_cursor` is `None`:
  the levels in hand are an incomplete aggregation and the walk cannot
  be continued — re-issue the request instead of paging on.
- The book is computed fresh per request, so a paginated walk is not a
  consistent snapshot.
- The `order_book_pager` maps a truncated page to a plain end-of-walk;
  when the caller must know, call `order_pair_book` directly and inspect
  `truncated`.

## Statistics and fees

| Method | REST path | Notes |
|--------|-----------|-------|
| `coin_statistics() -> Result<CoinStats, Error>` | `GET /statistics/coin` | Circulating, preminted, burned, staked (unwritten counters are zero) |
| `token_statistics(token_id: &str) -> Result<CoinStats, Error>` | `GET /statistics/token/{token_id}` | Unknown token → `Error::TokenNotFound` |
| `coin_holders(opts: HoldersOpts) -> Result<Page<Holder>, Error>` | `GET /statistics/coin/holders` | Top balances, largest first; cursor-paginated |
| `token_holders(token_id: &str, opts: HoldersOpts) -> Result<Page<Holder>, Error>` | `GET /statistics/token/{token_id}/holders` | Amounts use the token's decimals |
| `coin_holders_pager(items: u32) -> Pager<Holder>` | `GET /statistics/coin/holders` | Full walk |
| `token_holders_pager(token_id: &str, items: u32) -> Result<Pager<Holder>, Error>` | `GET /statistics/token/{token_id}/holders` | Full walk |
| `fee_rate(in_top_x_mb: u32) -> Result<String, Error>` | `GET /feerate` | Atoms per KB; `0` uses the server default of 5 MB |

---

## Amounts and string-encoded numbers

The indexer serializes some numeric fields as JSON strings or mixed
representations. The client types absorb this transparently, but be aware
of the shapes:

- `Amount` carries both fields: `atoms: u128` and `decimal: String`
  (whole coins).
- `Uint64` fields (`next_nonce`, `creation_block_height`, `Order::nonce`)
  may arrive as a JSON integer or a decimal string; `.0` gives the `u64`,
  `Display` prints the number.
- `PerThousand` (pool `margin_ratio_per_thousand`) may arrive as a number
  or as a decimal string with an optional trailing `%`.

Example:

```rust
use mintlayer_sdk::indexer::Client;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let c = Client::new("http://127.0.0.1:3000");

    let tip = c.tip().await?;
    println!("tip: {} at height {}", tip.block_id, tip.block_height);

    let pool = c.pool("mpool1...").await?;
    println!(
        "staker {} delegated {}",
        pool.staker_balance.decimal, pool.delegations_balance.decimal
    );

    // Submit a signed transaction (requires --enable-post-routes).
    // let tx_id = c.submit_transaction(&signed_hex).await?;
    Ok(())
}
```
