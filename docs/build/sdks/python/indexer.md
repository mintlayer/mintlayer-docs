---
title: "Indexer client"
description: "Indexer client reference for the Mintlayer Python SDK: chain, blocks, transactions, addresses, pools, tokens, orders, statistics."
sidebar_position: 4
---

# Indexer client

The `mintlayer.indexer` module is a REST client for the Mintlayer indexer
(`api-web-server`). All paths are relative to the `/api/v2` base appended to
the configured URL.

```python
from mintlayer.indexer import Client

c = Client(
    "http://127.0.0.1:3000",
    timeout=15.0,  # optional, seconds (default 30.0)
    session=None,  # optional requests.Session (client owns it otherwise)
)
```

**Default port:** 3000 (mainnet), 13000 (testnet).

Non-2xx HTTP responses raise `HTTPError`; transport/decode failures raise
`IndexerError`:

```python
from mintlayer.indexer import HTTPError, IndexerError

try:
    info = c.get_address_info("mtc1q...")
except HTTPError as e:
    print(e.status_code, e.body)  # e.g. 404 "address not found"
except IndexerError as e:
    ...  # connection failure or malformed JSON body
```

The client is safe for concurrent use from multiple threads and supports the
context-manager protocol (`with Client(...) as c: ...`).

---

## Pagination

List endpoints accept a `PageOpts` dataclass:

```python
@dataclass(frozen=True)
class PageOpts:
    offset: int = 0  # default: 0
    items: int = 0  # default: 10 (server-side default)
```

**Zero-omission rule:** zero values are omitted from the query string entirely,
so the server defaults apply. Only positive values are sent:

```python
from mintlayer.indexer import PageOpts

c.list_transactions(PageOpts(offset=20, items=50))
c.list_orders()  # server defaults
```

---

## Chain

### `get_tip`

```python
def get_tip(self) -> ChainTip: ...
```

Returns the highest confirmed block.

```python
@dataclass(frozen=True)
class ChainTip:
    block_height: int
    block_id: str
```

### `get_genesis`

```python
def get_genesis(self) -> GenesisInfo: ...
```

Returns genesis block information (`block_id`, `genesis_message`,
`timestamp`, `utxos`).

### `get_block_id_at_height`

```python
def get_block_id_at_height(self, height: int) -> str | None: ...
```

Returns the block ID at a given height, or `None` if the indexer responds
with JSON null. Raises a 404 `HTTPError` if no block exists at that height
(for example, when querying a height beyond the current tip).

---

## Blocks

### `get_block`

```python
def get_block(self, block_id: str) -> Block: ...
```

Returns the full block: `height`, `header` (`BlockHeader`) and `body`
(`BlockBody` with `reward` and `transactions`).

### `get_block_header`

```python
def get_block_header(self, block_id: str) -> BlockHeader: ...
```

Returns only the block header (`previous_block_id`, `timestamp`, `merkle_root`,
`witness_merkle_root`, `consensus_data`). Cheaper than `get_block` when you do
not need transaction data.

### `get_block_reward`

```python
def get_block_reward(self, block_id: str) -> list: ...
```

Returns the reward outputs of a block as raw decoded JSON values.

### `get_block_transaction_ids`

```python
def get_block_transaction_ids(self, block_id: str) -> list[str]: ...
```

Returns the transaction IDs included in a block. Use this to page through block
contents without fetching full transaction data.

---

## Transactions

### `list_transactions`

```python
def list_transactions(self, opts: PageOpts | None = None) -> list[Transaction]: ...
```

Returns a paginated list of confirmed transactions across the entire chain.

### `get_transaction`

```python
def get_transaction(self, tx_id: str) -> Transaction: ...
```

Returns a transaction by ID. The `block_id`, `timestamp`, and `confirmations`
fields are empty strings for unconfirmed transactions.

```python
@dataclass(frozen=True)
class Transaction:
    id: str
    inputs: Any  # raw decoded JSON
    outputs: Any  # raw decoded JSON
    block_id: str
    timestamp: str
    confirmations: str
```

### `get_transaction_merkle_path`

```python
def get_transaction_merkle_path(self, tx_id: str) -> MerklePath: ...
```

Returns the Merkle inclusion proof for a transaction (`block_id`,
`transaction_index`, `merkle_root`, `path`). Raises a 404 `HTTPError` if the
transaction is not yet in a block.

### `get_transaction_output`

```python
def get_transaction_output(self, tx_id: str, output_index: int) -> Any: ...
```

