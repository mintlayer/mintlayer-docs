---
title: "Tokens and NFTs"
description: "Tokens reference for the Mintlayer Rust SDK: fungible token and NFT lifecycle, orders, and manual encoders."
sidebar_position: 8
---

# Tokens and NFTs

Mintlayer supports on-chain fungible tokens and NFTs. The wallet daemon
manages the full lifecycle; the `crypto` module provides low-level
encoders for manual flows; the indexer exposes read-only state. All
amounts are atom counts in the token's smallest unit.

## Fungible tokens

### Supply policies

| `TokenTotalSupply` | Meaning |
|--------------------|---------|
| `TokenTotalSupply::Fixed(Amount)` | Capped at the given amount at issuance |
| `TokenTotalSupply::Lockable` | Unlimited minting until `LockTokenSupply`, then permanently fixed |
| `TokenTotalSupply::Unlimited` | Minting always allowed, limited only by the `u128` amount type |

### Issuing via the wallet daemon

```rust
use mintlayer_sdk::wallet::{self, IssueTokenParams, TokenMetadata, TokenSupply, TxOptions};

let c = wallet::Client::new("http://127.0.0.1:3034");
let authority = c.new_address(0).await?;

let issue = c.issue_token(IssueTokenParams {
    account: 0,
    destination_address: authority.clone(), // becomes the token authority
    metadata: TokenMetadata {
        token_ticker: "MYTOKEN".into(),
        number_of_decimals: 2,
        metadata_uri: "https://example.com/token".into(),
        token_supply: TokenSupply::Lockable,
        is_freezable: false,
    },
    options: TxOptions::default(),
}).await?;
println!("token id: {} (tx {})", issue.token_id, issue.tx_id);
```

The destination address becomes the **authority**: the key that controls
all later token operations. Keep it secure.

### Minting, unminting and supply locking

```rust
use mintlayer_sdk::wallet::{Amount, MintParams, TxOptions, UnmintParams};

// Wait for the issuance transaction to confirm before minting.
c.mint_tokens(MintParams {
    account: 0,
    token_id: issue.token_id.clone(),
    address: "mtc1q_recipient...".into(),
    amount: Amount::from_atoms(100_000),
    options: TxOptions::default(),
}).await?;

// Unminting removes tokens from circulation (the tx burns them).
c.unmint_tokens(UnmintParams {
    account: 0,
    token_id: issue.token_id.clone(),
    amount: Amount::from_atoms(50_000),
    options: TxOptions::default(),
}).await?;

// Irreversible: fixes the supply at the current circulating amount.
// Note the field is account_index, not account.
c.lock_token_supply(wallet::LockSupplyParams {
    account_index: 0,
    token_id: issue.token_id.clone(),
    options: TxOptions::default(),
}).await?;
```

### Freezing and authority change

```rust
use mintlayer_sdk::wallet::{FreezeParams, TxOptions, UnfreezeParams};

// is_unfreezable: true means the authority can unfreeze later.
c.freeze_token(FreezeParams {
    account: 0, token_id: issue.token_id.clone(),
    is_unfreezable: true, options: TxOptions::default(),
}).await?;

c.unfreeze_token(UnfreezeParams {
    account: 0, token_id: issue.token_id.clone(), options: TxOptions::default(),
}).await?;

c.change_token_authority(wallet::ChangeAuthorityParams {
    account: 0,
    token_id: issue.token_id.clone(),
    address: "mtc1q_new_authority...".into(),
    options: TxOptions::default(),
}).await?;
```

## Issuing via the `crypto` module

For full-custody flows, build the issuance output yourself and pair it
with a coin input that covers the issuance fee.

```rust
use mintlayer_sdk::crypto::{self, Network, TokenTotalSupply};
use mintlayer_sdk::crypto::types::{TxInput, TxOutput};
use mintlayer_sdk::indexer::Client as IndexerClient;
use mintlayer_sdk::prelude::IsTokenFreezable;

let network = Network::Testnet;
let indexer = IndexerClient::new("http://127.0.0.1:3000");
let inputs: Vec<TxInput> = todo!(); // your UTXO inputs

let height = indexer.tip().await?.block_height + 1;
let fee = crypto::fungible_token_issuance_fee(height, network);
let token_id = crypto::get_token_id(&inputs, height, network)?;

let issue_output = crypto::encode_output_issue_fungible_token(
    "mtc1q_authority...",       // authority address
    "MYTOKEN",                  // ticker
    "https://example.com/meta", // metadata URI
    2,                          // number of decimals
    TokenTotalSupply::Lockable, // or Fixed(Amount) / Unlimited
    IsTokenFreezable::No,
    network,
)?;
let transaction = crypto::encode_transaction(inputs, vec![issue_output], 0)?;
// Sign with encode_witness and submit (see transactions.md).
```

