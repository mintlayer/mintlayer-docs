---
title: "Wallet client"
description: "Wallet client reference for the Mintlayer Python SDK: lifecycle, accounts, balances, transactions, staking, tokens, orders."
sidebar_position: 5
---

# Wallet client

The `mintlayer.wallet` module is a JSON-RPC 2.0 client for the Mintlayer wallet
daemon (`wallet-rpc-daemon`). The daemon manages key storage, address
derivation, signing, and broadcasting.

```python
from mintlayer.wallet import Client

c = Client(
    "http://127.0.0.1:3034",
    username="user",  # optional; Basic Auth applied only when set
    password="pass",  # optional
    timeout=30.0,  # optional, seconds (default 30.0)
    session=None,  # optional requests.Session (client owns it otherwise)
)
```

**Default ports:** 3034 (mainnet), 13034 (testnet).

Errors returned by the daemon raise `RPCError`; transport/decode failures raise
`JSONRPCError`:

```python
from mintlayer.wallet import RPCError, JSONRPCError

try:
    balance = c.get_balance(0)
except RPCError as e:
    print(e.code, e.message)
except JSONRPCError as e:
    ...
```

The client is safe for concurrent use from multiple threads and supports the
context-manager protocol (`with Client(...) as c: ...`).

> **Security:** the daemon has no transport encryption. If it listens beyond
> localhost, put it behind an HTTPS reverse proxy or an SSH tunnel; only talk
> to `https://…` endpoints (or plain `http://127.0.0.1`/localhost) — never to a
> bare `http://` host over a network. Mnemonic and passphrase values are
> **redacted from `repr()`**: `CreateWalletParams`, `RecoverWalletParams` and
> the returned `MnemonicResult` print `<redacted>` instead of the secret, so
> logging a params object never leaks the seed phrase.

---

## Wallet lifecycle

Typical flow: **create or recover → open → sync → use**.

```python
from mintlayer.wallet import Client, CreateWalletParams

c = Client("http://127.0.0.1:3034")

# 1. Create a wallet file (a fresh 24-word BIP-39 phrase is generated
#    when params.mnemonic is None).
result = c.create_wallet(
    CreateWalletParams(
        path="/path/to/wallet.dat",
        store_seed_phrase=False,  # don't persist the phrase to disk
    )
)
if result.mnemonic:
    print(result.mnemonic.content.mnemonic)  # store it securely NOW

# 2. (next session) Open the wallet. Empty password → sent as JSON null.
c.open_wallet("/path/to/wallet.dat", password="")

# 3. Sync to the chain tip.
c.sync_wallet()

# 4. ... accounts, addresses, sends ...

c.close_wallet()
```

### `create_wallet`

```python
def create_wallet(self, params: CreateWalletParams) -> CreateWalletResult: ...
```

Creates a new wallet file. If `mnemonic` is `None`, the daemon generates a
fresh 24-word BIP-39 phrase.

```python
@dataclass(frozen=True)
class CreateWalletParams:
    path: str
    store_seed_phrase: bool
    mnemonic: str | None = None
    passphrase: str | None = None
    hardware_wallet: str | None = None


@dataclass(frozen=True)
class CreateWalletResult:
    mnemonic: MnemonicResult | None = None
```

When `store_seed_phrase` is `False`, the mnemonic is returned in
`CreateWalletResult.mnemonic` and not persisted to disk. Store it securely.
Optional pointer fields are always sent, serialising as JSON `null` when unset
(wire-fidelity with the Go structs).

### `recover_wallet`

```python
def recover_wallet(self, params: RecoverWalletParams) -> None: ...
```

Recreates a wallet from an existing mnemonic (`RecoverWalletParams` has the
same fields as `CreateWalletParams` but `mnemonic` is required). The daemon
will rescan the chain to recover the balance.

### `open_wallet`

```python
def open_wallet(self, path: str, password: str = "") -> None: ...
```

Opens an existing wallet file. An empty `password` is sent as JSON `null`
(unencrypted wallets).

### `close_wallet`

```python
def close_wallet(self) -> None: ...
```

Closes the currently open wallet.

### `get_wallet_info`

```python
def get_wallet_info(self) -> WalletInfo: ...
```

