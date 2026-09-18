---
title: "WASM client"
description: "WASM client reference for the Mintlayer Python SDK: keys, addresses, inputs, outputs, signing, fees, intents."
sidebar_position: 6
---

# WASM client

The `mintlayer.wasm` module exposes cryptographic primitives and binary
transaction encoding via an embedded WebAssembly module (instantiated with
wasmtime, sha256-pinned at import).

```python
from mintlayer.wasm import Client

c = Client()  # instantiation compiles the WASM binary: ~400 ms
...
c.close()  # or use `with Client() as c:`
```

Call it once per process and reuse it. The `Client` is **safe for concurrent
use from multiple threads** — every public method serialises access to the
single WASM instance with a lock.

All errors raise `WasmError` with a message prefixed `mintlayer: `:

```python
from mintlayer.wasm import WasmError

try:
    addr = c.pubkey_to_pubkeyhash_address(pubkey, Network.MAINNET)
except WasmError as e:
    print(e)  # e.g. "mintlayer: invalid public key"
```

> **Key material in memory:** result buffers carrying private keys, derived
> keys and signatures are zeroed before being released, but input buffers and
> WASM-side intermediate copies of secrets persist in WASM linear memory until
> the allocator reuses them (inherited from the wasm-bindgen design; the host
> cannot reach them). Treat the process memory of a long-lived `Client` as
> sensitive.

---

## Amounts

```python
from mintlayer.wasm import Amount

one = Amount.from_atoms("100000000000")  # 1 ML
zero = Amount.zero()
print(one.atoms)  # "100000000000"
print(str(one))  # "100000000000"
```

All amounts are decimal strings of atoms. **1 ML = 100,000,000,000 atoms**
(11 decimal places).

---

## Networks and enums

Enums are `enum.IntEnum` subclasses passed to WASM as their integer
discriminant:

```python
from mintlayer.wasm import (
    Network,  # MAINNET=0, TESTNET=1, REGTEST=2, SIGNET=3
    SignatureHashType,  # SIGHASH_ALL=0, SIGHASH_NONE=1, SIGHASH_SINGLE=2, SIGHASH_ANYONECANPAY=3
    SourceId,  # SOURCE_TRANSACTION=0, SOURCE_BLOCK_REWARD=1
    TotalSupply,  # LOCKABLE=0, UNLIMITED=1, FIXED=2
    FreezableToken,  # NO=0, YES=1
    TokenUnfreezable,  # NO=0, YES=1
)
```

Module-level aliases (`MAINNET`, `TESTNET`, `REGTEST`, `SIGNET`,
`SIGHASH_ALL`, …, `SOURCE_TRANSACTION`, `SOURCE_BLOCK_REWARD`) match the Go
constant names; `mintlayer.Mainnet` in Go is `mintlayer.MAINNET` (or
`Network.MAINNET`) in Python.

Pass the appropriate constant to any function that generates addresses or
encodes transactions.

---

## Key derivation

### `make_private_key`

```python
def make_private_key(self) -> bytes: ...
```

Generates a random private key.

### `make_default_account_privkey`

```python
def make_default_account_privkey(self, mnemonic: str, network: Network) -> bytes: ...
```

Derives the default account extended private key from a BIP-39 mnemonic. The
derivation path is `m/44'/coin_type'/0'` where `coin_type` depends on the
network.

### `public_key_from_private_key`

```python
def public_key_from_private_key(self, privkey: bytes) -> bytes: ...
```

Derives the compressed public key from a private key.

### `extended_public_key_from_extended_private_key`

```python
def extended_public_key_from_extended_private_key(self, privkey: bytes) -> bytes: ...
```

Derives the extended public key from an extended private key. Useful for
watch-only wallets.

### `make_receiving_address`

```python
def make_receiving_address(self, account_privkey: bytes, key_index: int) -> bytes: ...
```

Derives the private key for receiving address `key_index` within an account.

### `make_change_address`

```python
def make_change_address(self, account_privkey: bytes, key_index: int) -> bytes: ...
```

Derives the private key for change address `key_index` within an account.

### `make_receiving_address_public_key`

```python
def make_receiving_address_public_key(self, account_pubkey: bytes, key_index: int) -> bytes: ...
```

Derives the public key for receiving address `key_index` from an extended
public key. Does not require the private key.

### `make_change_address_public_key`

```python
def make_change_address_public_key(self, account_pubkey: bytes, key_index: int) -> bytes: ...
```

