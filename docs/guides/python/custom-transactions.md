---
title: "Forging Custom Transactions (Advanced)"
description: "Compose arbitrary Mintlayer transactions with the Python SDK's WASM runtime: mixed inputs and outputs, protocol fees, fee estimation, multi-party signing, and intents."
sidebar_position: 8
---

# Forging Custom Transactions (Advanced)

A Mintlayer transaction is just **inputs + outputs + witnesses**. The wallet daemon assembles standard shapes for you; the WASM runtime lets you forge any valid combination yourself. This is the advanced guide; the basic eight-step flow is documented in [Building transactions](../../build/sdks/python/transactions.md). Here we focus on what you can *combine*.

```python
from mintlayer.wasm import Amount, Network, TxAdditionalInfo
from mintlayer.wasm import Client

c = Client()
```

## The shape of a transaction

```python
tx = c.encode_transaction(encoded_inputs, encoded_outputs, 0)  # flags = 0
```

- `encoded_inputs`: a **concatenation** of input blobs. Most inputs are UTXO spends (`encode_input_for_utxo`), but protocol inputs exist too: token operations (`encode_input_for_mint_tokens`, `encode_input_for_unmint_tokens`, `encode_input_for_freeze_token`, ...), delegation withdrawals, and order operations. All concatenate the same way.
- `encoded_outputs`: concatenation of output blobs. Any mix of transfers, burns, issuances, data deposits, HTLCs, order creations, and pool operations.
- `flags`: `0` for standard transactions.

Nothing stops you from mixing output types freely in one transaction.

## Mixed outputs in one transaction

Payments, an on-chain memo, and a time-locked vesting payout, all atomic:

```python
# 1. Plain coin payment
payment = c.encode_output_transfer(
    Amount(atoms="500000000000"), "mtc1qrecipient...", Network.MAINNET
)

# 2. Arbitrary bytes on-chain
memo = c.encode_output_data_deposit(b"order-ref:2026-09-16-042")

# 3. Coins the recipient cannot spend for 1000 blocks
lock = c.encode_lock_for_block_count(1000)
vesting = c.encode_output_lock_then_transfer(
    Amount(atoms="100000000000"), "mtc1qemployee...", lock, Network.MAINNET
)

# 4. Token payment alongside the coins
token_out = c.encode_output_token_transfer(
    Amount(atoms="25"), "mtc1qrecipient...", "ttml1tokenid...", Network.MAINNET
)

all_outputs = payment + memo + vesting + token_out
```

## Mixing UTXO and protocol inputs

Protocol operations are inputs like any other. Minting tokens, for example, consumes a **nonce input** keyed by the token ID, while the network fee still comes from a regular coin UTXO:

```python
token_info = idx.get_token(token_id)  # next_nonce

mint_input = c.encode_input_for_mint_tokens(
    token_id, Amount(atoms="100000"), token_info.next_nonce, Network.MAINNET
)

fee_input = c.encode_input_for_utxo(src_id, 0)  # coin UTXO covering the fee

encoded_inputs = mint_input + fee_input
```

The mint input requires the token's current `next_nonce` from the indexer: every protocol input (freezes, authority changes, delegation withdrawals, order ops) consumes its nonce the same way.

## Protocol fees

Token operations carry minimum protocol fees that must be added to the transaction outputs. Query them at the current height:

```python
tip = idx.get_tip()

issuance_fee = c.fungible_token_issuance_fee(tip.block_height, Network.MAINNET)
mint_fee = c.token_supply_change_fee(tip.block_height, Network.MAINNET)
freeze_fee = c.token_freeze_fee(tip.block_height, Network.MAINNET)
authority_fee = c.token_change_authority_fee(tip.block_height, Network.MAINNET)
```

Add matching coin outputs (typically back to yourself or the new authority) covering the fee amounts.

## Network fee estimation

Size drives the network fee, and size depends on the *signed* transaction. Estimate before finalizing outputs, then deduct the fee from change:

```python
rate = idx.get_fee_rate(1)  # atoms per KB, top 1 MB of mempool

size = c.estimate_transaction_size(encoded_inputs, dest_addresses, all_outputs, Network.MAINNET)

fee = (size + 999) // 1000 * max(int(rate), 1)
```

`dest_addresses` is one owner address per input, in input order; for mixed inputs, that is the UTXO's address, or the relevant delegation/order owner for protocol inputs.

## Predicting IDs

Creation transactions get their IDs from their inputs, deterministically; compute them before broadcasting:

```python
pool_id = c.get_pool_id(encoded_inputs, Network.MAINNET)
token_id = c.get_token_id(encoded_inputs, tip.block_height, Network.MAINNET)
delegation_id = c.get_delegation_id(encoded_inputs, Network.MAINNET)
order_id = c.get_order_id(encoded_inputs, Network.MAINNET)
```

This is how a transaction that creates a delegation can immediately delegate to it, or how you can show a user "your token will be `ttml1...`" before signing.

## Multi-party signing (PSBT-style)

`encode_signed_transaction` expects witnesses for every input. For flows where different parties sign different inputs, build partial signatures and merge:

```python
partially_signed = c.encode_partially_signed_transaction(
    transaction, witness_bytes, input_utxos, input_destinations,
    htlc_secrets,              # empty when unused
    TxAdditionalInfo(),
    Network.MAINNET,
)
```

Exchange the partially signed transaction out-of-band; the final assembler produces the complete signed transaction once every input has a witness.

## Transaction intents

An intent is a **signed declaration of purpose** (what a transaction is meant to do), bound to the transaction ID but independent of its bytes. Signers can verify what they are authorizing before producing a witness:

```python
msg = c.make_transaction_intent_message_to_sign(intent, transaction_id)
sig = c.sign_message_for_spending(private_key, msg)

signed_intent = c.encode_signed_transaction_intent(msg, [sig])

# Verifier side, before signing:
c.verify_transaction_intent(msg, signed_intent, input_destinations, Network.MAINNET)
```

This is the building block for co-signers and policy engines that must approve transactions they can't fully parse.

## Sanity checks before broadcasting

- Every input witness present, in input order (see [Wallet & Signing](wallet-wasm.md#signing-a-transaction)).
- `TxAdditionalInfo` populated for any pool or order input, or signing fails or produces an invalid sighash (see [the reference](../../build/sdks/python/wasm.md#additional-info-for-signing)).
- Protocol fees included as outputs; nonce values fresh from the indexer.
- Dry-run the result: `get_transaction_id` before `submit_transaction`.
