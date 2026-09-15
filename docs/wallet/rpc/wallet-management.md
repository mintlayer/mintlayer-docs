---
title: "Wallet RPC: Wallet Management"
sidebar_position: 7
---

Methods for creating, opening, and managing wallets, accounts, addresses, and encryption. These methods are available in both hot and cold wallet modes.

See [Overview](overview.md) for connection details and the shared `rpc()` helper used in examples.

---

## Wallet Lifecycle

### `wallet_create`

Create a new wallet file.

```json
{
  "path": "/path/to/wallet.db",
  "store_seed_phrase": true,
  "mnemonic": null,
  "passphrase": null,
  "hardware_wallet": null
}
```

Returns the generated mnemonic if one was newly created:

```json
{
  "mnemonic": { "type": "NewlyGenerated", "content": { "mnemonic": "word1 word2 ..." } },
  "multiple_devices_available": null
}
```

```js
const result = await rpc('wallet_create', {
  path: '/home/user/my-wallet.db',
  store_seed_phrase: true,
  mnemonic: null,
  passphrase: null,
  hardware_wallet: null,
});
if (result.mnemonic.type === 'NewlyGenerated') {
  console.log('Backup your mnemonic:', result.mnemonic.content.mnemonic);
}
```

### `wallet_recover`

Recover an existing wallet from a mnemonic phrase.

```json
{
  "path": "/path/to/wallet.db",
  "store_seed_phrase": true,
  "mnemonic": "word1 word2 ...",
  "passphrase": null,
  "hardware_wallet": null
}
```

```js
await rpc('wallet_recover', {
  path: '/home/user/recovered-wallet.db',
  store_seed_phrase: false,
  mnemonic: 'word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12',
  passphrase: null,
  hardware_wallet: null,
});
```

### `wallet_open`

Open an existing wallet file.

```json
{
  "path": "/path/to/wallet.db",
  "password": null,
  "force_migrate_wallet_type": null,
  "hardware_wallet": null
}
```

```js
await rpc('wallet_open', {
  path: '/home/user/my-wallet.db',
  password: null,
  force_migrate_wallet_type: null,
  hardware_wallet: null,
});
```

### `wallet_close`

Close the currently open wallet.

```js
await rpc('wallet_close');
```

### `wallet_info`

Get information about the open wallet: id, accounts, and wallet type.

```js
const info = await rpc('wallet_info');
console.log('Wallet id:', info.wallet_id);
console.log('Accounts:', info.account_names);
console.log('Type:', info.extra_info.type); // "SoftwareWallet", "TrezorWallet", "LedgerWallet"
```

---

## Seed Phrase

### `wallet_show_seed_phrase`

Return the stored seed phrase (if it was stored at wallet creation).

```js
const result = await rpc('wallet_show_seed_phrase');
if (result) {
  console.log('Mnemonic:', result.seed_phrase.join(' '));
}
```

### `wallet_purge_seed_phrase`

Delete the seed phrase from the wallet database. Returns the phrase once before deleting it.

```js
const result = await rpc('wallet_purge_seed_phrase');
// Store result.seed_phrase securely before it is gone from the wallet file
```

---

## Encryption

### `wallet_encrypt_private_keys`

Encrypt the wallet's private keys with a password. The wallet must currently be unlocked.

```js
await rpc('wallet_encrypt_private_keys', { password: 'my-secure-password' });
```

### `wallet_unlock_private_keys`

Unlock an encrypted wallet for use.

```js
await rpc('wallet_unlock_private_keys', { password: 'my-secure-password' });
```

### `wallet_lock_private_keys`

Lock the wallet, preventing private key usage until unlocked again.

```js
await rpc('wallet_lock_private_keys');
```

### `wallet_disable_private_keys_encryption`

Remove encryption entirely. **Warning: the wallet file will be usable without a password.**

```js
await rpc('wallet_disable_private_keys_encryption');
```

---

## Sync

### `wallet_sync`

Scan remaining blocks from the node until the chain tip.

```js
await rpc('wallet_sync');
```

### `wallet_rescan`

Rescan the entire blockchain from genesis.

```js
await rpc('wallet_rescan');
```

### `wallet_best_block`

Get the best block the wallet is currently synced to.

```js
const block = await rpc('wallet_best_block');
console.log('Height:', block.height, 'Id:', block.id);
```

### `wallet_set_lookahead_size`

Set the address gap limit (how many unused addresses to monitor ahead of the last used one).

```js
await rpc('wallet_set_lookahead_size', {
  lookahead_size: 100,
  i_know_what_i_am_doing: true,
});
```

---

## Accounts

### `account_create`

Create a new account. Fails if the last account has no transaction history.

```js
const result = await rpc('account_create', { name: 'Savings' });
console.log('New account index:', result.account);
```

### `account_rename`

Rename an account (pass `null` to remove the name).

```js
await rpc('account_rename', { account: 0, name: 'Main' });
```

### `account_balance`

Get the balance of an account.

```js
const balance = await rpc('account_balance', {
  account: 0,
  utxo_states: ['Confirmed'],
  with_locked: null,
});
console.log('Coins:', balance.coins.decimal);
for (const [tokenId, amount] of Object.entries(balance.tokens)) {
  console.log(`Token ${tokenId}:`, amount.decimal);
}
```

`utxo_states` accepts: `"Confirmed"`, `"InMempool"`, `"Inactive"`, `"Conflicted"`, `"Abandoned"`.

### `account_utxos`

List UTXOs owned by the account.

```js
const utxos = await rpc('account_utxos', { account: 0 });
for (const utxo of utxos) {
  console.log(utxo.outpoint.source_id, utxo.output.type);
}
```

### `account_extended_public_key`

Get the extended public key for an account (useful for watch-only setups).

```js
const result = await rpc('account_extended_public_key', { account: 0 });
console.log(result.extended_public_key);
```

---

## Addresses

### `address_new`

Generate a new unused receive address.

```js
const result = await rpc('address_new', { account: 0 });
console.log('New address:', result.address);
```

### `address_show`

List addresses for the account with their usage state and coin balance.

```js
const addresses = await rpc('address_show', {
  account: 0,
  include_change_addresses: false,
});
for (const addr of addresses) {
  console.log(addr.address, 'used:', addr.used, 'balance:', addr.coins.decimal);
}
```

### `address_reveal_public_key`

Reveal the public key (in hex and bech32 address form) behind a given address.

```js
const result = await rpc('address_reveal_public_key', {
  account: 0,
  address: '<address>',
});
console.log('Pubkey hex:', result.public_key_hex);
console.log('Pubkey address:', result.public_key_address);
```

---

## Related Pages

- [Wallet RPC: Transactions](transactions.md)
- [Wallet RPC: Overview](overview.md)