Derives the public key for change address `key_index` from an extended public
key.

**Example: derive a receiving address from a mnemonic**

```python
mnemonic = "abandon abandon abandon ... about"

account_key = c.make_default_account_privkey(mnemonic, Network.MAINNET)
recv_key = c.make_receiving_address(account_key, 0)
pub_key = c.public_key_from_private_key(recv_key)
addr = c.pubkey_to_pubkeyhash_address(pub_key, Network.MAINNET)
```

---

## Addresses

### `encode_destination`

```python
def encode_destination(self, address: str, network: Network) -> bytes: ...
```

Encodes a bech32m address into its binary representation for use in
transaction outputs.

### `pubkey_to_pubkeyhash_address`

```python
def pubkey_to_pubkeyhash_address(self, pubkey: bytes, network: Network) -> str: ...
```

Derives a P2PKH bech32m address from a compressed public key.

### `encode_multisig_challenge`

```python
def encode_multisig_challenge(
    self, pubkeys: bytes, min_required_signatures: int, network: Network
) -> bytes: ...
```

Encodes a multisig challenge (script) from a concatenation of compressed
public keys.

### `multisig_challenge_to_address`

```python
def multisig_challenge_to_address(self, challenge: bytes, network: Network) -> str: ...
```

Derives a bech32m address from a multisig challenge.

---

## IDs

These functions derive chain-assigned IDs from transaction inputs. The ID is
deterministic: the same inputs always produce the same ID.

### `get_pool_id`

```python
def get_pool_id(self, inputs: bytes, network: Network) -> str: ...
```

Derives the pool ID that will be assigned to a `CreateStakePool` transaction.

### `get_token_id`

```python
def get_token_id(self, inputs: bytes, current_block_height: int, network: Network) -> str: ...
```

Derives the token ID that will be assigned to an `IssueFungibleToken` (or NFT)
transaction. `current_block_height` selects the ID scheme for the active
network upgrade.

### `get_delegation_id`

```python
def get_delegation_id(self, inputs: bytes, network: Network) -> str: ...
```

Derives the delegation ID that will be assigned to a `CreateDelegationId`
transaction.

### `get_order_id`

```python
def get_order_id(self, inputs: bytes, network: Network) -> str: ...
```

Derives the order ID that will be assigned to a `CreateOrder` transaction.

---

## Inputs

Each input is a binary blob. Concatenate all input blobs to form the `inputs`
bytes passed to `encode_transaction`.

### `encode_input_for_utxo`

```python
def encode_input_for_utxo(self, outpoint_source_id: bytes, output_index: int) -> bytes: ...
```

Encodes a UTXO spending input. `outpoint_source_id` is the result of
`encode_outpoint_source_id`.

### `encode_input_for_withdraw_from_delegation`

```python
def encode_input_for_withdraw_from_delegation(
    self, delegation_id: str, amount: Amount, nonce: int, network: Network
) -> bytes: ...
```

Encodes a delegation withdrawal input. `nonce` must match the current
`next_nonce` from the indexer's delegation record.

### `encode_input_for_mint_tokens`

```python
def encode_input_for_mint_tokens(
    self, token_id: str, amount: Amount, nonce: int, network: Network
) -> bytes: ...
```

### `encode_input_for_unmint_tokens`

```python
def encode_input_for_unmint_tokens(self, token_id: str, nonce: int, network: Network) -> bytes: ...
```

### `encode_input_for_lock_token_supply`

```python
def encode_input_for_lock_token_supply(
    self, token_id: str, nonce: int, network: Network
) -> bytes: ...
```

### `encode_input_for_freeze_token`

```python
def encode_input_for_freeze_token(
    self, token_id: str, is_token_unfreezable: TokenUnfreezable, nonce: int, network: Network
) -> bytes: ...
```

### `encode_input_for_unfreeze_token`

```python
def encode_input_for_unfreeze_token(self, token_id: str, nonce: int, network: Network) -> bytes: ...
```

### `encode_input_for_change_token_authority`

```python
def encode_input_for_change_token_authority(
    self, token_id: str, new_authority: str, nonce: int, network: Network
) -> bytes: ...
```

### `encode_input_for_change_token_metadata_uri`

```python
def encode_input_for_change_token_metadata_uri(
    self, token_id: str, new_metadata_uri: str, nonce: int, network: Network
) -> bytes: ...
```

