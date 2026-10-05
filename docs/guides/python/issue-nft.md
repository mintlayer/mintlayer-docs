---
title: "Issue an NFT"
description: "Issue MLS-03 NFTs with the Python SDK via the wallet daemon or the wasm module's issuance encoders."
sidebar_position: 3
---

# Issue an NFT

The Python path to issuing MLS-03 NFTs. The same workflow exists for the [command line](../cli/issuing-and-managing-an-nft.md), [Go](../go/issue-nft.md), [JavaScript](../javascript/issue-nft.md), and [Rust](../rust/issue-nft.md). On-chain, an NFT is an MLS-03 issuance carrying the creator, name, description, ticker, icon, media URI, and media hash; the JSON standard for the off-chain metadata is defined in the [Token Metadata Standards](../../reference/token-standards/mls03.md).

:::note[Immutable by design]

NFT metadata is **set at issuance and cannot be changed**: there is no equivalent of `change_token_metadata_uri` for NFTs. Compute and record the media hash before issuing. Mintlayer does not prescribe an algorithm; use a standard one (e.g. SHA-256) and record which one you used.

:::

## Issuing via the wallet daemon

```python
from mintlayer.wallet import Client, IssueNFTParams, NFTMetadata

wc = Client("http://127.0.0.1:3034")

owner_addr = wc.new_address(0)

result = wc.issue_nft(
    IssueNFTParams(
        account=0,
        destination_address=owner_addr,
        metadata=NFTMetadata(
            name="My NFT",
            description="A unique digital collectible",
            ticker="MYNFT",
            media_hash="sha256hexhash...",
            media_uri="https://example.com/media.png",
            icon_uri="https://example.com/icon.png",
            # creator and additional_metadata_uri default to None
        ),
    )
)
print(f"nft id: {result.token_id}")
```

NFTs cannot be minted after issuance: each issuance transaction creates exactly one NFT.

## Transferring

An NFT transfer is a token transfer of the NFT id: use `send_token` with the NFT id (see [Issue a Token](issue-token.md#transferring-and-burning)) or the wallet transaction APIs.

## Reading NFT state

The indexer reports NFTs with owner and metadata:

```python
nft = idx.get_nft(result.token_id)
print(f"owner: {nft.owner}  name: {nft.metadata.name}")
```

## Metadata standard

For the JSON document at the metadata URI (media details, editions, licensing, collections), follow the MLS-03 schema in [Token Metadata Standards](../../reference/token-standards/mls03.md): it includes ready-made templates for art, gaming, tickets, credentials, and more.
