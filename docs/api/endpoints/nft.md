---
title: "NFTs"
description: "NFT issuance endpoint of the Mintlayer indexer API."
sidebar_position: 9
---

# NFT endpoints

## GET /nft/\{id\}

Returns the issuance data of an NFT, identified by its token ID (`mmltk1...`). Returns 404 with `{"error":"NFT not found"}` if the ID is not an NFT.

```bash
curl https://api-server.mintlayer.org/api/v2/nft/{id}
```

Response shape (fields are `null` when not set in the issuance metadata):

```json
{
  "additional_metadata_uri": null,
  "creator": "mtc1q96xrfmcnf79nm5ghkxjeeflf0w0cnvnjy72fckq",
  "description": "An example NFT",
  "icon_uri": "ipfs://bafy.../icon.png",
  "media_hash": "6777eb86f0564cae116428628fa806617f665c8779cd871f5026794b8161989e",
  "media_uri": "ipfs://bafy.../media.png",
  "name": "Example NFT #1",
  "owner": "mtc1q8n9u3g3aw4h40gsagxn7yw0jatdfe9xsuftnvur",
  "ticker": "ENFT"
}
```

> **Example note:** the response above is a synthetic example (field names and structure are taken from the api-web-server source). At the time of writing no NFT token ID could be captured from the production API to quote a real response verbatim.

To enumerate NFTs, use [`GET /token`](token.md) to list token IDs and probe them with this endpoint; fungible tokens return `NFT not found`.

## Go SDK

```go
nft, err := client.Indexer.GetNFT(ctx, nftID)   // GET /nft/:id
```

See the [indexer client reference](../../build/sdks/go/indexer.md) and the [NFT guide](../../wallet/guides/issuing-and-managing-an-nft.md).
