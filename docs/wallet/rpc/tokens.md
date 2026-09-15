---
title: "Wallet RPC: Tokens"
sidebar_position: 5
---

Methods for issuing and managing fungible tokens and NFTs.

See [Overview](overview.md) for connection details and the shared `rpc()` helper used in examples.

---

## Fungible Tokens

### `token_issue_new`

Issue a new fungible token. After issuance, tokens must be minted before they can be transferred.

```json
{
  "account": 0,
  "destination_address": "<authority_address>",
  "metadata": {
    "token_ticker": "MYTKN",
    "number_of_decimals": 8,
    "metadata_uri": "https://example.com/token",
    "token_supply": { "type": "Lockable" },
    "is_freezable": false
  },
  "options": { "in_top_x_mb": null, "broadcast_to_mempool": true }
}
```

Supply types:
- `{ "type": "Fixed", "content": { "decimal": "1000000" } }`, immutable fixed supply
- `{ "type": "Lockable" }`, unlimited until locked with `token_lock_supply`
- `{ "type": "Unlimited" }`, always unlimited

```js
const result = await rpc('token_issue_new', {
  account: 0,
  destination_address: '<authority_address>',
  metadata: {
    token_ticker: 'MYTKN',
    number_of_decimals: 8,
    metadata_uri: 'https://example.com/token',
    token_supply: { type: 'Lockable' },
    is_freezable: false,
  },
  options: { in_top_x_mb: null, broadcast_to_mempool: true },
});
console.log('Token id:', result.token_id);
console.log('Tx:', result.tx_id);
```

### `token_mint`

Mint tokens into the circulating supply. The authority key must be held by the selected account.

```js
const result = await rpc('token_mint', {
  account: 0,
  token_id: '<token_id>',
  address: '<recipient_address>',
  amount: { decimal: '1000000' },
  options: { in_top_x_mb: null, broadcast_to_mempool: true },
});
console.log('Mint tx:', result.tx_id);
```

### `token_unmint`

Unmint tokens, reducing the circulating supply. The wallet must hold both the tokens and the authority key.

```js
const result = await rpc('token_unmint', {
  account: 0,
  token_id: '<token_id>',
  amount: { decimal: '5000' },
  options: { in_top_x_mb: null, broadcast_to_mempool: true },
});
console.log('Unmint tx:', result.tx_id);
```

### `token_lock_supply`

Permanently lock the token supply at the current circulating amount. **Irreversible.** Only available for tokens issued with `Lockable` supply.

```js
const result = await rpc('token_lock_supply', {
  account_index: 0,
  token_id: '<token_id>',
  options: { in_top_x_mb: null, broadcast_to_mempool: true },
});
console.log('Lock supply tx:', result.tx_id);
```

Note: this method uses `account_index` (not `account`) for the account parameter.

### `token_send`

Send tokens to an address. Fees are paid in TML.

```js
const result = await rpc('token_send', {
  account: 0,
  token_id: '<token_id>',
  address: '<destination_address>',
  amount: { decimal: '100' },
  options: { in_top_x_mb: null, broadcast_to_mempool: true },
});
console.log('Send tx:', result.tx_id);
```

### `token_freeze`

Freeze a token, blocking all operations. Requires the token to have been issued with `is_freezable: true`.

```js
// Freeze but allow unfreezing later
await rpc('token_freeze', {
  account: 0,
  token_id: '<token_id>',
  is_unfreezable: true,
  options: { in_top_x_mb: null, broadcast_to_mempool: true },
});

// Permanent freeze
await rpc('token_freeze', {
  account: 0,
  token_id: '<token_id>',
  is_unfreezable: false,
  options: { in_top_x_mb: null, broadcast_to_mempool: true },
});
```

### `token_unfreeze`

Unfreeze a token. Only possible if frozen with `is_unfreezable: true`.