Returns wallet metadata (`wallet_id`, `account_names`, `extra_info` — a
`WalletExtraInfo` carrying the software/hardware wallet type in its `type`
field).

### `sync_wallet`

```python
def sync_wallet(self) -> None: ...
```

Syncs the wallet to the current chain tip.

### `rescan_wallet`

```python
def rescan_wallet(self) -> None: ...
```

Rescans the entire chain from genesis. Use this after importing a wallet or
when balances appear incorrect.

### `best_block`

```python
def best_block(self) -> BestBlock: ...
```

Returns the block (`height`, `id`) the wallet is currently synced to.

---

## Accounts

### `create_account`

```python
def create_account(self, name: str) -> AccountInfo: ...
```

Creates a new BIP-44 account within the wallet. Returns the account index
(`AccountInfo(account, name)`).

### `rename_account`

```python
def rename_account(self, account: int, name: str = "") -> None: ...
```

Renames an existing account. An empty `name` is sent as JSON `null`, which
removes the name.

---

## Balances and addresses

### `get_balance`

```python
def get_balance(self, account: int) -> Balance: ...
```

Returns the confirmed coin and token balances for an account (the request pins
`utxo_states` to `["Confirmed"]`).

```python
@dataclass(frozen=True)
class Balance:
    coins: Amount
    tokens: dict[str, Amount]  # keyed by token ID
```

### `new_address`

```python
def new_address(self, account: int) -> str: ...
```

Derives a fresh receiving address and marks it as used.

### `show_receive_addresses`

```python
def show_receive_addresses(self, account: int) -> list[AddressWithUsage]: ...
```

Lists all receiving addresses that have been derived for an account, with
their usage status and coin balance
(`AddressWithUsage(address, used, coins)`). Change addresses are excluded.

### `reveal_public_key`

```python
def reveal_public_key(self, account: int, address: str) -> str: ...
```

Returns the hex-encoded public key for an address controlled by the wallet.

---

## Key encryption

### `encrypt_private_keys`

```python
def encrypt_private_keys(self, password: str) -> None: ...
```

Encrypts the wallet's private keys with a password.

### `unlock_private_keys`

```python
def unlock_private_keys(self, password: str) -> None: ...
```

Unlocks an encrypted wallet for signing. The keys remain unlocked until
`lock_private_keys` is called or the daemon restarts.

### `lock_private_keys`

```python
def lock_private_keys(self) -> None: ...
```

Locks the private keys without closing the wallet.

---

## Transactions

### `address_send`

```python
def address_send(self, params: SendParams) -> SendResult: ...
```

Sends coins to an address. The wallet selects UTXOs, computes fees, and
broadcasts.

```python
@dataclass(frozen=True)
class SendParams:
    account: int
    address: str
    amount: Amount
    selected_utxos: list[Outpoint] | None = None
    options: TxOptions = field(default_factory=TxOptions)


@dataclass(frozen=True)
class SendResult:
    tx_id: str
    fees: FeesBreakdown
    broadcasted: bool
```

**Wire rules** (all params dataclasses serialise via `to_json()`):

- `Amount(atoms="...", decimal="...")` omits empty fields; at least one must be
  set when sending.
- `selected_utxos` is `omitempty`: `None` **or an empty list** is omitted from
  the wire.
- `options` always serialises both keys (`null` when unset).
- Optional `str | None` fields (e.g. `htlc_secret`, `output_address`) always
  serialise, as JSON `null` when unset.

```python
from mintlayer.wallet import Amount, SendParams, TxOptions

result = c.address_send(
    SendParams(
        account=0,
        address="mtc1q...",
        amount=Amount(atoms="100000000000"),  # 1 ML
        options=TxOptions(in_top_x_mb=1),  # high fee priority
    )
)
print(result.tx_id, result.fees.coins.atoms, result.broadcasted)
```

Set `options.broadcast_to_mempool=False` to build and sign without
broadcasting; the transaction is still returned via the wallet history.

### `token_send`

```python
def token_send(self, params: TokenSendParams) -> SendResult: ...
```

Sends tokens from the account to an address
(`TokenSendParams(account, token_id, address, amount, options)`).

### `sweep_spendable`

```python
def sweep_spendable(self, params: SweepParams) -> SendResult: ...
```

