---
title: "Issue an NFT"
description: "Issue and transfer MLS-03 NFTs with the JavaScript SDK's Client methods."
sidebar_position: 3
---

# Issue an NFT

The JavaScript path to issuing MLS-03 NFTs with `@mintlayer/sdk`. The same workflow in Go lives in the [Go guides](../go/issue-nft.md); the wallet-cli version is [Issuing and managing an NFT](../cli/issuing-and-managing-an-nft.md). On-chain, an NFT is an MLS-03 issuance carrying the creator, name, description, ticker, icon, media URI, and media hash; the JSON standard for the off-chain metadata is defined in the [Token Metadata Standards](../../reference/token-standards/mls03.md).

:::note[Immutable by design]

NFT metadata is **set at issuance and cannot be changed**: there is no equivalent of `changeMetadataUri` for NFTs. Compute and record the media hash before issuing. Mintlayer does not prescribe an algorithm; use a standard one (e.g. SHA-256) and record which one you used.

:::

## Issuing

```ts
const signedTx = await client.issueNft({
  ticker: 'SUNST',
  name: 'Sunset #1',
  description: 'A photograph of a sunset',
  creator: 'tmt1q...', // optional
  media_uri: 'https://example.com/sunset.png',
  media_hash: '<sha-256 hex hash of the media>',
  icon_uri: 'https://example.com/icon.png',
  additional_metadata_uri: 'https://example.com/sunset.json', // optional extended metadata
  destination: 'tmt1q...', // where the NFT is minted
});
```

Each issuance transaction creates exactly one NFT: there is no mint step afterwards.

## Transferring

```ts
await client.transferNft({ to: 'tmt1q...', token_id: 'tmltk1...' });
```

## Reading NFT state

NFTs held by the connected addresses appear in `client.getTokensOwned()` / `client.getBalances()`.

## Metadata standard

For the JSON document at the metadata URI (media details, editions, licensing, collections), follow the MLS-03 schema in [Token Metadata Standards](../../reference/token-standards/mls03.md): it includes ready-made templates for art, gaming, tickets, credentials, and more.
