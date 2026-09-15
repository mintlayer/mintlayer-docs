---
title: "Upgrading from v1.3.1 to v1.4.0"
sidebar_position: 5
---

This page covers upgrading from Mintlayer v1.3.x to v1.4.0. This release is less disruptive than v1.3.0: no storage version changes, no API server changes, and no resync required.

## Consensus tightening (soft fork)

v1.4.0 tightens certain consensus rules, activated via a soft fork:

- Token metadata URIs can no longer contain arbitrary characters (the same restrictions as at token creation now apply to metadata URI updates).
- Transferring or burning a zero amount of a token is no longer allowed.

The testnet fork height is set to **787640**. The mainnet fork height is yet to be decided. If you issue or manage tokens, make sure your tooling complies with the new URI restrictions before the fork activates on your network.

## Node RPC: mempool_transactions ordering

The `mempool_transactions` method now returns transactions in the order in which they were originally inserted into the mempool, rather than sorting them by descendant score. Update any consumers that relied on the previous ordering.

## Mempool cluster limits

The mempool now enforces limits on transaction clusters (a cluster is a set of unconfirmed transactions that depend on each other). Transactions that would form a cluster exceeding the limits are rejected:

- Default: max 64 transactions, max 100,000 bytes total per cluster.

If your service submits chains of many dependent transactions (e.g. batched token management operations), check the new limits and consider tuning:

- New node options: `--mempool-max-cluster-transaction-count`, `--mempool-max-cluster-size-bytes`.
- New RPC method: `mempool_get_config`, returning the current mempool configuration.

## Ledger hardware wallet support (beta)

- `wallet-create`, `wallet-recover`, and `wallet-open` accept a new `ledger` subcommand alongside the existing `software` and `trezor`.
- Wallet RPC: the `hardware_wallet` option of `wallet_create`, `wallet_recover`, and `wallet_open` accepts the new value `ledger`.

## P2P and mempool behavior notes

These changes are transparent for most setups, but worth knowing:

- Local transactions that were announced but never sent to any peer are re-announced after a few minutes.
- Re-adding an existing relayable transaction to the mempool triggers a re-announcement.
- Transactions are announced in batches at irregular intervals (previously each announcement had an individual random delay).
- The number of pending inbound connections is now limited.

## Changelogs

- [Core v1.4.0](https://github.com/mintlayer/mintlayer-core/blob/master/CHANGELOG.md#140---2026-07-09)
