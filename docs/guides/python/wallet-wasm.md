---
title: "Wallet & Signing (WASM)"
description: "Generate a Mintlayer wallet and sign transactions and messages with the Python SDK's embedded WASM runtime: no wallet daemon, full custody."
sidebar_position: 7
---

# Wallet & Signing (WASM)

The Python SDK embeds the same WASM cryptography runtime that the wallets use ([wasmtime](https://wasmtime.dev/), bundled with the package). With it you can generate and restore wallets, derive addresses, and sign transactions entirely in your own process: there is no wallet daemon holding your keys.

This guide covers the wallet side; building arbitrary transactions is covered in [Forging custom transactions](custom-transactions.md) and the [Building transactions](../../build/sdks/python/transactions.md) reference.

```python
from mintlayer.wasm import Client

c = WasmClient()
```

Instantiation takes ~400 ms; create the client once per process and call `c.close()` when done.

## Generating a wallet

A Mintlayer wallet is a **BIP-39 mnemonic** plus the derivation hierarchy the runtime implements (`44'/coin_type'/0'` for the default account, then `/0/i` for receiving and `/1/i` for change keys). Generate the 12/24 words with any standard BIP-39 library, then hand them to the runtime:

```python
mnemonic = "legal winner thank year wave sausage worth useful legal winner thank yellow"

# Default account extended private key
account_key = c.make_default_account_privkey(mnemonic, Network.MAINNET)

# First receiving address
recv_key = c.make_receiving_address(account_key, 0)
pub_key = c.public_key_from_private_key(recv_key)
addr = c.pubkey_to_pubkeyhash_address(pub_key, Network.MAINNET)
print(addr)  # mmt1q... / mtc1q... depending on network
```

Derive more addresses by iterating the key index; change addresses derive identically via `make_change_address(account_key, i)`.

:::danger

The mnemonic is the wallet. Anyone with the words holds every derived key. Generate it in a secure environment, never log it, and persist it (encrypted) before using the derived keys for anything valuable.

:::

### Single-key wallets

For ephemeral or single-purpose keys (faucet hot keys, tests), skip the mnemonic entirely:

```python
priv_key = c.make_private_key()  # random key
pub_key = c.public_key_from_private_key(priv_key)
addr = c.pubkey_to_pubkeyhash_address(pub_key, Network.TESTNET)
```

### Watch-only wallets

From an extended private key you can export the extended public key and derive **addresses without any private key**, useful for monitoring services:

```python
account_xpub = c.extended_public_key_from_extended_private_key(account_key)

# First receiving address, public derivation only
recv_pub = c.make_receiving_address_public_key(account_xpub, 0)
```

## Signing a transaction

Signing follows the eight-step flow documented in [Building transactions](../../build/sdks/python/transactions.md): encode inputs and outputs, build the unsigned transaction, produce witness bytes per input with `encode_witness`, and assemble with `encode_signed_transaction`. Condensed:

```python
transaction = c.encode_transaction(encoded_inputs, encoded_outputs, 0)

witness_bytes = b""
for i in range(len(utxos)):
    witness_bytes += c.encode_witness(
        SIGHASH_ALL,
        spend_key,       # private key from derivation above
        from_addr,       # address owning the UTXO
        transaction,
        input_utxos,     # per-input UTXO entries (see the reference)
        i,
        TxAdditionalInfo(),
        0,               # block height, 0 when no timelock constraint
        Network.MAINNET,
    )

signed_tx = c.encode_signed_transaction(transaction, witness_bytes)
```

Inspect the result without broadcasting: `c.get_transaction_id(signed_tx, True)`. Broadcast via the indexer (`submit_transaction`) or the node (`p2p_submit_transaction`).

Special inputs use dedicated witnesses: `encode_witness_no_signature` (fill-order inputs need no signature), `encode_witness_htlc_spend` and `encode_witness_htlc_refund_single_sig` (HTLC inputs).

## Signing messages

Prove control of an address with a challenge-response exchange:

```python
# Signer side
signature = c.sign_challenge(spend_key, b"login-nonce-1234")

# Verifier side
ok = c.verify_challenge(addr, Network.MAINNET, signature, b"login-nonce-1234")
```

`verify_challenge` checks the signature against the bech32m address. For spending-authorization messages (transaction intents), use `sign_message_for_spending` / `verify_signature_for_spending` instead; see [Transaction intents](custom-transactions.md#transaction-intents).

## Cheat sheet

| Task | Call |
| ---- | ---- |
| Wallet from mnemonic | `make_default_account_privkey` |
| Receiving / change key | `make_receiving_address` / `make_change_address` |
| Address from key | `public_key_from_private_key` → `pubkey_to_pubkeyhash_address` |
| Random key | `make_private_key` |
| Watch-only derivation | `extended_public_key_from_extended_private_key` + `make_receiving_address_public_key` |
| Sign one input | `encode_witness` |
| Assemble signed tx | `encode_signed_transaction` |
| Sign a message | `sign_challenge` / `verify_challenge` |
