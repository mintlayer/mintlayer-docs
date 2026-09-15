---
title: "Wallet RPC: Transactions"
sidebar_position: 6
---

Methods for sending, composing, inspecting, and listing transactions.

See [Overview](overview.md) for connection details and the shared `rpc()` helper used in examples.

---

## Sending

### `address_send`

Send coins to an address. Fees are calculated automatically.

```json
{
  "account": 0,
  "address": "<destination_address>",
  "amount": { "decimal": "10.5" },
  "selected_utxos": [],
  "options": { "in_top_x_mb": null, "broadcast_to_mempool": null }
}
```

Returns the transaction id, raw hex, fees paid, and whether it was broadcast.

```js
const result = await rpc('address_send', {
  account: 0,
  address: '<destination_address>',
  amount: { decimal: '10.5' },
  selected_utxos: [],
  options: { in_top_x_mb: null, broadcast_to_mempool: true },
});
console.log('Transaction id:', result.tx_id);
console.log('Fee:', result.fees.coins.decimal);
console.log('Broadcast:', result.broadcasted);
```

### `token_send`

Send a token amount to an address.

```js
const result = await rpc('token_send', {
  account: 0,
  token_id: '<token_id>',
  address: '<destination_address>',
  amount: { decimal: '100' },
  options: { in_top_x_mb: null, broadcast_to_mempool: true },
});
console.log('Transaction id:', result.tx_id);
```

### `address_sweep_spendable`

Sweep all spendable coins (and tokens) from one or more addresses to a destination.

```js
// Sweep from specific addresses
const result = await rpc('address_sweep_spendable', {
  account: 0,
  destination_address: '<destination_address>',
  from_addresses: ['<source_address_1>', '<source_address_2>'],
  all: false,
  options: { in_top_x_mb: null, broadcast_to_mempool: true },
});

// Sweep all addresses in the account
const result2 = await rpc('address_sweep_spendable', {
  account: 0,
  destination_address: '<destination_address>',
  from_addresses: [],
  all: true,
  options: { in_top_x_mb: null, broadcast_to_mempool: true },
});
```

### `utxo_spend`

Spend a specific UTXO, moving its funds to an address.

```js
const result = await rpc('utxo_spend', {
  account: 0,
  utxo: {
    source_id: { type: 'Transaction', content: { tx_id: '<txid>' } },
    index: 0,
  },
  output_address: '<destination_address>',
  htlc_secret: null,
  options: { in_top_x_mb: null, broadcast_to_mempool: true },
});
```

---

## Composing and Signing

### `transaction_compose`

Compose a raw transaction from explicit inputs and outputs without signing it. Returns a hex-encoded PartiallySignedTransaction that can be passed to `account_sign_raw_transaction`.

```js
const result = await rpc('transaction_compose', {
  inputs: [
    {
      source_id: { type: 'Transaction', content: { tx_id: '<txid>' } },
      index: 0,
    },
  ],
  outputs: [
    {
      type: 'Transfer',
      content: {
        value: { type: 'Coin', content: { amount: { decimal: '5.0' } } },
        destination: '<destination_address>',
      },
    },
  ],
  htlc_secrets: null,
  only_transaction: false,
});
console.log('Unsigned PST hex:', result.hex);
console.log('Estimated fee:', result.fees.coins.decimal);
```

### `account_sign_raw_transaction`

Sign a hex-encoded transaction or PartiallySignedTransaction. Used for multisig and cold wallet workflows.

```js
const result = await rpc('account_sign_raw_transaction', {
  account: 0,
  raw_tx: '<pst_hex>',
  options: { in_top_x_mb: null },
});
console.log('Signed hex:', result.hex);
console.log('Signatures:', result.current_signatures);
```

### `transaction_inspect`

Inspect a raw transaction hex, shows inputs, outputs, fees, and signature status without broadcasting.

```js
const result = await rpc('transaction_inspect', {
  transaction: '<hex>',
});
console.log('Inputs:', result.stats.num_inputs);
console.log('Signatures:', result.stats.total_signatures);
console.log('Fee:', result.fees?.coins.decimal);
```

Signature statuses per input: `"NotSigned"`, `"InvalidSignature"`, `"UnknownSignature"`, `"FullySigned"`, `"PartialMultisig"`.

### `transaction_create_from_cold_input`

Create an unsigned transaction spending from a specific address (cold storage withdrawal). The change is returned to the same address unless overridden.

```js
const result = await rpc('transaction_create_from_cold_input', {
  account: 0,
  address: '<destination_address>',
  amount: { decimal: '50.0' },
  selected_utxo: {
    source_id: { type: 'Transaction', content: { tx_id: '<txid>' } },
    index: 0,
  },
  change_address: null,
  options: { in_top_x_mb: null },
});
console.log('Unsigned hex:', result.hex);
```

---

## Broadcasting

### `node_submit_transaction`

Submit a fully signed hex transaction to the mempool and broadcast it.

```js
const result = await rpc('node_submit_transaction', {
  tx: '<signed_hex>',
  do_not_store: false,
  options: { trust_policy: 'Trusted' },
});
console.log('Broadcast tx id:', result.tx_id);
```

---

## Listing and Querying

### `transaction_list_by_address`

List confirmed transactions for an account, optionally filtered by address.

```js
const txs = await rpc('transaction_list_by_address', {
  account: 0,
  address: null,  // or '<address>' to filter
  limit: 20,
});
for (const tx of txs) {
  console.log(tx.id, 'at height', tx.height, 'timestamp', tx.timestamp.timestamp);
}
```

### `transaction_list_pending`

List pending (unconfirmed) transaction ids that can be abandoned.

```js
const pending = await rpc('transaction_list_pending', { account: 0 });
console.log('Pending:', pending);
```

### `transaction_get`

Get a transaction from the wallet as a JSON object.

```js
const tx = await rpc('transaction_get', {
  account: 0,
  transaction_id: '<txid>',
});
console.log(tx);
```

### `transaction_get_raw`

Get a transaction as a raw hex string.

```js
const hex = await rpc('transaction_get_raw', {
  account: 0,
  transaction_id: '<txid>',
});
```

### `transaction_get_signed_raw`

Get a signed transaction as a raw hex string.

```js
const hex = await rpc('transaction_get_signed_raw', {
  account: 0,
  transaction_id: '<txid>',
});
```

### `transaction_abandon`

Abandon an unconfirmed transaction, releasing its inputs for reuse.

```js
await rpc('transaction_abandon', {
  account: 0,
  transaction_id: '<txid>',
});
```

---

## Data Storage

### `address_deposit_data`

Store arbitrary data on the blockchain (as a hex string). Note: this incurs a high fee.

```js
const data = Buffer.from('hello world').toString('hex');
const result = await rpc('address_deposit_data', {
  account: 0,
  data,
  options: { in_top_x_mb: null, broadcast_to_mempool: true },
});
console.log('Data deposit tx:', result.tx_id);
```

---

## Transaction Options

Most transaction methods accept an `options` object:

| Field | Type | Description |
|---|---|---|
| `in_top_x_mb` | `number \| null` | Target the transaction to be in the top X MB of the mempool priority |
| `broadcast_to_mempool` | `boolean \| null` | Whether to broadcast immediately (default: true) |

---

## Related Pages

- [Wallet RPC: Wallet Management](wallet-management.md)
- [Wallet RPC: Staking](staking.md)
- [Wallet RPC: Tokens](tokens.md)
- [Wallet RPC: Overview](overview.md)
