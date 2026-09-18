---
title: "Building transactions"
description: "Step-by-step transaction building with the Mintlayer Rust SDK: UTXOs, fees, signing, and submission without the wallet daemon."
sidebar_position: 7
---

# Building transactions manually

The wallet daemon handles transaction building automatically for most use
cases. Use the `crypto` module directly when you need full custody (no
wallet daemon), custom output types, or tooling and integration testing.
The [examples/send-coins.rs](https://github.com/mintlayer/rust-sdk/tree/main/examples/send-coins.rs) program
demonstrates this flow end to end.

The flow: derive keys, fetch UTXOs, build inputs, build outputs (including
change), build the unsigned transaction, sign each input, assemble, submit.
All amounts are `u128` atom counts; **1 ML = 100,000,000,000 atoms**.

## Step 1: Key derivation

```rust
use mintlayer_sdk::crypto::{self, Network};

let network = Network::Testnet;
let mnemonic = "word1 word2 ... word12";

let account = crypto::make_default_account_privkey(mnemonic, network, None)?;
let spend = crypto::make_receiving_address(&account, 0)?; // key index 0
let pubkey = crypto::public_key_from_private_key(&spend);
let from_address = crypto::pubkey_to_pubkeyhash_address(&pubkey, network);
```

## Step 2: Fetch spendable UTXOs

```rust
use mintlayer_sdk::indexer::Client as IndexerClient;

let indexer = IndexerClient::new("http://127.0.0.1:3000");
let utxos = indexer.spendable_utxos(&from_address).await?;
if utxos.is_empty() {
    return Err("no spendable UTXOs".into());
}
```

## Step 3: Build the inputs

Hex-decode each source id, wrap it in an `H256`, build one `TxInput` per UTXO:

```rust
use mintlayer_sdk::crypto::{self, SourceId};
use mintlayer_sdk::crypto::types::{H256, TxInput};

let mut inputs: Vec<TxInput> = Vec::new();
for utxo in &utxos {
    let bytes = hex::decode(&utxo.outpoint.source_id)?; // 32 bytes
    let hash = H256::from_slice(&bytes);
    let source = crypto::encode_outpoint_source_id(hash, SourceId::Transaction);
    inputs.push(crypto::encode_input_for_utxo(source, utxo.outpoint.index));
}
```

## Step 4: Build the outputs

Mintlayer has no explicit fee field: **the fee is implicitly
`sum(inputs) - sum(outputs)`** and goes to the block producer. Emitting
less than the swept total silently overpays; a zero-fee transaction is
rejected by the mempool. Production code therefore adds a change output
sized from a size estimate and a fee rate:

```rust
use mintlayer_sdk::crypto::{self, Amount, Network};

let to_address = "mtc1q...";
let amount: u128 = 100_000_000_000; // 1 ML to the recipient
let total: u128 = todo!();          // sum of the swept input atoms

// Candidate outputs, used only for the size estimate.
let candidate = vec![
    crypto::encode_output_transfer(Amount::from_atoms(amount), to_address, network)?,
    crypto::encode_output_transfer(Amount::from_atoms(total - amount), &from_address, network)?,
];
let size = crypto::estimate_transaction_size(
    &inputs,
    &vec![from_address.as_str(); inputs.len()], // one destination per input
    &candidate,
    network,
)?;
let rate: u128 = indexer.fee_rate(1).await?.parse()?; // atoms per KB
let fee = u128::from(size).div_ceil(1000) * rate.max(1);
let change = total.checked_sub(amount + fee)
    .ok_or("amount + fee exceeds the swept total")?;

let mut outputs = vec![
    crypto::encode_output_transfer(Amount::from_atoms(amount), to_address, network)?,
];
if change > 0 {
    outputs.push(
        crypto::encode_output_transfer(Amount::from_atoms(change), &from_address, network)?,
    );
}
```

`estimate_transaction_size` needs the spending address of each input, in
input order; script-hash and multisig destinations are not supported.
Prefer a `make_change_address`-derived address for the change output.

## Steps 5-7: Build, sign, assemble

Call `encode_witness` once per input. The sighash needs the output being
spent, so build a parallel `input_utxos` slice with one entry per input:
`Some(output)` for UTXO inputs, `None` otherwise. `TxAdditionalInfo::new()`
is correct for standard transfers; `current_block_height` should be the
predicted inclusion height (tip + 1) because the sighash is fork-sensitive.

```rust
use mintlayer_sdk::crypto::types::Encode;
use mintlayer_sdk::crypto::{SigHashType, TxAdditionalInfo};
use mintlayer_sdk::crypto::types::{OutputValue, TxOutput};

let inclusion_height = indexer.tip().await?.block_height + 1;
let transaction = crypto::encode_transaction(inputs.clone(), outputs, 0)?;
println!("unsigned tx id: {}", crypto::transaction_id(&transaction));

// one entry per input, Some(re-encoded spent output)
let destination = crypto::encode_destination(&from_address, network)?;
let mut input_utxos: Vec<Option<TxOutput>> = Vec::new();
for utxo in &utxos {
    let atoms = transfer_coin_atoms(&utxo.output).ok_or("unexpected output shape")?;
    input_utxos.push(Some(TxOutput::Transfer(
        OutputValue::Coin(Amount::from_atoms(atoms)),
        destination.clone(),
    )));
}

let mut witnesses = Vec::new();
for (index, _) in inputs.iter().enumerate() {
    witnesses.push(crypto::encode_witness(
        SigHashType::all(),
        &spend,
        &from_address,
        &transaction,
        &input_utxos,
        index,
        &TxAdditionalInfo::new(),
        inclusion_height,
        network,
    )?);
}

let signed = crypto::encode_signed_transaction(transaction, witnesses)?;
let signed_hex = hex::encode(signed.encode());
```

Fill-order inputs must not be signed: use `encode_witness_no_signature()`
for them (see [Tokens and NFTs](tokens.md)).

## Step 8: Submit

```rust
// Via the indexer (requires --enable-post-routes):
let tx_id = indexer.submit_transaction(&signed_hex).await?;
// Or broadcast via the node daemon:
use mintlayer_sdk::node::{Client as NodeClient, TrustPolicy};
let node = NodeClient::new("http://127.0.0.1:3030");
node.broadcast_transaction(&signed_hex, TrustPolicy::Untrusted).await?;
```

## Complete example

```rust
use mintlayer_sdk::crypto::types::*;
use mintlayer_sdk::crypto::{self, Amount, Network, SigHashType, SourceId, TxAdditionalInfo};
use mintlayer_sdk::indexer::Client as IndexerClient;
use std::str::FromStr;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let network = Network::Testnet;
    let mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

    let account = crypto::make_default_account_privkey(mnemonic, network, None)?;
    let spend = crypto::make_receiving_address(&account, 0)?;
    let pubkey = crypto::public_key_from_private_key(&spend);
    let from = crypto::pubkey_to_pubkeyhash_address(&pubkey, network);

    let indexer = IndexerClient::new("http://127.0.0.1:3000");
    let inclusion_height = indexer.tip().await?.block_height + 1;
    let utxos = indexer.spendable_utxos(&from).await?;
    if utxos.is_empty() {
        return Err("no spendable UTXOs".into());
    }

    let mut inputs = Vec::new();
    let mut input_utxos: Vec<Option<TxOutput>> = Vec::new();
    let mut total = 0u128;
    let destination = crypto::encode_destination(&from, network)?;
    for utxo in &utxos {
        let atoms = transfer_coin_atoms(&utxo.output).ok_or("unexpected output")?;
        let bytes = hex::decode(&utxo.outpoint.source_id)?;
        let source = crypto::encode_outpoint_source_id(H256::from_slice(&bytes), SourceId::Transaction);
        inputs.push(crypto::encode_input_for_utxo(source, utxo.outpoint.index));
        input_utxos.push(Some(TxOutput::Transfer(
            OutputValue::Coin(Amount::from_atoms(atoms)),
            destination.clone(),
        )));
        total += atoms;
    }

    let amount = u128::from_str("100000000000")?; // 1 ML
    let fee = 1_000_000u128; // from estimate_transaction_size + fee_rate; keep a margin
    let change = total.checked_sub(amount + fee).ok_or("balance too low")?;
    let to = "mtc1qrecipient...";
    let mut outputs = vec![crypto::encode_output_transfer(Amount::from_atoms(amount), to, network)?];
    if change > 0 {
        outputs.push(crypto::encode_output_transfer(Amount::from_atoms(change), &from, network)?);
    }

    let transaction = crypto::encode_transaction(inputs.clone(), outputs, 0)?;
    let mut witnesses = Vec::new();
    for (index, _) in inputs.iter().enumerate() {
        witnesses.push(crypto::encode_witness(
            SigHashType::all(),
            &spend,
            &from,
            &transaction,
            &input_utxos,
            index,
            &TxAdditionalInfo::new(),
            inclusion_height,
            network,
        )?);
    }
    let signed = crypto::encode_signed_transaction(transaction, witnesses)?;
    let signed_hex = hex::encode(signed.encode());

    let tx_id = indexer.submit_transaction(&signed_hex).await?;
    println!("submitted {tx_id}");
    Ok(())
}

fn transfer_coin_atoms(output: &serde_json::Value) -> Option<u128> {
    if output.get("type")?.as_str()? != "Transfer" {
        return None;
    }
    let value = output.get("value")?;
    if value.get("type")?.as_str()? != "Coin" {
        return None;
    }
    value.get("amount")?.get("atoms")?.as_str()?.parse().ok()
}
```

Read the mnemonic from an environment variable or prompt, not a command
line; it never leaves the process. Token transfers use the same flow with
`crypto::encode_output_token_transfer` (see [Tokens and NFTs](tokens.md)); the
transaction must still cover the network fee in coins.
