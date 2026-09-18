---
title: "Node client"
description: "Node client reference for the Mintlayer Python SDK: chainstate, mempool, P2P, block submission, and trust policy."
sidebar_position: 3
---

# Node client

The `mintlayer.node` module is a JSON-RPC 2.0 client for the Mintlayer node
daemon. Every method is synchronous and thread-safe.

```python
from mintlayer.node import Client

c = Client(
    "http://127.0.0.1:3030",
    username="user",  # optional; Basic Auth applied only when set
    password="pass",  # optional
    timeout=10.0,  # optional, seconds (default 30.0)
    session=None,  # optional requests.Session (client owns it otherwise)
)
```

**Default ports:** 3030 (mainnet), 13030 (testnet).

> **Transport security:** Basic Auth credentials travel in cleartext over
> plain `http://`. Bind the daemon to localhost or front it with an HTTPS
> reverse proxy / SSH tunnel when connecting over a network.


There is no per-call cancellation: configure `timeout` on the client (Go's
per-call `context` has no direct `requests` equivalent). Errors from the daemon
raise `RPCError`; transport and decode failures raise `JSONRPCError`:

```python
from mintlayer.node import RPCError, JSONRPCError

try:
    height = c.best_block_height()
except RPCError as e:
    print(e.code, e.message)
except JSONRPCError as e:
    ...  # HTTP failure or malformed response body
```

The HTTP status code is never inspected — a JSON-RPC `error` object in the body
is the error contract. JSON `null` results map to `None` for every
"not-found"-style method (`block_id_at_height`, `stake_pool_balance`, …).

---

## Chain state

### `chainstate_info`

```python
def chainstate_info(self) -> ChainstateInfo: ...
```

Returns a summary of the current chain state.

```python
@dataclass(frozen=True)
class ChainstateInfo:
    best_block_height: int
    best_block_id: str
    best_block_timestamp: Timestamp  # Timestamp(timestamp: int), Unix seconds
    median_time: Timestamp
    is_initial_block_download: bool
```

### `best_block_id`

```python
def best_block_id(self) -> str: ...
```

Returns the hex block ID of the current tip.

### `best_block_height`

```python
def best_block_height(self) -> int: ...
```

Returns the height of the current tip.

### `block_id_at_height`

```python
def block_id_at_height(self, height: int) -> str | None: ...
```

Returns the block ID at a given height, or `None` if no block exists at that
height.

### `block_height_in_main_chain`

```python
def block_height_in_main_chain(self, block_id: str) -> int | None: ...
```

Returns the mainchain height for a block ID, or `None` if the block is not on
the main chain.

### `get_block`

```python
def get_block(self, block_id: str) -> str | None: ...
```

Returns the hex-encoded raw block (`None` if unknown; the genesis block is not
retrievable).

### `get_block_json`

```python
def get_block_json(self, block_id: str) -> Any: ...
```

Returns the block as decoded JSON. Useful for inspection without custom
deserialization.

### `get_mainchain_blocks`

```python
def get_mainchain_blocks(self, from_height: int, max_count: int) -> list[str]: ...
```

Returns up to `max_count` mainchain block IDs starting at `from_height`.

### `get_utxo`

```python
def get_utxo(self, outpoint: Outpoint) -> Any: ...
```

Returns the output at a given outpoint as decoded JSON (`None` if
spent/unknown).

```python
@dataclass(frozen=True)
class Outpoint:
    source_id: OutpointSourceID
    index: int


@dataclass
class OutpointSourceID:
    type: str  # "Transaction" or "BlockReward"
    content: Any  # {"tx_id": "<hex>"} or {"block_id": "<hex>"}
```

Build the `content` payloads with the helpers:

```python
from mintlayer.node import Outpoint, OutpointSourceID, tx_source_content, block_source_content

op = Outpoint(
    source_id=OutpointSourceID(type="Transaction", content=tx_source_content(tx_id)),
    index=0,
)
utxo = c.get_utxo(op)
```

### `submit_block`

