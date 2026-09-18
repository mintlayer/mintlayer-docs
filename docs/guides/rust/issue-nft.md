---
title: "Issue an NFT"
description: "Issue MLS-03 NFTs with the Rust SDK via the wallet daemon or the crypto module's issuance encoders."
sidebar_position: 3
---

# Issue an NFT

The Rust path to issuing MLS-03 NFTs. The same workflow exists for the [command line](../cli/issuing-and-managing-an-nft.md), [Go](../go/issue-nft.md), and [JavaScript](../javascript/issue-nft.md). On-chain, an NFT is an MLS-03 issuance carrying the creator, name, description, ticker, icon, media URI, and media hash; the JSON standard for the off-chain metadata is defined in the [Token Metadata Standards](../../reference/token-standards/mls03.md).

:::note[Immutable by design]

NFT metadata is **set at issuance and cannot be changed**: there is no equivalent of `change_token_metadata_uri` for NFTs. Compute and record the media hash before issuing. Mintlayer does not prescribe an algorithm; use a standard one (e.g. SHA-256) and record which one you used.

:::

## Issuing via the wallet daemon

Each NFT issuance transaction creates exactly one NFT on an existing token; there is no post-issuance minting.

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

## Full-custody issuance

With the `crypto` feature, build the issuance output yourself; the issuance fee (`crypto::nft_issuance_fee(height, network)`) must be covered by the transaction's coin inputs:

```rust
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

## Reading NFT state

The indexer reports NFTs with owner and metadata:

```rust
let nft = idx.nft(&result.token_id).await?;
println!("owner: {}", nft.owner);
```

## Metadata standard

For the JSON document at the metadata URI (media details, editions, licensing, collections), follow the MLS-03 schema in [Token Metadata Standards](../../reference/token-standards/mls03.md): it includes ready-made templates for art, gaming, tickets, credentials, and more.