### `encode_input_for_conclude_order`

```python
def encode_input_for_conclude_order(
    self, order_id: str, nonce: int, current_block_height: int, network: Network
) -> bytes: ...
```

### `encode_input_for_fill_order`

```python
def encode_input_for_fill_order(
    self,
    order_id: str,
    fill_amount: Amount,
    destination: str,
    nonce: int,
    current_block_height: int,
    network: Network,
) -> bytes: ...
```

FillOrder inputs are not signed — use `encode_witness_no_signature`.

### `encode_input_for_freeze_order`

```python
def encode_input_for_freeze_order(
    self, order_id: str, current_block_height: int, network: Network
) -> bytes: ...
```

Order freezing is available only after the orders V1 fork.

---

## Outputs

Each output is a binary blob. Concatenate all output blobs to form the
`outputs` bytes passed to `encode_transaction`.

### `encode_output_transfer`

```python
def encode_output_transfer(self, amount: Amount, address: str, network: Network) -> bytes: ...
```

Coin transfer to an address. This is the standard output type for sending ML.

### `encode_output_token_transfer`

```python
def encode_output_token_transfer(
    self, amount: Amount, address: str, token_id: str, network: Network
) -> bytes: ...
```

Fungible token transfer to an address.

### `encode_output_lock_then_transfer`

```python
def encode_output_lock_then_transfer(
    self, amount: Amount, address: str, lock: bytes, network: Network
) -> bytes: ...
```

Coin transfer with a timelock. The coins are sent to `address` but cannot be
spent until the lock expires. `lock` is the result of one of the
`encode_lock_*` functions.

### `encode_output_token_lock_then_transfer`

```python
def encode_output_token_lock_then_transfer(
    self, amount: Amount, address: str, token_id: str, lock: bytes, network: Network
) -> bytes: ...
```

Token transfer with a timelock.

### `encode_output_coin_burn`

```python
def encode_output_coin_burn(self, amount: Amount) -> bytes: ...
```

Permanently destroys ML coins.

### `encode_output_token_burn`

```python
def encode_output_token_burn(self, amount: Amount, token_id: str, network: Network) -> bytes: ...
```

Permanently destroys fungible tokens.

### `encode_output_create_delegation`

```python
def encode_output_create_delegation(
    self, pool_id: str, owner_address: str, network: Network
) -> bytes: ...
```

Creates a delegation for `owner_address` in `pool_id`. Use `get_delegation_id`
to predict the delegation ID before broadcasting.

### `encode_output_delegate_staking`

```python
def encode_output_delegate_staking(
    self, amount: Amount, delegation_id: str, network: Network
) -> bytes: ...
```

Sends coins into an existing delegation.

### `encode_output_create_stake_pool`

```python
def encode_output_create_stake_pool(
    self, pool_id: str, pool_data: bytes, network: Network
) -> bytes: ...
```

Creates a staking pool. `pool_data` is the result of `encode_stake_pool_data`.

### `encode_output_produce_block_from_stake`

```python
def encode_output_produce_block_from_stake(
    self, pool_id: str, staker: str, network: Network
) -> bytes: ...
```

Reward output used in blocks produced by a pool. This UTXO is consumed when
decommissioning a pool (if the pool has staked at least once). Only relevant
for block producers.

### `encode_output_data_deposit`

```python
def encode_output_data_deposit(self, data: bytes) -> bytes: ...
```

Embeds arbitrary bytes on-chain.

### `encode_output_htlc`

```python
def encode_output_htlc(
    self,
    amount: Amount,
    token_id: str | None,
    secret_hash: str,
    spend_address: str,
    refund_address: str,
    refund_timelock: bytes,
    network: Network,
) -> bytes: ...
```

Hashed Time-Lock Contract output. Pass `None` for `token_id` to use coins. The
receiver can spend with the preimage; the sender can refund after the timelock
expires.

### `encode_output_issue_fungible_token`

```python
def encode_output_issue_fungible_token(
    self,
    authority: str,
    token_ticker: str,
    metadata_uri: str,
    number_of_decimals: int,
    total_supply: TotalSupply,
    supply_amount: Amount | None,
    is_token_freezable: FreezableToken,
    current_block_height: int,
    network: Network,
) -> bytes: ...
```

Issues a new fungible token. `supply_amount` is required only when
`total_supply` is `TotalSupply.FIXED` (pass `None` otherwise).

### `encode_output_issue_nft`