```python
def submit_block(self, block_hex: str) -> None: ...
```

Submits a hex-encoded block. Used by block producers.

---

## Pool and delegation queries

### `stake_pool_balance`

```python
def stake_pool_balance(self, pool_address: str) -> Amount | None: ...
```

Returns the total balance of a pool (staker pledge plus all delegations).
Returns `None` if the pool is not found.

### `staker_balance`

```python
def staker_balance(self, pool_address: str) -> Amount | None: ...
```

Returns the staker's own balance, excluding delegations. Returns `None` if the
pool is not found.

### `pool_decommission_destination`

```python
def pool_decommission_destination(self, pool_address: str) -> str | None: ...
```

Returns the address that receives funds when the pool is decommissioned.

### `delegation_share`

```python
def delegation_share(self, pool_address: str, delegation_address: str) -> Amount | None: ...
```

Returns the amount owned by a specific delegation in a pool.

---

## Token and order info

Amounts are decimal atom strings — **1 ML = 100,000,000,000 atoms** (11
decimal places). `Amount` is a frozen dataclass with a single `atoms: str`
field.

### `token_info`

```python
def token_info(self, token_id: str) -> TokenInfo | None: ...
```

Returns on-chain token metadata (`None` if unknown).

```python
@dataclass
class TokenInfo:
    type: str  # "FungibleToken" or "NonFungibleToken"
    content: Any  # raw decoded JSON
```

### `tokens_info`

```python
def tokens_info(self, token_ids: list[str]) -> list[TokenInfo]: ...
```

Batch version of `token_info`. More efficient than calling `token_info` in a
loop.

### `order_info`

```python
def order_info(self, order_id: str) -> OrderInfo | None: ...
```

Returns the current state of an order.

```python
@dataclass
class OrderInfo:
    conclude_key: str
    initially_asked: Any
    initially_given: Any
    ask_balance: Amount
    give_balance: Amount
    nonce: int | None  # None for active orders (daemon sends null)
    is_frozen: bool
```

Quirk: `nonce` is `None` for active orders — the daemon sends JSON `null` for
the field. This fixes a known Go SDK incompatibility, where the `null` broke
`uint64` decoding.

### `orders_info_by_currencies`

```python
def orders_info_by_currencies(
    self, ask: Currency | None, give: Currency | None
) -> dict[str, OrderInfo]: ...
```

Returns all orders matching the given currency pair, as a dict from order ID to
`OrderInfo`. Pass `None` for either currency to match any (both keys are always
sent; `None` serialises as JSON `null`).

```python
@dataclass(frozen=True)
class Currency:
    type: str  # "Coin" or "Token"
    content: str | None  # bech32 token ID when type is "Token"
```

Construct with the helpers:

```python
from mintlayer.node import Currency

orders = c.orders_info_by_currencies(Currency.coin(), Currency.token("ttml1..."))
any_coin = c.orders_info_by_currencies(None, Currency.coin())
```

---

## Mempool

### `contains_tx`

```python
def contains_tx(self, tx_id: str) -> bool: ...
```

Returns `True` if the mempool contains the transaction.

### `contains_orphan_tx`

```python
def contains_orphan_tx(self, tx_id: str) -> bool: ...
```

Returns `True` if the orphan pool contains the transaction.

### `get_transaction`

```python
def get_transaction(self, tx_id: str) -> MempoolTx | None: ...
```

Returns a mempool transaction (`None` if not present).

```python
@dataclass(frozen=True)
class MempoolTx:
    id: str
    status: str
    transaction: str
```

### `mempool_submit_transaction`

```python
def mempool_submit_transaction(self, tx_hex: str, trust_policy: TrustPolicy | str) -> None: ...
```

Submits a transaction to the local mempool only, without broadcasting to peers.
Use `TrustPolicy.UNTRUSTED` for transactions you constructed yourself; use
`TrustPolicy.TRUSTED` to skip some fee checks. A plain string is accepted too:

```python
from mintlayer.node import TrustPolicy

c.mempool_submit_transaction(signed_hex, TrustPolicy.UNTRUSTED)
```