Returns a single output from a transaction as raw decoded JSON. The shape is
determined by the `"type"` field. Common types: `"Transfer"`,
`"LockThenTransfer"`, `"Burn"`, `"CreateStakePool"`, `"CreateDelegationId"`,
`"DelegateStaking"`, `"IssueFungibleToken"`, `"IssueNft"`, `"DataDeposit"`,
`"Htlc"`, `"CreateOrder"`.

### `submit_transaction`

```python
def submit_transaction(self, signed_tx_hex: str) -> str: ...
```

Submits a hex-encoded signed transaction to the network. Returns the
transaction ID on success. The hex string is POSTed verbatim as
`text/plain` — the one non-GET route in the client.

**Requires** the indexer to be started with `--enable-post-routes`.

---

## Addresses

### `get_address_info`

```python
def get_address_info(self, address: str) -> AddressInfo: ...
```

Returns balance and transaction history for a bech32m address. Raises a 404
`HTTPError` if the address has no on-chain history.

```python
@dataclass(frozen=True)
class AddressInfo:
    coin_balance: Amount
    locked_coin_balance: Amount
    transaction_history: list[str]
    tokens: list[TokenBalance]  # TokenBalance(token_id, amount)
```

### `get_spendable_utxos`

```python
def get_spendable_utxos(self, address: str) -> list[UTXO]: ...
```

Returns confirmed, unspent UTXOs that can be spent immediately.

### `get_all_utxos`

```python
def get_all_utxos(self, address: str) -> list[UTXO]: ...
```

Returns all UTXOs including those that are locked or otherwise unspendable.

```python
@dataclass(frozen=True)
class UTXO:
    outpoint: UTXOOutpoint  # UTXOOutpoint(source_id: str, index: int)
    output: Any  # raw JSON; note the payload key on the wire is "utxo"
```

### `get_delegations`

```python
def get_delegations(self, address: str) -> list[DelegationInfo]: ...
```

Returns all staking delegations owned by an address.

```python
@dataclass(frozen=True)
class DelegationInfo:
    delegation_id: str
    pool_id: str
    next_nonce: int
    spend_destination: str
    balance: Amount
```

### `get_token_authority`

```python
def get_token_authority(self, address: str) -> list[str]: ...
```

Returns the IDs (bech32m) of fungible tokens for which the address holds
authority (can mint, freeze, etc.).

---

## Pools and delegations

### `list_pools`

```python
def list_pools(self, opts: PoolListOpts | None = None) -> list[Pool]: ...
```

Returns staking pools with optional pagination. The `sort` field accepts:

- `"by_height"` (server default): newest pools first
- `"by_pledge"`: largest staker balance first

```python
@dataclass(frozen=True)
class PoolListOpts:
    offset: int = 0
    items: int = 0
    sort: str = ""  # omitted from the query when empty (zero-omission rule)
```

```python
c.list_pools(PoolListOpts(sort="by_pledge", items=20))
```

### `get_pool`

```python
def get_pool(self, pool_id: str) -> Pool: ...
```

Returns a single staking pool by its bech32m pool ID.

```python
@dataclass(frozen=True)
class Pool:
    pool_id: str
    decommission_destination: str
    staker_balance: Amount
    margin_ratio_per_thousand: float
    cost_per_block: Amount
    vrf_public_key: str
    delegations_balance: Amount
```

### `get_pool_block_stats`

```python
def get_pool_block_stats(self, pool_id: str, from_time: datetime, to_time: datetime) -> int: ...
```

Returns the number of blocks produced by a pool in the half-open interval
`[from_time, to_time)`. Datetimes are converted to Unix-seconds query
parameters.

```python
from datetime import datetime, timedelta

count = c.get_pool_block_stats(
    "mpool1...",
    datetime.now() - timedelta(hours=24),
    datetime.now(),
)
```

### `get_delegation`

```python
def get_delegation(self, delegation_id: str) -> Delegation: ...
```

Returns a single delegation by its bech32m delegation ID.

```python
@dataclass(frozen=True)
class Delegation:
    delegation_id: str
    pool_id: str
    next_nonce: int
    spend_destination: str
    balance: Amount
    creation_block_height: int
```

### `get_pool_delegations`

```python
def get_pool_delegations(self, pool_id: str) -> list[PoolDelegation]: ...
```

Returns all delegations in a pool. Each entry includes the
`creation_block_height` in addition to the standard delegation fields (but no
`pool_id`, since it is implied by the query).

---

## Tokens and NFTs

### `list_tokens`

```python
def list_tokens(self, opts: PageOpts | None = None) -> list[str]: ...
```

Returns a paginated list of fungible token IDs (bech32m).

### `get_token`

```python
def get_token(self, token_id: str) -> TokenInfo: ...
```

Returns full information about a fungible token.