```python
def encode_output_issue_nft(
    self,
    token_id: str,
    authority: str,
    name: str,
    ticker: str,
    description: str,
    media_hash: bytes,
    creator: bytes | None,
    media_uri: str | None,
    icon_uri: str | None,
    additional_metadata_uri: str | None,
    current_block_height: int,
    network: Network,
) -> bytes: ...
```

Issues a new NFT. `creator`, `media_uri`, `icon_uri` and
`additional_metadata_uri` may be `None`. The `token_id` is derived with
`get_token_id` (NFTs share the fungible-token ID scheme).

### `encode_create_order_output`

```python
def encode_create_order_output(
    self,
    ask_amount: Amount,
    ask_token_id: str | None,
    give_amount: Amount,
    give_token_id: str | None,
    conclude_address: str,
    network: Network,
) -> bytes: ...
```

Creates a DEX order. Pass `None` for `ask_token_id` or `give_token_id` to use
the native coin.

---

## Timelocks

Timelocks are binary blobs passed to `encode_output_lock_then_transfer` and
`encode_output_token_lock_then_transfer`.

```python
def encode_lock_for_block_count(self, block_count: int) -> bytes: ...
def encode_lock_for_seconds(self, seconds: int) -> bytes: ...
def encode_lock_until_height(self, block_height: int) -> bytes: ...
def encode_lock_until_time(self, timestamp_seconds: int) -> bytes: ...
```

| Function | Unlocks when |
|----------|-------------|
| `encode_lock_for_block_count(n)` | `n` blocks have been confirmed after the output |
| `encode_lock_for_seconds(s)` | `s` seconds have elapsed since the output was confirmed |
| `encode_lock_until_height(h)` | the chain tip reaches height `h` |
| `encode_lock_until_time(t)` | the median block time exceeds Unix timestamp `t` |

---

## Transactions

### `encode_outpoint_source_id`

```python
def encode_outpoint_source_id(self, id_: bytes, source_id: SourceId) -> bytes: ...
```

Encodes an outpoint source. `id_` is the raw transaction or block hash
(hex-decoded); `source_id` is `SourceId.SOURCE_TRANSACTION` or
`SourceId.SOURCE_BLOCK_REWARD`.

### `encode_transaction`

```python
def encode_transaction(self, inputs: bytes, outputs: bytes, flags: int) -> bytes: ...
```

Encodes an unsigned transaction from concatenated input and output blobs.
`flags` should be `0` for standard transactions.

### `get_transaction_id`

```python
def get_transaction_id(self, transaction: bytes, strict_byte_size: bool) -> str: ...
```

Returns the hex transaction ID without broadcasting. Set
`strict_byte_size=True` to require the bytes to represent exactly one
Transaction object.

### `estimate_transaction_size`

```python
def estimate_transaction_size(
    self, inputs: bytes, input_utxos_dests: list[str], outputs: bytes, network: Network
) -> int: ...
```

Estimates the byte size of the transaction after signing.
`input_utxos_dests` must contain one address string per input (the spending
destination of each UTXO), in input order. Use this to compute fees before
constructing the final output set — see [transactions.md](transactions.md).

### `encode_signed_transaction`

```python
def encode_signed_transaction(self, transaction: bytes, signatures: bytes) -> bytes: ...
```

Assembles a fully signed transaction from the unsigned transaction bytes and
the concatenated witness bytes.

### `encode_partially_signed_transaction`

```python
def encode_partially_signed_transaction(
    self,
    transaction: bytes,
    signatures: bytes,
    input_utxos: bytes,
    input_destinations: bytes,
    htlc_secrets: bytes,
    additional_info: TxAdditionalInfo,
    network: Network,
) -> bytes: ...
```

Creates a Partially Signed Transaction (PSBT)-style structure. Use this for
multi-party signing flows.

### `decode_signed_transaction_to_js`

```python
def decode_signed_transaction_to_js(self, transaction: bytes, network: Network) -> bytes: ...
```

Decodes a signed transaction to JSON (raw JSON bytes) for inspection.
`decode_partially_signed_transaction_to_js` does the same for partially signed
transactions.

### `extract_htlc_secret`

```python
def extract_htlc_secret(
    self,
    signed_tx: bytes,
    strict_byte_size: bool,
    htlc_outpoint_source_id: bytes,
    htlc_output_index: int,
) -> bytes: ...
```

