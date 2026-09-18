---
title: "Tokens"
description: "Fungible tokens and NFTs with the Mintlayer JavaScript SDK: issuance, minting, unminting, supply locking, freezing, authority and metadata management."
sidebar_position: 6
---

# Tokens

Mintlayer supports on-chain fungible tokens (MLS-01) and NFTs (Data NFTs). The SDK's `Client` exposes the full lifecycle through one-call methods, each also available as a `buildX` variant; see [Transactions](transactions.md#manual-building).

---

## Fungible tokens

### Supply policies

When issuing a token you choose one of three supply policies:

| Policy | Description |
| ------ | ----------- |
| `Unlimited` | Minting is always allowed with no cap |
| `Lockable` | Unlimited minting until `lockTokenSupply` is called, after which the supply is frozen permanently |
| `Fixed` | A hard cap is set at issuance; supply cannot exceed it |

### Issuing a token

```ts
const signedTx = await client.issueToken({
  token_ticker: 'MYTOKEN',
  number_of_decimals: 8,
  metadata_uri: 'https://example.com/token-metadata.json',
  is_freezable: true,
  supply_type: 'Lockable',
  authority: 'tmt1q...', // token authority address (must be one of your addresses)
  // supply_amount: 1000000, // required for supply_type: 'Fixed'
});
```

The `authority` address becomes the token authority: the key that controls future operations (minting, freezing, authority transfer). Keep it secure; the full lifecycle walkthrough lives in [Issue a Token (SDK)](../../../guides/javascript/issue-token.md), and the metadata URI should follow the [Token Metadata Standards](../../../reference/token-standards/mls01.md).

### Minting and unminting

```ts
await client.mintToken({
  token_id: 'tmltk1...',
  amount: 1000,
  destination: 'tmt1q...',
});

await client.unmintToken({ token_id: 'tmltk1...', amount: 500 }); // burns tokens
```

`mintToken` mints new units to `destination`; `unmintToken` removes units from circulation. Both require the token authority key.

### Locking supply

For `Lockable` tokens, lock the supply permanently:

```ts
await client.lockTokenSupply({ token_id: 'tmltk1...' });
```

After this call no further minting is possible for the token.

### Freezing

If the token was issued with `is_freezable: true`, the authority can freeze and unfreeze it. `freezeToken` also takes `is_unfreezable`, which decides whether the freeze can ever be lifted:

```ts
await client.freezeToken({ token_id: 'tmltk1...', is_unfreezable: false });
await client.unfreezeToken({ token_id: 'tmltk1...' });
```

### Authority and metadata management

```ts
await client.changeTokenAuthority({
  token_id: 'tmltk1...',
  new_authority: 'tmt1q...', // destination for the authority
});

await client.changeMetadataUri({
  token_id: 'tmltk1...',
  new_metadata_uri: 'https://example.com/new-metadata.json',
});
```

`changeTokenAuthority` hands control of the token to another address; `changeMetadataUri` updates where the token's metadata is published.

### Burning and transferring

```ts
await client.burn({ token_id: 'tmltk1...', amount: 25 });

await client.transfer({
  to: 'tmt1q...',
  amount: 10,
  token_id: 'tmltk1...', // omit to transfer the base coin instead
});
```

Tokens owned by the connected addresses are listed by `client.getTokensOwned()`; per-token balances via `client.getBalances()`.

---

## NFTs

### Issuing an NFT

```ts
const signedTx = await client.issueNft({
  ticker: 'MYNFT',
  name: 'My First NFT',
  description: 'Issued with @mintlayer/sdk',
  creator: 'tmt1q...', // optional
  media_uri: 'https://example.com/media.png',
  media_hash: '<content hash of the media>',
  icon_uri: 'https://example.com/icon.png',
  additional_metadata_uri: 'https://example.com/metadata.json',
  destination: 'tmt1q...', // where the NFT is minted
});
```

The metadata fields follow the [Data NFT standard](../../../reference/block-and-transaction-serialization.md); see [Issue an NFT (SDK)](../../../guides/javascript/issue-nft.md) for a walkthrough and the [MLS-03 metadata schema](../../../reference/token-standards/mls03.md) for the off-chain metadata.

### Transferring an NFT

```ts
await client.transferNft({
  to: 'tmt1q...',
  token_id: 'tmltk1...',
});
```

---

## Units and decimals

All `amount` values are human-readable; the SDK converts them to atoms using the token's `number_of_decimals`. For display conversions use the exported helpers:

```ts
import { atomsToDecimal, decimalsToAtoms } from '@mintlayer/sdk';

atomsToDecimal('100000000', 8);  // '1'
decimalsToAtoms(1, 8);           // 100000000n
```