Issuance parameters are validated against the chain config
(`crypto::Error::InvalidTokenParameters` on failure). Token fees must be
covered by the transaction's coin inputs.

### Minting manually

Minting is an account command needing the authority's next account nonce
from the indexer (`token.next_nonce`, string-encoded) plus an output
delivering the minted tokens:

```rust
use mintlayer_sdk::crypto::{self, Amount, Network};
use mintlayer_sdk::crypto::types::TxOutput;

let token_info = indexer.token(&token_id).await?;
let mint_input = crypto::encode_input_for_mint_tokens(
    &token_id,
    Amount::from_atoms(100_000),
    token_info.next_nonce.0,
    network,
)?;
let mint_output: TxOutput = crypto::encode_output_token_transfer(
    Amount::from_atoms(100_000), "mtc1q_recipient...", &token_id, network)?;
```

Other account-command inputs follow the same pattern; each consumes one
nonce in sequence:

| Function | Purpose |
|----------|---------|
| `encode_input_for_unmint_tokens(token_id, nonce, network)` | Pair with `encode_output_token_burn` |
| `encode_input_for_lock_token_supply(token_id, nonce, network)` | Irreversible supply fix |
| `encode_input_for_freeze_token(token_id, IsTokenUnfreezable, nonce, network)` | |
| `encode_input_for_unfreeze_token(token_id, nonce, network)` | |
| `encode_input_for_change_token_authority(token_id, new_authority, nonce, network)` | |
| `encode_input_for_change_token_metadata_uri(token_id, new_metadata_uri, nonce, network)` | |

Protocol fees — `token_supply_change_fee` for mint/unmint,
`token_freeze_fee` for freeze/unfreeze, `token_change_authority_fee` for
authority changes — must be covered by the transaction's coin inputs.

## NFTs

Each NFT issuance transaction creates exactly one NFT on an existing
token; there is no post-issuance minting.

```rust
use mintlayer_sdk::wallet::{IssueNftParams, NftMetadata, TxOptions};

let result = c.issue_nft(IssueNftParams {
    account: 0,
    destination_address: authority.clone(),
    metadata: NftMetadata {
        media_hash: "hex-encoded sha256 of the media".into(),
        name: "My NFT".into(),
        description: "A unique digital collectible".into(),
        ticker: "MYNFT".into(),
        creator: None,      // Option<String>, public key hex
        icon_uri: None,
        media_uri: Some("https://example.com/media.png".into()),
        additional_metadata_uri: None,
    },
    options: TxOptions::default(),
}).await?;
println!("nft id: {}", result.token_id);
```

```rust
// Manual equivalent (fee: crypto::nft_issuance_fee(height, network)):
let nft_output = crypto::encode_output_issue_nft(
    &token_id,               // existing collection token id
    "mtc1q_authority...", "My NFT", "MYNFT", "A unique digital collectible",
    media_hash_bytes,        // &[u8]
    None,                    // Option<PublicKey> creator
    Some("https://example.com/media.png"),
    None, None,              // icon_uri, additional_metadata_uri
    network,
)?;
```

The indexer reports NFTs with `nft(id)` (owner, token id, metadata).

## DEX orders

The wallet daemon covers the full order lifecycle (`create_order`,
`conclude_order`, `fill_order`, `freeze_order`, listings). The `crypto`
module exposes the order-creation output for manual flows:

```rust
let order_output = crypto::encode_create_order_output(
    Amount::from_atoms(1_000_000_000_000), // ask amount
    None,                                  // ask currency: None = coin
    Amount::from_atoms(500_000),           // give amount
    Some(&token_id),                       // give currency: token
    "mtc1q_conclude...",                   // may conclude the order
    network,
)?;
// The order id is derived from the inputs:
let order_id = crypto::get_order_id(&inputs, network)?;
```

Filling an order uses `encode_input_for_fill_order`, whose inputs must
not be signed — use `crypto::encode_witness_no_signature()` for them.
Before the orders V1 fork the `nonce` and `destination` parameters are
significant; after the fork both are ignored. `encode_input_for_freeze_order`
requires orders V1 (`crypto::Error::OrdersV1NotActivated` before it).

## Reading token state from the indexer

```rust
use mintlayer_sdk::indexer::{Client, PageOpts};

let idx = Client::new("http://127.0.0.1:3000");
let token = idx.token(&issue.token_id).await?;
println!("ticker {} supply {} locked {}", token.token_ticker,
    token.circulating_supply.decimal, token.is_locked);
println!("frozen {} (unfreezable: {:?})",
    token.frozen, token.is_token_unfreezable); // present only when frozen
let txs = idx.token_transactions(&issue.token_id, PageOpts::default()).await?;
```