Extracts the HTLC preimage from a transaction that spends an HTLC output. Use
this to learn the secret after the counterparty reveals it on-chain.

### `internal_verify_witness`

```python
def internal_verify_witness(
    self,
    sighash_type: int,
    input_owner_dest: str | None,
    witness: bytes,
    transaction: bytes,
    input_utxos: bytes,
    input_index: int,
    additional_info: TxAdditionalInfo,
    block_height: int,
    network: Network,
) -> None: ...
```

Verifies an input witness against the transaction (`input_owner_dest` may be
`None` where the destination is not required). Useful for testing signing
flows.

---

## Signing

### `encode_witness`

```python
def encode_witness(
    self,
    sighash_type: SignatureHashType,
    private_key: bytes,
    input_owner_dest: str,
    transaction: bytes,
    input_utxos: bytes,
    input_index: int,
    additional_info: TxAdditionalInfo,
    block_height: int,
    network: Network,
) -> bytes: ...
```

Signs one input and returns the witness bytes. Call once per input and
concatenate results.

`input_owner_dest` is the bech32m address that owns the UTXO being spent.
`input_utxos` is a concatenation of per-input UTXO entries (see
[transactions.md](transactions.md) for the `0x00`/`0x01` prefix encoding).
`block_height` is the current block height (pass `0` for outputs without
time-lock constraints).

Use `SignatureHashType.SIGHASH_ALL` for standard transactions.

### `encode_witness_no_signature`

```python
def encode_witness_no_signature(self) -> bytes: ...
```

Returns an empty witness. Required for `FillOrder` inputs, which do not need a
signature.

### `encode_witness_htlc_spend`

```python
def encode_witness_htlc_spend(
    self,
    sighash_type: SignatureHashType,
    private_key: bytes,
    input_owner_dest: str,
    transaction: bytes,
    input_utxos: bytes,
    input_index: int,
    secret: bytes,
    additional_info: TxAdditionalInfo,
    block_height: int,
    network: Network,
) -> bytes: ...
```

Signs an HTLC spend input, embedding the preimage.

### `encode_witness_htlc_refund_single_sig`

```python
def encode_witness_htlc_refund_single_sig(
    self,
    sighash_type: SignatureHashType,
    private_key: bytes,
    input_owner_dest: str,
    transaction: bytes,
    input_utxos: bytes,
    input_index: int,
    additional_info: TxAdditionalInfo,
    block_height: int,
    network: Network,
) -> bytes: ...
```

Signs an HTLC refund for a single-signature refund address.

### `encode_witness_htlc_refund_multisig`

```python
def encode_witness_htlc_refund_multisig(
    self,
    sighash_type: SignatureHashType,
    private_key: bytes,
    key_index: int,
    input_witness: bytes,
    multisig_challenge: bytes,
    transaction: bytes,
    input_utxos: bytes,
    input_index: int,
    additional_info: TxAdditionalInfo,
    block_height: int,
    network: Network,
) -> bytes: ...
```

Adds a partial signature to an HTLC refund witness for a multisig refund
address. `key_index` is the index of `private_key` within the multisig
challenge; `input_witness` may be empty (first signer) or a previous partial
result.

### `sign_challenge`

```python
def sign_challenge(self, private_key: bytes, message: bytes) -> bytes: ...
```

Signs an arbitrary message for use in challenge-response authentication.

### `verify_challenge`

```python
def verify_challenge(
    self, address: str, network: Network, signed_challenge: bytes, message: bytes
) -> bool: ...
```

Verifies a challenge signature against a bech32m (pubkeyhash) address.

### `sign_message_for_spending`

```python
def sign_message_for_spending(self, private_key: bytes, message: bytes) -> bytes: ...
```

Signs a spending message (used in transaction intents).

### `verify_signature_for_spending`

```python
def verify_signature_for_spending(
    self, public_key: bytes, signature: bytes, message: bytes
) -> bool: ...
```

Verifies a spending message signature against a public key.

---

## Additional info for signing

Some transaction types (pool operations, orders) require extra data not
present in the UTXO itself:

```python
from mintlayer.wasm import (
    Amount,
    OrderBalance,
    OrderInfo,
    PoolInfo,
    SimpleCurrencyAmount,
    TxAdditionalInfo,
)

info = TxAdditionalInfo(
    pool_info={"mpool1...": PoolInfo(staker_balance=Amount.from_atoms("40000000000000"))},
    order_info={
        "mordr1...": OrderInfo(
            initially_asked=SimpleCurrencyAmount.coins("500000000000"),
            initially_given=SimpleCurrencyAmount.tokens("1000", "ttml1..."),
            ask_balance=OrderBalance(atoms="500000000000"),
            give_balance=OrderBalance(atoms="800", token_id="ttml1..."),
        )
    },
)
```

