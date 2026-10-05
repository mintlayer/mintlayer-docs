---
title: "Indexer Client"
description: "Indexer Client reference for the Mintlayer Go SDK."
sidebar_position: 4
---

# Indexer Client

The `indexer` package is a REST client for the Mintlayer indexer (`api-web-server`).
All paths are relative to `/api/v2/`. The endpoints wrapped here are documented in detail under [API Endpoints](../../../api/endpoints/chain.md); each section below names the endpoint it calls.

```go
import "github.com/mintlayer/go-sdk/indexer"

c := indexer.New("http://127.0.0.1:3000",
    indexer.WithTimeout(15*time.Second), // optional
)
```

**Default port:** 3000 (mainnet), 13000 (testnet).

Non-2xx HTTP responses are returned as `*indexer.HTTPError`:

```go
type HTTPError struct {
    StatusCode int
    Body       string
    Message    string    // the server's {"error": "..."} message
    Kind       ErrorKind // classification, see "Errors" below
}
```

:::note[Requires api-server 1.4.1+ and an unreleased SDK]

Cursor pagination, the holders listings, and the order book documented below were added for api-server 1.4.1 (mintlayer-core PR #2130). They ship in the next SDK release after v0.1.0 ([mintlayer/go-sdk#4](https://github.com/mintlayer/go-sdk/pull/4), unreleased at the time of writing); the offset-based `PageOpts` methods work against every api-server version.

:::

---

## Pagination

List endpoints accept `PageOpts`:

```go
type PageOpts struct {
    Offset uint32 // default: 0
    Items  uint32 // default: 10 (server-side default)
}
```

Pass zero values to use server defaults. On every paginated endpoint the server rejects `items=0` and caps the page at 100 (`400 "Invalid number of items"` otherwise); see [Pagination](../../../api/conventions.md#pagination) for the full contract.

### Cursor pagination

The pools listing, the global transaction listing, the coin/token holders, and the order book support keyset (cursor) pagination. A cursor page is an envelope, not a bare array:

```go
type CursorPage[T any] struct {
    Items      []T     // this page's entries
    NextCursor *string // server-issued cursor of the next page; nil = exhausted
}
```

A `nil` `NextCursor` means the listing is exhausted. Cursors are opaque, server-minted values (base64 JSON ≤ 1 KiB): pass `NextCursor` back verbatim with `WithCursor`, never construct or modify one.

Single-page methods (plain-array offset listings keep their existing shapes):

```go
func (c *Client) ListPoolsPage(ctx context.Context, opts ...ListOption) (*CursorPage[Pool], error)
func (c *Client) ListTransactionsPage(ctx context.Context, opts ...ListOption) (*CursorPage[Transaction], error)
func (c *Client) ListCoinHolders(ctx context.Context, opts ...ListOption) (*CursorPage[Holder], error)
func (c *Client) ListTokenHolders(ctx context.Context, tokenID string, opts ...ListOption) (*CursorPage[Holder], error)
func (c *Client) GetOrderBook(ctx context.Context, pair string, opts ...ListOption) (*OrderBookPage, error)
```

For full walks use the pagers — a `Pager[T]` follows the server cursor automatically, stops on a `nil` cursor, and never re-serves an item. A pager is single-use and not safe for concurrent use; pages are fetched lazily. A failed fetch (transport error, `*HTTPError`) does not advance the walk, so `NextPage` is retryable:

```go
pager := indexer.CoinHoldersPager(c, indexer.WithItems(100))
for {
    page, err := pager.NextPage(ctx)
    if err != nil {
        return err // retryable: the walk resumes where it stopped
    }
    if page == nil { // nil page = walk finished
        break
    }
    for _, h := range page {
        fmt.Printf("%s  %s\n", h.Address, h.Amount.Decimal)
    }
}
```

Or item by item with `Walk` (return `false` to stop early; the next `Walk`/`NextPage` call resumes after the last served item):

```go
err := pager.Walk(ctx, func(h indexer.Holder) bool {
    fmt.Println(h.Address)
    return true
})
```

Pager constructors — each validates its options up front and surfaces construction errors on first use:

```go
func PoolsPager(c *Client, opts ...ListOption) *Pager[Pool]
func TransactionsPager(c *Client, opts ...ListOption) *Pager[Transaction]
func CoinHoldersPager(c *Client, opts ...ListOption) *Pager[Holder]
func TokenHoldersPager(c *Client, tokenID string, opts ...ListOption) *Pager[Holder]
func OrderBookPager(c *Client, pair string, side string, opts ...ListOption) *Pager[OrderBookLevel]
```

`Pager` also exposes `NextCursor() *string` (persist it to resume an interrupted walk later — only after the current page is fully consumed) and `Truncated() bool` (order book only, see below).

Per-endpoint rules baked into these methods (enforced server-side, and client-side where stated):

- **Pools**: cursors work only with the default `by_height` sort — `PoolsPager` rejects other sorts client-side; `ListPoolsPage` with a cursor and another sort is a server `400 "Bad request"`. `by_pledge` users keep the offset-based `ListPools`.
- **Transactions**: a cursor and `offset_mode` are mutually exclusive (server `400 "Bad request"`); see `ListTransactionsPage` below.
- **Order book**: cursors are side-specific (`book-ask`/`book-bid`) — an ask cursor on a bid walk is a `400 "Invalid cursor"`.
- A cursor silently overrides the offset page position server-side on pools/holders/order book (`items` still applies).
- Pages are guaranteed stable only once the indexer's scanner is fully caught up; a walk during catch-up or a reorg may skip or repeat an entry.

### List options

The cursor-style methods and pagers take `ListOption` values instead of the `PageOpts` struct:

```go
func WithItems(items uint32) ListOption     // page size, 1..=100 (MaxNumItems); default 10
func WithOffset(offset uint64) ListOption   // offset-based position (see per-endpoint rules)
func WithCursor(cursor string) ListOption   // resume from a server-issued NextCursor
func WithSort(sort string) ListOption       // pools: SortByHeight (default) | SortByPledge
func WithOffsetMode(mode string) ListOption // transactions: OffsetModeLegacy | OffsetModeAbsolute
func WithSide(side string) ListOption       // order book: SideAsk | SideBid (required)
```

Inapplicable options (for example `WithSide` on the holders listing) are rejected client-side with a `*RequestError` before any network traffic.

## Errors

Well-known api-server v2 failures are classified, not string-matched. Every non-2xx reply carries a JSON body of the form `{"error": "<message>"}`; the SDK extracts the message into `HTTPError.Message` and sets `HTTPError.Kind`:

```go
const (
    ErrorKindOther              // anything unrecognised
    ErrorKindBadRequest         // 400 "Bad request"
    ErrorKindInvalidCursor      // 400 "Invalid cursor"
    ErrorKindInvalidNumItems    // 400 "Invalid number of items"
    ErrorKindInvalidOffsetMode  // 400 "Invalid offset mode" (transactions)
    ErrorKindInvalidPoolsSortOrder // 400 "Invalid pools sort order"
    ErrorKindInvalidTokenID     // 400 "Invalid token Id"
    ErrorKindInvalidOrderPair   // 400 "Invalid order trading pair"
    ErrorKindTokenNotFound      // 404 "Token not found"
)
```

Three of them have sentinel errors for `errors.Is`:

```go
if errors.Is(err, indexer.ErrInvalidCursor) {
    // 400 "Invalid cursor": wrong endpoint, wrong book side, malformed, or oversized
}
if errors.Is(err, indexer.ErrInvalidNumItems) {
    // 400 "Invalid number of items": items was 0 or above 100
}
if errors.Is(err, indexer.ErrTokenNotFound) {
    // 404 "Token not found"
}
```

`*RequestError` (fields `Option`, `Reason`) reports a request rejected by client-side validation before it was sent — for example `WithItems(0)`, an empty `WithCursor`, or an option the endpoint does not support.

---

## Chain

### `GetTip`

```go
func (c *Client) GetTip(ctx context.Context) (*ChainTip, error)
```

Returns the highest confirmed block.

```go
type ChainTip struct {
    BlockHeight uint64 `json:"block_height"`
    BlockID     string `json:"block_id"`
}
```

### `GetGenesis`

```go
func (c *Client) GetGenesis(ctx context.Context) (*GenesisInfo, error)
```

Returns genesis block information.

### `GetBlockIDAtHeight`

```go
func (c *Client) GetBlockIDAtHeight(ctx context.Context, height uint64) (string, error)
```

Returns the block ID at a given height. Returns a 404 `HTTPError` if no block exists at that height (for example, when querying a height beyond the current tip).

---

## Blocks

### `GetBlock`

```go
func (c *Client) GetBlock(ctx context.Context, id string) (*Block, error)
```

Returns the full block including header, reward outputs, and all transactions.

### `GetBlockHeader`

```go
func (c *Client) GetBlockHeader(ctx context.Context, id string) (*BlockHeader, error)
```

Returns only the block header. Cheaper than `GetBlock` when you do not need transaction data.

### `GetBlockReward`

```go
func (c *Client) GetBlockReward(ctx context.Context, id string) ([]TxOutput, error)
```

Returns the reward outputs of a block as raw JSON messages.

### `GetBlockTransactionIDs`

```go
func (c *Client) GetBlockTransactionIDs(ctx context.Context, id string) ([]string, error)
```

Returns the transaction IDs included in a block. Use this to page through block contents without fetching full transaction data.

---

## Transactions

### `ListTransactions`

```go
func (c *Client) ListTransactions(ctx context.Context, opts PageOpts) ([]Transaction, error)
```

Returns a paginated list of confirmed transactions across the entire chain, newest block first (within a block, in block order).

For keyset (cursor) pagination use the envelope-based methods — needed for deep walks where an offset gets slow or unstable:

```go
func (c *Client) ListTransactionsPage(ctx context.Context, opts ...ListOption) (*CursorPage[Transaction], error)
func TransactionsPager(c *Client, opts ...ListOption) *Pager[Transaction]
```

`ListTransactionsPage` accepts `WithItems`, `WithOffset`, `WithCursor`, and `WithOffsetMode`:

- `WithOffsetMode(indexer.OffsetModeLegacy)` (default): `WithOffset` is a skip-N offset, counted in the global newest-first listing.
- `WithOffsetMode(indexer.OffsetModeAbsolute)`: `WithOffset` is a global transaction index — the page holds the transactions with global indexes below it. This position is stable across scanner catch-up, unlike a skip-N offset.
- A cursor (`WithCursor`) and an offset mode are mutually exclusive: together the server answers `400 "Bad request"`. Sending a cursor without `WithOffsetMode` returns the envelope; without any cursor the method returns the plain array via a `CursorPage` whose `NextCursor` is `nil`.

A `TransactionsPager` rejects `WithOffsetMode` up front — cursors only.

### `GetTransaction`

```go
func (c *Client) GetTransaction(ctx context.Context, id string) (*Transaction, error)
```

Returns a transaction by ID, including pending (mempool) transactions. The struct fields are plain strings; since api-server 1.4.1 the wire sends `null` for `block_id`, `timestamp`, and `confirmations` on pending transactions, which decodes to empty strings in Go, and the `fee` key is absent until the transaction is confirmed. (Older api-servers rendered those fields as empty strings on the wire — the decoded Go values look the same.)

```go
type Transaction struct {
    ID            string          `json:"id"`
    Inputs        json.RawMessage `json:"inputs"`
    Outputs       json.RawMessage `json:"outputs"`
    BlockID       string          `json:"block_id"`
    Timestamp     string          `json:"timestamp"`
    Confirmations string          `json:"confirmations"`
}
```

### `GetTransactionMerklePath`

```go
func (c *Client) GetTransactionMerklePath(ctx context.Context, id string) (*MerklePath, error)
```

Returns the Merkle inclusion proof for a transaction. Returns a 404 `HTTPError` if the transaction is not yet in a block.

### `GetTransactionOutput`

```go
func (c *Client) GetTransactionOutput(ctx context.Context, txID string, idx uint32) (json.RawMessage, error)
```

Returns a single output from a transaction as raw JSON. The shape is determined by the `"type"` field. Common types: `"Transfer"`, `"LockThenTransfer"`, `"Burn"`, `"CreateStakePool"`, `"CreateDelegationId"`, `"DelegateStaking"`, `"IssueFungibleToken"`, `"IssueNft"`, `"DataDeposit"`, `"Htlc"`, `"CreateOrder"`.

### `SubmitTransaction`

```go
func (c *Client) SubmitTransaction(ctx context.Context, signedTxHex string) (string, error)
```

Submits a hex-encoded signed transaction to the network. Returns the transaction ID on success.

**Requires** the indexer to be started with `--enable-post-routes`.

---

## Addresses

### `GetAddressInfo`

```go
func (c *Client) GetAddressInfo(ctx context.Context, address string) (*AddressInfo, error)
```

Returns balance and transaction history for a bech32m address. Returns a 404 `HTTPError` if the address has no on-chain history.

```go
type AddressInfo struct {
    CoinBalance        Amount         `json:"coin_balance"`
    LockedCoinBalance  Amount         `json:"locked_coin_balance"`
    TransactionHistory []string       `json:"transaction_history"`
    Tokens             []TokenBalance `json:"tokens"`
}
```

### `GetSpendableUTXOs`

```go
func (c *Client) GetSpendableUTXOs(ctx context.Context, address string) ([]UTXO, error)
```

Returns confirmed, unspent UTXOs that can be spent immediately.

### `GetAllUTXOs`

```go
func (c *Client) GetAllUTXOs(ctx context.Context, address string) ([]UTXO, error)
```

Returns all UTXOs including those that are locked or otherwise unspendable.

### `GetDelegations`

```go
func (c *Client) GetDelegations(ctx context.Context, address string) ([]DelegationInfo, error)
```

Returns all staking delegations owned by an address.

```go
type DelegationInfo struct {
    DelegationID     string `json:"delegation_id"`
    PoolID           string `json:"pool_id"`
    NextNonce        uint64 `json:"next_nonce"`
    SpendDestination string `json:"spend_destination"`
    Balance          Amount `json:"balance"`
}
```

### `GetTokenAuthority`

```go
func (c *Client) GetTokenAuthority(ctx context.Context, address string) ([]string, error)
```

Returns the IDs (bech32m) of fungible tokens for which the address holds authority (can mint, freeze, etc.).

---

## Pools and delegations

### `ListPools`

```go
func (c *Client) ListPools(ctx context.Context, opts PoolListOpts) ([]Pool, error)
```

Returns staking pools with optional pagination. The `Sort` field accepts:

- `"by_height"` (default): newest pools first
- `"by_pledge"`: largest staker balance first

```go
type PoolListOpts struct {
    PageOpts
    Sort string
}
```

For keyset (cursor) pagination — deep, stable walks over `by_height` — use:

```go
func (c *Client) ListPoolsPage(ctx context.Context, opts ...ListOption) (*CursorPage[Pool], error)
func PoolsPager(c *Client, opts ...ListOption) *Pager[Pool]
```

Cursors follow the default `by_height` order only: `PoolsPager` rejects other sorts (and `WithOffsetMode`) client-side, and `ListPoolsPage` combining a cursor with another sort gets a server `400 "Bad request"`. For `"by_pledge"` keep the offset-based `ListPools` above. Ordering: newest creation height first, ties broken by pool ID in descending byte order.

### `GetPool`

```go
func (c *Client) GetPool(ctx context.Context, id string) (*Pool, error)
```

Returns a single staking pool by its bech32m pool ID.

```go
type Pool struct {
    PoolID                  string `json:"pool_id"`
    DecommissionDestination string `json:"decommission_destination"`
    StakerBalance           Amount `json:"staker_balance"`
    MarginRatioPerThousand  uint32 `json:"margin_ratio_per_thousand"`
    CostPerBlock            Amount `json:"cost_per_block"`
    VRFPublicKey            string `json:"vrf_public_key"`
    DelegationsBalance      Amount `json:"delegations_balance"`
}
```

### `GetPoolBlockStats`

```go
func (c *Client) GetPoolBlockStats(ctx context.Context, id string, from, to time.Time) (uint64, error)
```

Returns the number of blocks produced by a pool in the half-open interval `[from, to)`.

```go
from := time.Now().Add(-24 * time.Hour)
to   := time.Now()
count, err := c.GetPoolBlockStats(ctx, "mpool1...", from, to)
```

### `GetDelegation`

```go
func (c *Client) GetDelegation(ctx context.Context, id string) (*Delegation, error)
```

Returns a single delegation by its bech32m delegation ID.

```go
type Delegation struct {
    DelegationID        string `json:"delegation_id"`
    PoolID              string `json:"pool_id"`
    NextNonce           uint64 `json:"next_nonce"`
    SpendDestination    string `json:"spend_destination"`
    Balance             Amount `json:"balance"`
    CreationBlockHeight uint64 `json:"creation_block_height"`
}
```

### `GetPoolDelegations`

```go
func (c *Client) GetPoolDelegations(ctx context.Context, id string) ([]PoolDelegation, error)
```

Returns all delegations in a pool. Each entry includes the `CreationBlockHeight` in addition to the standard delegation fields.

---

## Tokens and NFTs

### `ListTokens`

```go
func (c *Client) ListTokens(ctx context.Context, opts PageOpts) ([]string, error)
```

Returns a paginated list of fungible token IDs (bech32m).

### `GetToken`

```go
func (c *Client) GetToken(ctx context.Context, id string) (*TokenInfo, error)
```

Returns full information about a fungible token.

```go
type TokenInfo struct {
    Authority         string          `json:"authority"`
    IsLocked          bool            `json:"is_locked"`
    CirculatingSupply Amount          `json:"circulating_supply"`
    TokenTicker       string          `json:"token_ticker"`
    MetadataURI       string          `json:"metadata_uri"`
    NumberOfDecimals  uint8           `json:"number_of_decimals"`
    TotalSupply       json.RawMessage `json:"total_supply"`
    Frozen            bool            `json:"frozen"`
    IsTokenUnfreezable *bool          `json:"is_token_unfreezable"` // non-nil only when Frozen is true
    IsTokenFreezable   *bool          `json:"is_token_freezable"`  // non-nil only when Frozen is false
    NextNonce         uint64          `json:"next_nonce"`
}
```

### `GetTokenTransactions`

```go
func (c *Client) GetTokenTransactions(ctx context.Context, id string, opts PageOpts) ([]TokenTx, error)
```

Returns the transaction history for a token (issuance, mints, transfers, burns).

### `FindTokensByTicker`

```go
func (c *Client) FindTokensByTicker(ctx context.Context, ticker string, opts PageOpts) ([]string, error)
```

Returns token IDs whose ticker matches the given string. Tickers are not unique, so this may return multiple results.

### `GetNFT`

```go
func (c *Client) GetNFT(ctx context.Context, id string) (*NFTInfo, error)
```

Returns information about an NFT.

---

## Orders

### `ListOrders`

```go
func (c *Client) ListOrders(ctx context.Context, opts PageOpts) ([]Order, error)
```

Returns active orders.

### `GetOrder`

```go
func (c *Client) GetOrder(ctx context.Context, id string) (*Order, error)
```

Returns a single order by its bech32m order ID.

```go
type Order struct {
    OrderID             string          `json:"order_id"`
    ConcludeDestination string          `json:"conclude_destination"`
    GiveCurrency        json.RawMessage `json:"give_currency"`
    InitiallyGiven      Amount          `json:"initially_given"`
    GiveBalance         Amount          `json:"give_balance"`
    AskCurrency         json.RawMessage `json:"ask_currency"`
    InitiallyAsked      Amount          `json:"initially_asked"`
    AskBalance          Amount          `json:"ask_balance"`
    Nonce               uint64          `json:"nonce"`
}
```

`GiveCurrency` and `AskCurrency` are raw JSON objects with a `"type"` field of `"Coin"` or `"Token"`.

### `ListOrdersByPair`

```go
func (c *Client) ListOrdersByPair(ctx context.Context, askCurrency, giveCurrency string, opts PageOpts) ([]Order, error)
```

Returns orders filtered by a trading pair. Pass `"Coin"` or a token ID (bech32m) for each currency.

### `GetOrderBook`

```go
func (c *Client) GetOrderBook(ctx context.Context, pair string, opts ...ListOption) (*OrderBookPage, error)
func OrderBookPager(c *Client, pair string, side string, opts ...ListOption) *Pager[OrderBookLevel]
```

Returns the aggregated order book for a trading pair, one price level per entry. The pair is `"{base}_{quote}"` — the native coin ticker matches case-insensitively, token IDs are exact bech32m strings. Exactly two non-empty parts are required, both must be a registered token or `"Coin"`, otherwise the server answers `400 "Invalid order trading pair"`.

`WithSide(indexer.SideAsk)` (default) lists asks — orders giving the quote currency to buy the base — in ascending price order; `WithSide(indexer.SideBid)` lists bids in descending order. `WithItems` sets the page size. Each price is the summed remaining balance across orders at that price, orders partially filled carry their remainder:

```go
type OrderBookPage struct {
    Levels     []OrderBookLevel `json:"items"`
    Truncated  bool             `json:"truncated,omitempty"`
    NextCursor *string
}

type OrderBookLevel struct {
    Price  OrderBookPrice
    Amount Amount // remaining base currency at this price
}

type OrderBookPrice struct {
    Atoms   string // exact price as "numer/denom" (quote atoms per base atom), reduced
    Decimal string // floored toward zero at the quote currency's decimals
}
```

Rules specific to the book:

- Cursors are side-specific (`book-ask` / `book-bid`): an ask cursor on a bid walk is a `400 "Invalid cursor"`, and vice versa.
- Each request scans at most 10,000 live orders (`indexer.OrderBookMaxOrders`). When the scan hits the cap, `Truncated` is `true` and `NextCursor` is `nil`: the levels in hand are an incomplete aggregation and the walk cannot be continued — re-issue the request (for example with a smaller pair or tighter `items`) instead of paging on.
- The book is computed fresh per request, so a paginated walk is not a consistent snapshot.

```go
pager := indexer.OrderBookPager(c, "Coin_tknAaaa1", indexer.SideAsk, indexer.WithItems(50))
for {
    page, err := pager.NextPage(ctx)
    if err != nil {
        return err
    }
    if page == nil {
        break
    }
    for _, lvl := range page {
        fmt.Printf("price %s (%s)  amount %s\n", lvl.Price.Decimal, lvl.Price.Atoms, lvl.Amount.Decimal)
    }
}
if pager.Truncated() {
    // the book walked was incomplete: re-issue the request instead of continuing
}
```

---

## Statistics

### `GetCoinStatistics`

```go
func (c *Client) GetCoinStatistics(ctx context.Context) (*CoinStats, error)
```

Returns supply statistics for the native ML coin.

```go
type CoinStats struct {
    CirculatingSupply Amount `json:"circulating_supply"`
    Preminted         Amount `json:"preminted"`
    Burned            Amount `json:"burned"`
    Staked            Amount `json:"staked"`
}
```

### `GetTokenStatistics`

```go
func (c *Client) GetTokenStatistics(ctx context.Context, tokenID string) (*CoinStats, error)
```

Returns supply statistics for a fungible token. All four counters are always present; a counter the indexer has not written yet is zero.

### `ListCoinHolders` / `ListTokenHolders`

```go
func (c *Client) ListCoinHolders(ctx context.Context, opts ...ListOption) (*CursorPage[Holder], error)
func (c *Client) ListTokenHolders(ctx context.Context, tokenID string, opts ...ListOption) (*CursorPage[Holder], error)
func CoinHoldersPager(c *Client, opts ...ListOption) *Pager[Holder]
func TokenHoldersPager(c *Client, tokenID string, opts ...ListOption) *Pager[Holder]
```

List the top address balances of the native coin or of a fungible token, largest balance first, ties broken by address in descending byte order. Zero-balance addresses are excluded, and the server ignores offsets here — paginate with cursors:

```go
type Holder struct {
    Address string
    Amount  Amount // balance with the coin's or the token's decimals
}
```

An unknown token ID is a 404 `ErrTokenNotFound`.

### `GetFeeRate`

```go
func (c *Client) GetFeeRate(ctx context.Context, inTopXMb uint32) (string, error)
```

Returns the current fee rate in atoms per kilobyte needed to place a transaction in the top `inTopXMb` megabytes of the mempool priority queue.

---

## Amounts

The `Amount` type carries both raw atoms and a human-readable decimal:

```go
type Amount struct {
    Atoms   string `json:"atoms"`
    Decimal string `json:"decimal"`
}
```

All values populated by the server include both fields. When constructing amounts to send to the server (for example in `AddressSend`), you only need to set `Atoms`.