```python
class TrustPolicy(str, enum.Enum):
    TRUSTED = "Trusted"
    UNTRUSTED = "Untrusted"
```

### `get_fee_rate`

```python
def get_fee_rate(self, in_top_x_mb: int) -> FeeRate | None: ...
```

Returns the fee rate needed to land in the top `in_top_x_mb` megabytes of the
mempool.

```python
@dataclass(frozen=True)
class FeeRate:
    amount_per_kb: Amount  # atoms per kilobyte
```

### `get_fee_rate_points`

```python
def get_fee_rate_points(self) -> list[FeeRatePoint]: ...
```

Returns the mempool fee-rate curve as a list of (size, rate) pairs.

Wire quirk: the daemon sends each point as a two-element array
`[size, {"amount_per_kb": {...}}]`, decoded into:

```python
@dataclass(frozen=True)
class FeeRatePoint:
    size: int
    rate: FeeRate
```

### `memory_usage`

```python
def memory_usage(self) -> int: ...
```

Returns the current mempool memory usage in bytes.

---

## P2P

### `get_peer_count`

```python
def get_peer_count(self) -> int: ...
```

Returns the number of currently connected peers.

### `get_connected_peers`

```python
def get_connected_peers(self) -> list[PeerInfo]: ...
```

Returns details about all connected peers.

```python
@dataclass(frozen=True)
class PeerInfo:
    peer_id: int
    address: str
    peer_role: str
    ban_score: int
    user_agent: str
    software_version: str
    ping_wait: int | None = None
    ping_last: int | None = None
    ping_min: int | None = None
    last_tip_block_time: int | None = None
```

### `get_bind_addresses`

```python
def get_bind_addresses(self) -> list[str]: ...
```

Returns the addresses the node is listening on for P2P connections.

### `add_reserved_node`

```python
def add_reserved_node(self, addr: str) -> None: ...
```

Adds a persistent peer that the node always attempts to reconnect to.

### `remove_reserved_node`

```python
def remove_reserved_node(self, addr: str) -> None: ...
```

Removes a persistent peer.

### `connect`

```python
def connect(self, addr: str) -> None: ...
```

Makes a one-time connection attempt to a peer address.

### `disconnect`

```python
def disconnect(self, peer_id: int) -> None: ...
```

Closes the connection to a peer by ID.

### `list_banned`

```python
def list_banned(self) -> list[BannedPeer]: ...
```

Returns the list of banned peers.

Wire quirk: each entry is a two-element array
`["<address>", {"time": [secs, nanos]}]`, decoded into:

```python
@dataclass(frozen=True)
class BannedPeer:
    address: str
    ban_time: tuple[int, int]  # (seconds, nanoseconds)
```

### `ban`

```python
def ban(self, address: str, duration: timedelta) -> None: ...
```

Bans a peer for the specified duration. Durations are `datetime.timedelta`
values, split into the daemon's `[seconds, nanoseconds]` wire form:

```python
from datetime import timedelta

c.ban("192.0.2.1", timedelta(hours=24))
```

### `unban`

```python
def unban(self, address: str) -> None: ...
```

Removes a peer from the ban list.

### `p2p_submit_transaction`

```python
def p2p_submit_transaction(self, tx_hex: str, trust_policy: TrustPolicy | str) -> None: ...
```

Submits a transaction to the mempool and broadcasts it to peers. This is the
normal path for publishing a transaction to the network (the alternative — the
indexer's `submit_transaction` — requires `--enable-post-routes`, see
[indexer.md](indexer.md)).

---

## Node management

### `node_version`

```python
def node_version(self) -> str: ...
```

Returns the node software version string.

### `node_shutdown`

```python
def node_shutdown(self) -> None: ...
```

Initiates a graceful node shutdown.

---

## Related

- [indexer.md](indexer.md) — read-only chain queries and `submit_transaction`
- [transactions.md](transactions.md) — building and signing transactions
- [wallet.md](wallet.md) — the wallet daemon client
