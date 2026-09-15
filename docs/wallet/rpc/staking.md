---
title: "Wallet RPC: Staking"
sidebar_position: 4
---

Methods for creating and managing staking pools, delegations, and staking control.

See [Overview](overview.md) for connection details and the shared `rpc()` helper used in examples.

---

## Pool Management

### `staking_create_pool`

Create a staking pool. The pool can produce blocks and accept delegations.

```json
{
  "account": 0,
  "amount": { "decimal": "40000" },
  "cost_per_block": { "decimal": "1" },
  "margin_ratio_per_thousand": "5%",
  "decommission_address": "<decommission_address>",
  "staker_address": null,
  "vrf_public_key": null,
  "options": { "in_top_x_mb": null, "broadcast_to_mempool": true }
}
```

```js
const result = await rpc('staking_create_pool', {
  account: 0,
  amount: { decimal: '40000' },
  cost_per_block: { decimal: '1' },
  margin_ratio_per_thousand: '5%',
  decommission_address: '<decommission_address>',
  staker_address: null,
  vrf_public_key: null,
  options: { in_top_x_mb: null, broadcast_to_mempool: true },
});
console.log('Pool creation tx:', result.tx_id);
```

`staker_address` and `vrf_public_key` are only needed when the wallet that will perform staking differs from the one creating the pool. In that case, `staker_address` must be a public key address (not a public key hash address).

### `staking_list_pools`

List all pools whose staking key is controlled by the account.

```js
const pools = await rpc('staking_list_pools', { account: 0 });
for (const pool of pools) {
  console.log('Pool:', pool.pool_id);
  console.log('  Pledge:', pool.pledge.decimal);
  console.log('  Balance:', pool.balance.decimal);
  console.log('  Margin:', pool.margin_ratio_per_thousand);
  console.log('  Cost/block:', pool.cost_per_block.decimal);
}
```

### `staking_list_owned_pools_for_decommission`

List pools whose decommission key (not necessarily staking key) is owned by this account.

```js
const pools = await rpc('staking_list_owned_pools_for_decommission', { account: 0 });
```

### `staking_pool_balance`

Get the current balance of a specific pool.

```js
const result = await rpc('staking_pool_balance', { pool_id: '<pool_id>' });
console.log('Balance:', result.balance);
```

### `staking_decommission_pool`

Decommission a pool when the decommission key is in the current wallet. Returns the pledge and rewards to the output address.

```js
const result = await rpc('staking_decommission_pool', {
  account: 0,
  pool_id: '<pool_id>',
  output_address: '<destination_address>',
  options: { in_top_x_mb: null, broadcast_to_mempool: true },
});
console.log('Decommission tx:', result.tx_id);
```

### `staking_decommission_pool_request`

Create an unsigned decommission request when the decommission key is held in a different wallet. Returns a hex string to be signed by the wallet holding the decommission key.

```js
const hex = await rpc('staking_decommission_pool_request', {
  account: 0,
  pool_id: '<pool_id>',
  output_address: '<destination_address>',
  options: { in_top_x_mb: null },
});
// Transfer hex to the wallet holding the decommission key, then:
// account_sign_raw_transaction(hex) → node_submit_transaction(signed_hex)
```

---

## Staking Control

### `staking_start`

Start producing blocks with the pools in the selected account.

```js
await rpc('staking_start', { account: 0 });
```

### `staking_stop`

Stop block production. Does not affect pools or delegations.

```js
await rpc('staking_stop', { account: 0 });
```

### `staking_status`

Check whether staking is currently active for the account.

```js
const status = await rpc('staking_status', { account: 0 });
console.log(status); // "Staking" or "NotStaking"
```

### `staking_list_created_block_ids`

List blocks created by this account through staking.

```js
const blocks = await rpc('staking_list_created_block_ids', { account: 0 });
for (const block of blocks) {
  console.log('Block:', block.id, 'at height', block.height, 'pool', block.pool_id);
}
```

---

## VRF Keys

### `staking_new_vrf_public_key`

Generate a new VRF public key for this account. Under normal circumstances this is done automatically when creating a pool.

```js
const result = await rpc('staking_new_vrf_public_key', { account: 0 });
console.log('VRF key:', result.vrf_public_key);
```

### `staking_show_vrf_public_keys`

List all VRF public keys associated with the account.

```js
const result = await rpc('staking_show_vrf_public_keys', { account: 0 });
console.log(result);
```

### `staking_show_legacy_vrf_key`

Show the legacy VRF key, if any.

```js
const result = await rpc('staking_show_legacy_vrf_key', { account: 0 });
```

---

## Delegations

### `delegation_create`

Create a delegation to a pool. The `address` parameter is the owner, the key authorized to withdraw from the delegation.

```js
const result = await rpc('delegation_create', {
  account: 0,
  address: '<owner_address>',
  pool_id: '<pool_id>',
  options: { in_top_x_mb: null, broadcast_to_mempool: true },
});
console.log('Delegation id:', result.delegation_id);
console.log('Tx:', result.tx_id);
```

### `delegation_stake`

Send coins to a delegation id to begin staking them.

```js
const result = await rpc('delegation_stake', {
  account: 0,
  amount: { decimal: '1000' },
  delegation_id: '<delegation_id>',
  options: { in_top_x_mb: null, broadcast_to_mempool: true },
});
console.log('Stake tx:', result.tx_id);
```

### `delegation_withdraw`

Withdraw coins from a delegation. Withdrawn coins have a lock period before they become spendable.

```js
const result = await rpc('delegation_withdraw', {
  account: 0,
  address: '<destination_address>',
  amount: { decimal: '500' },
  delegation_id: '<delegation_id>',
  options: { in_top_x_mb: null, broadcast_to_mempool: true },
});
console.log('Withdraw tx:', result.tx_id);
```

### `delegation_list_ids`

List delegation ids controlled by the account with their balances.

```js
const delegations = await rpc('delegation_list_ids', { account: 0 });
for (const d of delegations) {
  console.log('Delegation:', d.delegation_id, 'Pool:', d.pool_id, 'Balance:', d.balance.decimal);
}
```

### `staking_sweep_delegation`

Sweep the entire balance of a delegation to an address in one operation.

```js
const result = await rpc('staking_sweep_delegation', {
  account: 0,
  destination_address: '<destination_address>',
  delegation_id: '<delegation_id>',
  options: { in_top_x_mb: null, broadcast_to_mempool: true },
});
console.log('Sweep tx:', result.tx_id);
```

---

## Quick Reference

```js
// Full staking setup flow
const pool = await rpc('staking_create_pool', {
  account: 0,
  amount: { decimal: '40000' },
  cost_per_block: { decimal: '1' },
  margin_ratio_per_thousand: '5%',
  decommission_address: '<decommission_address>',
  staker_address: null, vrf_public_key: null,
  options: { broadcast_to_mempool: true },
});

await rpc('staking_start', { account: 0 });
const status = await rpc('staking_status', { account: 0 }); // "Staking"

// Self-delegate to access rewards without decommissioning
const delegation = await rpc('delegation_create', {
  account: 0, address: '<my_address>', pool_id: pool.tx_id,
  options: { broadcast_to_mempool: true },
});
await rpc('delegation_stake', {
  account: 0, amount: { decimal: '1000' },
  delegation_id: delegation.delegation_id,
  options: { broadcast_to_mempool: true },
});
```

---

## Related Pages

- [Guide: Managing a Staking Pool](../../guides/managing-a-staking-pool.md)
- [Wallet RPC: Transactions](transactions.md)
- [Wallet RPC: Overview](overview.md)