```js
await rpc('token_unfreeze', {
  account: 0,
  token_id: '<token_id>',
  options: { in_top_x_mb: null, broadcast_to_mempool: true },
});
```

### `token_change_authority`

Transfer the authority address to a new key.

```js
const result = await rpc('token_change_authority', {
  account: 0,
  token_id: '<token_id>',
  address: '<new_authority_address>',
  options: { in_top_x_mb: null, broadcast_to_mempool: true },
});
console.log('Authority transfer tx:', result.tx_id);
```

### `token_change_metadata_uri`

Update the metadata URI for a token. The URI must be hex-encoded.

```js
const uriHex = Buffer.from('https://example.com/new-metadata').toString('hex');
const result = await rpc('token_change_metadata_uri', {
  account: 0,
  token_id: '<token_id>',
  metadata_uri: uriHex,
  options: { in_top_x_mb: null, broadcast_to_mempool: true },
});
```

### `node_get_tokens_info`

Look up on-chain info for one or more token ids (works for both fungible tokens and NFTs).

```js
const infos = await rpc('node_get_tokens_info', {
  token_ids: ['<token_id_1>', '<token_id_2>'],
});
for (const info of infos) {
  if (info.type === 'FungibleToken') {
    console.log('Ticker:', info.content.token_ticker.text);
    console.log('Supply:', info.content.circulating_supply.atoms);
    console.log('Locked:', info.content.is_locked);
    console.log('Frozen:', info.content.frozen.type);
  }
}
```

---

## NFTs

### `token_nft_issue_new`

Issue a non-fungible token. The NFT is immediately sent to `destination_address` and cannot be minted again.

```js
const result = await rpc('token_nft_issue_new', {
  account: 0,
  destination_address: '<my_address>',
  metadata: {
    media_hash: 'a3f1e2...d9c4',   // hex hash of the media file
    name: 'Sunset #1',
    description: 'A photograph of a sunset',
    ticker: 'SUNST',
    creator: null,                   // optional: hex public key of creator
    icon_uri: 'https://example.com/icon.png',
    media_uri: 'https://example.com/sunset.png',
    additional_metadata_uri: null,
  },
  options: { in_top_x_mb: null, broadcast_to_mempool: true },
});
console.log('NFT token id:', result.token_id);
console.log('Tx:', result.tx_id);
```

To transfer an NFT, use `token_send` with `amount: { decimal: '1' }`.

---

## Token Info Response Shape

`node_get_tokens_info` returns different shapes depending on token type:

**Fungible token:**
```json
{
  "type": "FungibleToken",
  "content": {
    "token_id": "...",
    "token_ticker": { "text": "MYTKN", "hex": "..." },
    "number_of_decimals": 8,
    "metadata_uri": { "text": "https://...", "hex": "..." },
    "circulating_supply": { "atoms": "100000000000" },
    "total_supply": { "type": "Lockable" },
    "is_locked": false,
    "frozen": { "type": "NotFrozen", "content": { "freezable": true } },
    "authority": "..."
  }
}
```

**NFT:**
```json
{
  "type": "NonFungibleToken",
  "content": {
    "token_id": "...",
    "creation_tx_id": "...",
    "creation_block_id": "...",
    "metadata": {
      "name": { "text": "Sunset #1", "hex": "..." },
      "description": { "text": "...", "hex": "..." },
      "ticker": { "text": "SUNST", "hex": "..." },
      "media_hash": "...",
      "icon_uri": { "text": "https://...", "hex": "..." },
      "media_uri": { "text": "https://...", "hex": "..." },
      "creator": null,
      "additional_metadata_uri": null
    }
  }
}
```

---

## Related Pages

- [Guide: Issuing and Managing a Token](../../wallet/guides/issue-new-token.md)
- [Guide: Issuing and Managing an NFT](../../wallet/guides/issuing-and-managing-an-nft.md)
- [Wallet RPC: Transactions](transactions.md)
- [Wallet RPC: Overview](overview.md)
