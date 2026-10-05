---
title: "Building transactions"
description: "Step-by-step transaction building with the Mintlayer Python SDK: UTXOs, fees, signing, and submission without the wallet daemon."
sidebar_position: 7
---

# Building transactions manually

The wallet daemon handles transaction building automatically for most use
cases. Use the `mintlayer.wasm` module directly when you need:

- Full custody (no wallet daemon)
- Custom output types or complex spending conditions
- Integration testing or tooling

The [examples/send_coins.py](https://github.com/mintlayer/python-sdk/tree/main/examples/send_coins.py) program demonstrates
this flow end to end.

---

## Overview

Building a transaction manually requires these steps:

1. Derive the spending key and address from a mnemonic
2. Fetch spendable UTXOs from the indexer
3. Encode each input as binary
4. Encode each output as binary
5. Build the unsigned transaction
6. Sign each input to produce witness bytes
7. Assemble the signed transaction
8. Submit to the network

---

## Step 1: Key derivation

```python
from mintlayer.wasm import Client, Network

c = Client()
try:
    mnemonic = "word1 word2 ... word12"

    account_key = c.make_default_account_privkey(mnemonic, Network.MAINNET)

    # key index 0 = first receiving address
    spend_key = c.make_receiving_address(account_key, 0)
    pub_key = c.public_key_from_private_key(spend_key)
    from_addr = c.pubkey_to_pubkeyhash_address(pub_key, Network.MAINNET)
finally:
    c.close()
```

---

## Step 2: Fetch spendable UTXOs

```python
from mintlayer.indexer import Client as IndexerClient

idx = IndexerClient("http://127.0.0.1:3000")

utxos = idx.get_spendable_utxos(from_addr)
if not utxos:
    raise RuntimeError("no spendable UTXOs")
```

Each `UTXO` carries `outpoint` (`source_id` hex string + `index`) and `output`
(raw JSON).

---

## Step 3: Encode inputs

Each input requires:

1. Hex-decode the source transaction ID
2. Encode the outpoint source ID (`encode_outpoint_source_id`)
3. Encode the input (`encode_input_for_utxo`)

**Concatenation semantics:** inputs (and outputs, and witnesses) are plain
binary blobs — the concatenation of every per-item encoding **is** the
transaction field. There is no count prefix or separator; just append with
`+=`.

```python
from mintlayer.wasm import SOURCE_TRANSACTION

encoded_inputs = b""
for u in utxos:
    tx_id_bytes = bytes.fromhex(u.outpoint.source_id)

    src_id = c.encode_outpoint_source_id(tx_id_bytes, SOURCE_TRANSACTION)
    inp = c.encode_input_for_utxo(src_id, u.outpoint.index)
    encoded_inputs += inp
```

---

## Step 4: Encode outputs

```python
from mintlayer.wasm import Amount

output = c.encode_output_transfer(
    Amount(atoms="100000000000"),  # 1 ML in atoms
    "mtc1qrecipient...",
    Network.MAINNET,
)
```

For multiple outputs, concatenate them:

```python
change_output = c.encode_output_transfer(
    Amount(atoms=str(change_atoms)),
    from_addr,  # send change back to sender
    Network.MAINNET,
)

all_outputs = output + change_output
```

---

## Step 5: Build the unsigned transaction

```python
tx = c.encode_transaction(encoded_inputs, output, 0)  # flags = 0

tx_id = c.get_transaction_id(tx, True)
print(f"unsigned tx id: {tx_id}")
```

---

## Step 6: Prepare UTXO bytes for signing

The sighash computation requires access to the UTXO being spent. Build a
per-input blob where each entry is prefixed with either:

- `0x01` followed by the re-encoded output bytes (recommended for coin
  transfers)
- `0x00` alone (acceptable for some output types)

```python
def encode_utxo_entry(c: Client, utxo_json: dict, network: Network) -> bytes:
    try:
        if utxo_json.get("type") == "Transfer":
            value = utxo_json["value"]
            if value.get("type") == "Coin":
                encoded = c.encode_output_transfer(
                    Amount(atoms=value["amount"]["atoms"]),
                    value["destination"],
                    network,
                )
                return b"\x01" + encoded
    except (KeyError, TypeError, ValueError):
        pass
    return b"\x00"


all_utxo_bytes = b""
for u in utxos:
    all_utxo_bytes += encode_utxo_entry(c, u.output, Network.MAINNET)
```

The order of these entries must match the input order exactly — witness `i` is
validated against entry `i`.

---

## Step 7: Sign each input

Call `encode_witness` once per input. Concatenate results.

```python
from mintlayer.wasm import SignatureHashType, TxAdditionalInfo

witness_bytes = b""
for i in range(len(utxos)):
    w = c.encode_witness(
        SignatureHashType.SIGHASH_ALL,
        spend_key,
        from_addr,
        tx,
        all_utxo_bytes,
        i,  # input index
        TxAdditionalInfo(),  # empty for standard transfers
        0,  # block height (0 when no timelock constraint)
        Network.MAINNET,
    )
    witness_bytes += w
```

---

## Step 8: Assemble and submit

```python
signed_tx = c.encode_signed_transaction(tx, witness_bytes)
signed_hex = signed_tx.hex()

# Submit via the indexer (requires --enable-post-routes)
submitted_tx_id = idx.submit_transaction(signed_hex)
print(f"submitted: {submitted_tx_id}")

# Alternative: broadcast via the node daemon
# node_client.p2p_submit_transaction(signed_hex, TrustPolicy.UNTRUSTED)
```

See [indexer.md](indexer.md) for the submit route requirements and
[node.md](node.md) for the P2P alternative.

---

## Fee estimation

Compute the fee before constructing outputs so you can deduct it from the
change:

```python
# Collect destination addresses (one per input, in input order)
dest_addresses = [from_addr] * len(utxos)

estimated_size = c.estimate_transaction_size(
    encoded_inputs, dest_addresses, all_outputs, Network.MAINNET
)

# get_fee_rate returns atoms per KB for the top 1 MB of the mempool
fee_rate = int(idx.get_fee_rate(1))

fee = estimated_size * fee_rate // 1000

# Subtract fee from the amount going to the recipient or from the change output.
```

---

## Lock-then-transfer outputs

To send coins that cannot be spent for a period of time:

```python
# Unlock after 1000 blocks
lock = c.encode_lock_for_block_count(1000)

output = c.encode_output_lock_then_transfer(
    Amount(atoms="100000000000"),
    "mtc1qrecipient...",
    lock,
    Network.MAINNET,
)
```

---

## Token transfers

Sending fungible tokens uses the same flow, with a different output encoder:

```python
token_output = c.encode_output_token_transfer(
    Amount(atoms="1000"),  # token amount in smallest units
    "mtc1qrecipient...",
    "ttml1tokenid...",
    Network.MAINNET,
)
```

Note that a token transfer transaction must also include a coin output (or
coin inputs) to cover the network fee.

---

## Related

- [wasm.md](wasm.md) — full WASM client reference
- [staking.md](staking.md) — manual delegation/pool transactions
- [tokens.md](tokens.md) — manual token issuance/minting
- [wallet.md](wallet.md) — let the wallet daemon do all of this for you
