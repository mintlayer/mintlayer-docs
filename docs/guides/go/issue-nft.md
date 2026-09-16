---
title: "Issue an NFT"
description: "Issue and transfer MLS-03 NFTs with the Go SDK: wallet client issuance and indexer reads."
sidebar_position: 3
---

# Issue an NFT

The Go SDK path to issuing MLS-03 NFTs. The same workflow in JavaScript lives in the [JavaScript guides](../javascript/issue-nft.md); the wallet-cli version is [Issuing and managing an NFT](../cli/issuing-and-managing-an-nft.md). On-chain, an NFT is an MLS-03 issuance carrying the creator, name, description, ticker, icon, media URI, and media hash; the JSON standard for the off-chain metadata is defined in the [Token Metadata Standards](../../reference/token-standards/mls03.md).

:::note[Immutable by design]

NFT metadata is **set at issuance and cannot be changed**: there is no equivalent of `changeMetadataUri` for NFTs. Compute and record the media hash before issuing. Mintlayer does not prescribe an algorithm; use a standard one (e.g. SHA-256) and record which one you used.

:::

## Issuing

```go
import "github.com/mintlayer/go-sdk/wallet"

wc := wallet.New("http://127.0.0.1:3034")

ownerAddr, err := wc.NewAddress(ctx, 0)

result, err := wc.IssueNFT(ctx, wallet.IssueNFTParams{
    Account:            0,
    DestinationAddress: ownerAddr,
    Metadata: wallet.NFTMetadata{
        Name:        "Sunset #1",
        Description: "A photograph of a sunset",
        Ticker:      "SUNST",
        MediaHash:   "a3f1e2...d9c4",
        MediaURI:    stringPtr("https://example.com/sunset.png"),
        IconURI:     stringPtr("https://example.com/icon.png"),
    },
})
fmt.Printf("nft id: %s\n", result.TokenID)
```

Each issuance transaction creates exactly one NFT: there is no mint step afterwards.

## Transferring

An NFT transfer is a token transfer of the NFT id; use the wallet transaction APIs (see [Go SDK: Wallet](../../build/sdks/go/wallet.md)) or the `wasm` output encoders.

## Reading NFT state

```go
import "github.com/mintlayer/go-sdk/indexer"

idx := indexer.New("http://127.0.0.1:3000")

nft, err := idx.GetNFT(ctx, result.TokenID)
fmt.Printf("owner: %s  name: %s\n", nft.Owner, nft.Metadata.Name)
```

## Metadata standard

For the JSON document at the metadata URI (media details, editions, licensing, collections), follow the MLS-03 schema in [Token Metadata Standards](../../reference/token-standards/mls03.md): it includes ready-made templates for art, gaming, tickets, credentials, and more.
