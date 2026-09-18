---
title: "Staking and Delegation"
description: "Delegate to a Mintlayer staking pool with the JavaScript SDK: create a delegation, stake, track, and withdraw."
sidebar_position: 4
---

# Staking and Delegation

The JavaScript SDK covers the **delegator** side of staking: creating a delegation to a pool, staking to it, and withdrawing. Running your own pool is covered in the [Go version](../go/staking.md) of this guide; the concepts (pledge, cost per block, margin ratio, delegations) are explained in the wallet-cli guide [Managing a staking pool](../cli/managing-a-staking-pool.md).

The reward split: the staker receives `cost_per_block + margin × (block_reward − cost_per_block)`; delegators split the remainder proportionally.

## Creating a delegation

```ts
await client.delegationCreate({
  pool_id: 'sp1...',       // stake pool to delegate to
  destination: client.getAddresses().receiving[0],
});
```

This registers a new delegation ID owned by `destination`. Staking happens against this ID (or directly against the pool ID).

## Staking

Wait for the delegation-creation transaction to confirm first.

```ts
await client.delegationStake({ delegation_id: 'd1...', amount: 100 });
// or stake straight to a pool id:
await client.delegationStake({ pool_id: 'sp1...', amount: 100 });
```

Multiple stakes accumulate.

## Querying delegations

```ts
const delegations = await client.getDelegations();
const total = await client.getDelegationsTotal();
```

`getDelegations` returns the delegations owned by the connected addresses, including their balances; `getDelegationsTotal` returns the sum.

## Withdrawing

```ts
await client.delegationWithdraw({ delegation_id: 'd1...', amount: 50 });
```

Withdrawn coins arrive after the consensus lock period (see the [FAQ entry on unstaking](../../faq.md#how-long-is-the-waiting-period-when-i-unstake)).

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

Every method above also exists as a `buildX` variant returning an unsigned transaction; see [Transactions](../../build/sdks/javascript/transactions.md#manual-building). For server-side automation without a browser, use a [standalone account provider](../../build/sdks/javascript/account-providers.md#mnemonicaccountprovider); for the wallet-daemon equivalent see [Staking with the Wallet RPC](../../wallet/rpc/staking.md).
