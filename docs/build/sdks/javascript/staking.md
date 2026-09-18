---
title: "Staking"
description: "Staking with the Mintlayer JavaScript SDK: creating delegations, staking to pools, withdrawing, and querying delegation state."
sidebar_position: 7
---

# Staking

Staking on Mintlayer works through **delegations**: you create a delegation ID pointing at a stake pool, stake coins to it, and withdraw rewards later. The pool itself is operated by a staker; the pool-operator workflow is covered in [Staking and Delegation (SDK)](../../../guides/javascript/staking.md) (Go SDK) and in the [wallet-cli staking guide](../../../guides/cli/managing-a-staking-pool.md).

The SDK's `Client` covers the delegator side. Every method also has a `buildX` variant that returns an unsigned transaction; see [Transactions](transactions.md#manual-building).

## Creating a delegation

```ts
const signedTx = await client.delegationCreate({
  pool_id: 'sp1...',       // stake pool to delegate to
  destination: 'tmt1q...', // address that will own the delegation
});
```

This registers a new delegation ID owned by `destination`. Staking happens against this ID (or directly against the pool ID).

## Staking

```ts
const signedTx = await client.delegationStake({
  pool_id: 'sp1...',
  amount: 100,
});
```

Pass `delegation_id` instead of `pool_id` to stake through an existing delegation:

```ts
await client.delegationStake({ delegation_id: 'd1...', amount: 100 });
```

## Querying delegations

```ts
const delegations = await client.getDelegations();
const total = await client.getDelegationsTotal();
```

`getDelegations` returns the delegations owned by the connected addresses, including their balances; `getDelegationsTotal` returns the sum.

## Withdrawing

```ts
const signedTx = await client.delegationWithdraw({
  delegation_id: 'd1...',
  amount: 50,
});
```

As with staking, `pool_id` may be passed instead of `delegation_id`. Withdrawn coins are sent back to the owning account.

## Example: stake to a pool

```ts
import { Client } from '@mintlayer/sdk';

const client = await Client.create({ network: 'testnet' });
await client.connect();

// 1. Create a delegation for the chosen pool
await client.delegationCreate({
  pool_id: 'sp1...',
  destination: client.getAddresses().receiving[0],
});

// 2. Stake to it
const [delegation] = await client.getDelegations();
await client.delegationStake({ delegation_id: delegation.delegation_id, amount: 100 });

// 3. Later: withdraw rewards
const total = await client.getDelegationsTotal();
```

For server-side automation (staking in the background without a browser), the same calls work with a [standalone account provider](account-providers.md#mnemonicaccountprovider); for the wallet-daemon equivalent see [Staking with the Wallet RPC](../../../wallet/rpc/staking.md).