- Maps are keyed by the bech32m pool/order ID. Pass an empty `TxAdditionalInfo()`
  for standard coin transfers.
- `SimpleCurrencyAmount` serialises as the externally tagged
  `CurrencyAmount` enum — `{"coins":{"atoms":...}}` or
  `{"tokens":{"amount":{"atoms":...},"token_id":...}}` — built with the
  `.coins(atoms)` / `.tokens(atoms, token_id)` constructors.
- `OrderBalance` uses the redundant-but-required wire shape
  `{"atoms":...,"amount":{"atoms":...},"token_id":null|"..."}`.
- The WASM module rejects `null` maps, so the `TxAdditionalInfo` defaults are
  empty dicts rather than `None`.

---

## Staking

### `encode_stake_pool_data`

```python
def encode_stake_pool_data(
    self,
    value: Amount,
    staker: str,
    vrf_public_key: str,
    decommission_key: str,
    margin_ratio_per_thousand: int,
    cost_per_block: Amount,
    network: Network,
) -> bytes: ...
```

Encodes the pool parameters for use in `encode_output_create_stake_pool`.
`staker` is the bech32m address allowed to produce blocks; `vrf_public_key` is
the bech32m VRF public key; `decommission_key` is the address that can
decommission the pool; `margin_ratio_per_thousand` is the staker's cut per
thousand (e.g. `100` = 10%); `cost_per_block` is a flat amount deducted from
rewards before the margin split.

### `effective_pool_balance`

```python
def effective_pool_balance(
    self, network: Network, pledge_amount: Amount, pool_balance: Amount
) -> Amount: ...
```

Computes the effective balance used in the slot lottery, which applies
diminishing returns to large pools.

### `staking_pool_spend_maturity_block_count`

```python
def staking_pool_spend_maturity_block_count(
    self, current_block_height: int, network: Network
) -> int: ...
```

Returns the number of blocks a pool output must mature before it can be spent
(after decommission).

---

## Fees

These functions return the minimum protocol fee for various operations at a
given block height:

```python
def fungible_token_issuance_fee(self, current_block_height: int, network: Network) -> Amount: ...
def nft_issuance_fee(self, current_block_height: int, network: Network) -> Amount: ...
def data_deposit_fee(self, current_block_height: int, network: Network) -> Amount: ...
def token_supply_change_fee(self, current_block_height: int, network: Network) -> Amount: ...
def token_freeze_fee(self, current_block_height: int, network: Network) -> Amount: ...
def token_change_authority_fee(self, current_block_height: int, network: Network) -> Amount: ...
```

Add these fees to the transaction outputs when building the relevant
transaction types manually — see [tokens.md](tokens.md).

---

## Transaction intents

Transaction intents provide a signed declaration of what a transaction is
intended to do, independent of the transaction bytes themselves.

### `make_transaction_intent_message_to_sign`

```python
def make_transaction_intent_message_to_sign(self, intent: str, transaction_id: str) -> bytes: ...
```

Creates the message bytes that should be signed to bind an intent string to a
transaction ID (`transaction_id` is the hex ID from `get_transaction_id`).

### `encode_signed_transaction_intent`

```python
def encode_signed_transaction_intent(
    self, signed_message: bytes, signatures: list[bytes]
) -> bytes: ...
```

Encodes a signed intent along with its signatures (one raw signature per
transaction input, each produced by `sign_challenge`).

### `verify_transaction_intent`

```python
def verify_transaction_intent(
    self,
    expected_signed_message: bytes,
    encoded_signed_intent: bytes,
    input_destinations: list[str],
    network: Network,
) -> None: ...
```

Verifies that a signed intent matches the expected message and that the
signatures are valid for the given input destinations (one bech32m address per
transaction input).

---

## Related

- [transactions.md](transactions.md) — end-to-end manual transaction flow
- [staking.md](staking.md) — staking via wallet daemon and manual encoding
- [tokens.md](tokens.md) — token lifecycle via wallet daemon and manual encoding
- [wallet.md](wallet.md) — the wallet daemon client (does the encoding for you)