Sweeps all spendable funds to a destination. Set `all=True` to sweep the
entire account; set `from_addresses` to sweep specific addresses only
(`SweepParams(account, destination_address, from_addresses, all, options)`).

### `spend_utxo`

```python
def spend_utxo(self, params: UTXOSpendParams) -> SendResult: ...
```

Spends a specific UTXO, optionally providing an HTLC secret
(`UTXOSpendParams(account, utxo: Outpoint, output_address, htlc_secret,
options)`).

### `compose_transaction`

```python
def compose_transaction(self, params: ComposeParams) -> ComposedTx: ...
```

Composes an unsigned transaction from explicit inputs and outputs. Returns a
hex-encoded `PartiallySignedTransaction` (`ComposedTx(hex, fees)`). Use this
for advanced flows where you construct outputs manually.

```python
@dataclass(frozen=True)
class ComposeParams:
    inputs: list[Outpoint] = field(default_factory=list)
    outputs: list[Any] = field(default_factory=list)  # raw output objects
    htlc_secrets: Any = None
    only_transaction: bool = False
```

### `sign_raw_transaction`

```python
def sign_raw_transaction(self, account: int, raw_tx: str) -> SignedTx: ...
```

Signs a hex-encoded transaction using keys from the given account
(`SignedTx(hex, current_signatures)`). Used in cold-wallet flows where
composition and signing happen separately.

```python
composed = c.compose_transaction(ComposeParams(...))
signed = c.sign_raw_transaction(0, composed.hex)
submit = c.submit_transaction(signed.hex)
```

### `inspect_transaction`

```python
def inspect_transaction(self, tx_hex: str) -> TxInspection: ...
```

Inspects a hex-encoded transaction without broadcasting. Returns input count,
signature count, and fees (`TxInspection(stats: TxStats, fees:
FeesBreakdown | None)`).

### `submit_transaction`

```python
def submit_transaction(self, tx_hex: str, do_not_store: bool = False) -> SubmitResult: ...
```

Broadcasts a signed transaction. Set `do_not_store=True` to broadcast without
saving the transaction in the wallet history.

Quirk: the daemon route hardcodes the trust policy to `"Trusted"` — the client
always sends `{"trust_policy": "Trusted"}`.

### `list_transactions_by_address`

```python
def list_transactions_by_address(
    self, account: int, address: str | None, limit: int
) -> list[WalletTx]: ...
```

Lists confirmed transactions for an account. Pass `address=None` to list
across all addresses (sent as JSON `null`). The most recent transactions are
returned first (`WalletTx(id, height, timestamp)`).

### `list_pending_transactions`

```python
def list_pending_transactions(self, account: int) -> list[str]: ...
```

Lists transaction IDs that are in the mempool but not yet confirmed.

### `get_transaction`

```python
def get_transaction(self, account: int, tx_id: str) -> Any: ...
```

Returns a transaction as raw decoded JSON.

### `abandon_transaction`

```python
def abandon_transaction(self, account: int, tx_id: str) -> None: ...
```

Removes an unconfirmed transaction from the wallet. The transaction will no
longer be rebroadcast. The UTXOs it spent are returned to the available
balance.

### `deposit_data`

```python
def deposit_data(self, account: int, data_hex: str) -> SendResult: ...
```

Embeds arbitrary hex-encoded data in a transaction output (`DataDeposit`
output type).

---

## Transaction options

Most transaction methods embed a `TxOptions` in their params:

```python
@dataclass(frozen=True)
class TxOptions:
    in_top_x_mb: int | None = None
    broadcast_to_mempool: bool | None = None
```

`in_top_x_mb` controls fee priority. Setting it to `1` targets the top 1 MB of
the mempool (highest priority). The default (`None`) lets the daemon choose.

Setting `broadcast_to_mempool=False` builds and signs the transaction without
broadcasting it. The transaction hex is still returned in the result.

Unlike the optional params fields, `TxOptions` **always** serialises both keys
on the wire (`null` when unset) — this matches the Go struct exactly.

---

## Staking

See [staking.md](staking.md) for a complete guide. Quick reference:

