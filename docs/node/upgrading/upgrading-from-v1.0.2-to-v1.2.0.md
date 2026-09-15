---
title: "Upgrading from v1.0.2 to v1.2.0"
sidebar_position: 3
---

In v1.2.0 a hardfork is scheduled on Mainnet, which is expected to happen around January 20-21, 2026
(block #517700), so it's important to update before that date.

## About the fork

The gist of the fork is described [here](https://github.com/mintlayer/mintlayer-core/blob/master/CHANGELOG.md#120---2025-10-27).

(Note: the difference between v1.1.0 and v1.2.0 is only in the fact that the fork was scheduled on Mainnet.)

In short, after the fork:
1. Transactions that fill or conclude an order will be created differently. Also, to create such
   a transaction, additional info is required - the initial and the current balances of the order.
2. Transactions that decommission a pool will be created differently. Also, to create such a
   transaction, additional info is required - the current staker's balance.
3. Transactions that issue a new token may need to generate the id of the new token differently.

(The final change, related to staker's destination in `ProduceBlockFromStake`, only applies to hypothetical node operators
who run a pool using 3rd-party software, which doesn't exist at the moment.)

## WASM bindings

As a result of 1-3, some functions in the WASM bindings gained an additional parameter -
`current_block_height`, which must be the height of the block into which the corresponding
transaction is supposed to be included.

Some other functions gained yet another additional parameter - `additional_info`, which must
contain the info about the corresponding order or pool (and if the transaction doesn't
fill/conclude an order or decommission a pool, then `additional_info` should be empty).

E.g. `encode_witness` is one of those functions.

The full changelog for the WASM bindings is [here](https://github.com/mintlayer/mintlayer-core/blob/master/wasm-wrappers/CHANGELOG.md#110---2025-08-21).

For more details about the new functions and parameters, build the bindings and look at doc
comments inside the generated `wasm_wrappers.d.ts`.

## API server

There were a number of changes in the API server, but they all are backward-compatible
(except for one case - the returned info about a `FillOrder` input no longer includes `destination`,
but this was useless anyway).

The full changelog for the API server can be found [here](https://github.com/mintlayer/mintlayer-core/blob/master/api-server/CHANGELOG.md#110---2025-08-21).

## Wallet RPC

No notable changes here.

Note however that when creating a transaction that can be affected by the fork (i.e. order fill/conclude,
pool decommissioning, token issuance), the wallet will have to guess the height of the block into
which the transaction will be included and it will use "best block height plus one" for that.\
If it guesses wrong and the guessed height appears at the other side of the fork, the produced
transaction will be rejected by the network.

## Final notes

- In general, it's better to avoid creating transactions that can be affected by the fork when the fork
height is near.

  But, as mentioned above, most of the transactions (in particular, simple transfers) won't be affected.

- The storage versions of both the node's chainstate db and the API server db were changed
(in v1.1.0), so full node resync and full API server resync will happen after the upgrade.