```python
@dataclass(frozen=True)
class TokenInfo:
    authority: str
    is_locked: bool
    circulating_supply: Amount
    token_ticker: str
    metadata_uri: str
    number_of_decimals: int
    total_supply: Any  # raw JSON
    frozen: bool
    is_token_unfreezable: bool | None  # non-None only when frozen
    is_token_freezable: bool | None  # non-None only when not frozen
    next_nonce: int
```

### `get_token_transactions`

```python
def get_token_transactions(self, token_id: str, opts: PageOpts | None = None) -> list[TokenTx]: ...
```

Returns the transaction history for a token (issuance, mints, transfers,
burns) as `TokenTx(tx_global_index, tx_id)` entries.

### `find_tokens_by_ticker`

```python
def find_tokens_by_ticker(self, ticker: str, opts: PageOpts | None = None) -> list[str]: ...
```

Returns token IDs whose ticker matches the given string. Tickers are not
unique, so this may return multiple results.

### `get_nft`

```python
def get_nft(self, token_id: str) -> NFTInfo: ...
```

Returns information about an NFT: `owner`, `token_id`, and `metadata`
(`NFTMetadata` with `creator`, `name`, `description`, `ticker`, `icon_uri`,
`additional_metadata_uri`, `media_uri`, `media_hash` — the URI/creator fields
are `None` when unset).

---

## Orders

### `list_orders`

```python
def list_orders(self, opts: PageOpts | None = None) -> list[Order]: ...
```

Returns active orders.

### `get_order`

```python
def get_order(self, order_id: str) -> Order: ...
```

Returns a single order by its bech32m order ID.

```python
@dataclass(frozen=True)
class Order:
    order_id: str
    conclude_destination: str
    give_currency: Any  # raw JSON, "type" of "Coin" or "Token"
    initially_given: Amount
    give_balance: Amount
    ask_currency: Any  # raw JSON, "type" of "Coin" or "Token"
    initially_asked: Amount
    ask_balance: Amount
    nonce: int
```

### `list_orders_by_pair`

```python
def list_orders_by_pair(
    self, ask_currency: str, give_currency: str, opts: PageOpts | None = None
) -> list[Order]: ...
```

Returns orders filtered by a trading pair. Pass `"ML"` (the coin ticker) or a
bech32m token ID for each currency; the request path is
`/order/pair/{ask}_{give}`.

---

## Statistics

### `get_coin_statistics`

```python
def get_coin_statistics(self) -> CoinStats: ...
```

Returns supply statistics for the native ML coin.

```python
@dataclass(frozen=True)
class CoinStats:
    circulating_supply: Amount
    preminted: Amount
    burned: Amount
    staked: Amount
```

### `get_token_statistics`

```python
def get_token_statistics(self, token_id: str) -> CoinStats: ...
```

Returns the same statistics for a fungible token.

### `get_fee_rate`

```python
def get_fee_rate(self, in_top_x_mb: int = 0) -> str: ...
```

Returns the current fee rate in atoms per kilobyte (a decimal string) needed to
place a transaction in the top `in_top_x_mb` megabytes of the mempool priority
queue.

**Default-parameter quirk:** when `in_top_x_mb` is `0` (the default) the query
parameter is omitted entirely and the server default (5 MB) applies.

```python
rate = int(c.get_fee_rate(1))  # atoms per KB, top 1 MB of the mempool
```

---

## Lenient numeric parsing

The indexer documents several fields as integers but the server sometimes
serialises them as strings — and `margin_ratio_per_thousand` even arrives as a
string with a trailing `%` (e.g. `"10.0%"`). The client parses these
transparently (`mintlayer.indexer.number`):

- `parse_uint64` — accepts a bare JSON number or a decimal string
  (`block_height`, `next_nonce`, `number_of_decimals`, …), returns `int`.
- `parse_per_thousand` — accepts a bare number, a decimal string, or a string
  with a trailing `%`; returns `float` (used for `Pool.margin_ratio_per_thousand`).

Malformed values raise `IndexerError`; malformed payloads in `from_json` are
wrapped as `IndexerError` too rather than leaking `KeyError`/`TypeError`.

---

## Amounts

The `Amount` type carries both raw atoms and a human-readable decimal:

```python
@dataclass(frozen=True)
class Amount:
    atoms: str
    decimal: str
```

All values populated by the server include both fields. When constructing
amounts to send to the server, you only need to set `atoms`
(`Amount(atoms="100000000000")`).

---

## Related

- [node.md](node.md) — node daemon JSON-RPC client
- [transactions.md](transactions.md) — building and signing transactions to submit here
- [staking.md](staking.md) — pools and delegations
- [tokens.md](tokens.md) — token and NFT lifecycle