| Method | Description |
|--------|-------------|
| `create_stake_pool` | Create and fund a new staking pool |
| `decommission_stake_pool` | Wind down a pool and recover the pledge |
| `list_owned_pools` | List pools owned by an account |
| `get_pool_balance` | Get pool balance |
| `start_staking` | Start block production |
| `stop_staking` | Stop block production |
| `get_staking_status` | Check whether staking is active |
| `create_delegation` | Create a delegation to a pool |
| `delegate_staking` | Send coins into a delegation |
| `withdraw_from_delegation` | Withdraw from a delegation |
| `list_delegations` | List delegations owned by an account |

---

## Tokens and NFTs

See [tokens.md](tokens.md) for a complete guide. Quick reference:

| Method | Description |
|--------|-------------|
| `issue_token` | Issue a new fungible token |
| `issue_nft` | Issue a new NFT |
| `mint_tokens` | Mint additional supply |
| `unmint_tokens` | Remove supply (return to unminted state) |
| `lock_token_supply` | Permanently lock supply |
| `freeze_token` | Freeze all transfers |
| `unfreeze_token` | Unfreeze (if allowed) |
| `change_token_authority` | Transfer the authority key |
| `send_token` | Send tokens to an address (alias of `token_send`) |

---

## DEX orders

### `create_order`

```python
def create_order(self, params: CreateOrderParams) -> OrderCreated: ...
```

Creates a new DEX order (`OrderCreated(order_id, tx_id, broadcasted)`).

```python
@dataclass(frozen=True)
class CreateOrderParams:
    account: int
    ask: OutputValue
    give: OutputValue
    conclude_address: str
    options: TxOptions = field(default_factory=TxOptions)
```

The two sides of the order use `OutputValue`, which has a fully custom wire
encoding. Construct with the helper constructors:

```python
from mintlayer.wallet import CreateOrderParams, OutputValue, coin_filter, token_filter

params = CreateOrderParams(
    account=0,
    ask=OutputValue.coins(atoms="500000000000"),  # asking 5 ML
    give=OutputValue.tokens("ttml1...", atoms="1000"),  # giving 1000 tokens
    conclude_address="mtc1q...",
)
created = c.create_order(params)
```

### `conclude_order`

```python
def conclude_order(self, params: ConcludeOrderParams) -> SendResult: ...
```

Concludes an order owned by the account
(`ConcludeOrderParams(account, order_id, output_address=None, options)`).

### `fill_order`

```python
def fill_order(self, params: FillOrderParams) -> SendResult: ...
```

Fills (partially or fully) an existing order
(`FillOrderParams(account, order_id, fill_amount_in_ask_currency,
output_address=None, options)`).

### `freeze_order`

```python
def freeze_order(self, params: FreezeOrderParams) -> SendResult: ...
```

Freezes an order (orders V1 fork only)
(`FreezeOrderParams(account, order_id, options)`).

### `list_own_orders`

```python
def list_own_orders(self, account: int) -> list[OwnOrder]: ...
```

Lists the account's own orders (`OwnOrder(order_id, initially_asked,
initially_given, existing_order_data, is_marked_as_frozen_in_wallet,
is_marked_as_concluded_in_wallet)`).

### `list_all_active_orders`

```python
def list_all_active_orders(self, params: ListOrdersParams) -> list[ActiveOrder]: ...
```

Lists all active orders, optionally filtered by currency pair — `None` filters
match any (`ActiveOrder(order_id, initially_asked, initially_given,
ask_balance, give_balance, is_own)`).

```python
from mintlayer.wallet import ListOrdersParams, coin_filter, token_filter

# module-level helpers (same as CurrencyFilter.coin_filter() / .token_filter(id))
orders = c.list_all_active_orders(
    ListOrdersParams(
        account=0,
        ask_currency=coin_filter(),
        give_currency=token_filter("ttml1..."),
    )
)
```

`CurrencyFilter` (wire: `{"type":"Coin"}` with no content key, or
`{"type":"Token","content":"<id>"}`) and `OutputValue` raise `ValueError`
before any HTTP request is sent when constructed invalidly (missing token id /
missing amount).

---

## Related

- [transactions.md](transactions.md) — manual transaction building (no daemon)
- [staking.md](staking.md) — staking pools and delegations
- [tokens.md](tokens.md) — token and NFT lifecycle
- [node.md](node.md) — node daemon client
