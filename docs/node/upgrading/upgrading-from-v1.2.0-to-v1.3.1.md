---
title: "Upgrading from v1.2.0 to v1.3.1"
sidebar_position: 4
---

This page covers upgrading from Mintlayer v1.2.x (including v1.2.1) to v1.3.1. The v1.3.0 release introduced several breaking changes for RPC clients, scripts, and integrations. Review the list below before upgrading. v1.3.1 itself contains bug fixes only.

**Action required: if you run an API server (indexer), a full resync is required after the upgrade** (the storage version was increased).

## Wallet RPC: order method renames (breaking)

The order methods were renamed to match the `order_*` naming used elsewhere:

| Old name (v1.2.0) | New name (v1.3.0+) |
| ----------------- | ------------------ |
| `create_order`    | `order_create`     |
| `conclude_order`  | `order_conclude`   |
| `fill_order`      | `order_fill`       |
| `freeze_order`    | `order_freeze`     |

Update any RPC clients or scripts that call these methods.

Also note: the `extra_info` field returned by `wallet_info` changed structure.

## Wallet CLI: new commands

The following wallet-cli commands were added in v1.3.0 (previously RPC-only or unavailable):

- `order-create`, `order-fill`, `order-freeze`, `order-conclude` (mirroring their RPC counterparts)
- `order-list-own`, `order-list-all-active`
- `utxo-spend`
- `htlc-create-transaction`, `htlc-generate-secret`, `htlc-calc-secret-hash`

## Node daemon: option changes

- **`--clean-data` moved to a top-level option.** Write `node-daemon --clean-data testnet` instead of `node-daemon testnet --clean-data`. Update any service files or scripts that use it.
- The redundant chainstate config option `min_max_bootstrap_import_buffer_sizes` was removed. Remove it from your configuration files if present.
- New options:
  - `--import-bootstrap-file`: import a bootstrap file on start (previously bootstrapping was only available via node RPC).
  - `--enable-db-reckless-mode-in-ibd`: speeds up the chainstate database during initial block download or bootstrapping, at the cost of potential database corruption if the system crashes mid-way. Off by default.

## Node bootstrapping: format change

The bootstrap file format changed and the legacy format is no longer supported. Re-export any bootstrap files you intend to import with the new version.

## Node RPC changes

- `chainstate_pool_decommission_destination` now returns a bech32 string instead of a hexified destination. Update parsers that expected hex.
- New methods: `chainstate_tokens_info`, `chainstate_orders_info_by_currencies`.
- `chainstate_order_info` now also indicates whether the order is frozen, and no longer fails when one of the order balances became zero.

## PartiallySignedTransaction format

The format of `PartiallySignedTransaction` changed (again). If you exchange PST hex between systems or tools, ensure both sides run v1.3.0+. Affected wallet-cli commands and their RPC counterparts: `transaction-compose`, `account-sign-raw-transaction`.

## API server (indexer)

- **Full resync required**: the storage version was increased; on first launch after the upgrade the indexer rebuilds its database from the chain.
- New endpoints:
  - `GET /api/v2/transaction/{id}/output/{idx}`: a single UTXO output of a transaction.
  - `GET /api/v2/token/{id}/transactions`: all transactions related to a token, paginated with `offset` and `items`.
- Behavior change: `GET /api/v2/token/ticker/{ticker}` now returns all tokens whose ticker contains the given ticker as a substring (previously exact matches only).

## Changelogs

- [Core v1.3.0](https://github.com/mintlayer/mintlayer-core/blob/master/CHANGELOG.md#130---2026-04-09)
- [Core v1.3.1](https://github.com/mintlayer/mintlayer-core/blob/master/CHANGELOG.md#131---2026-06-03)
- [API server v1.3.0](https://github.com/mintlayer/mintlayer-core/blob/master/api-server/CHANGELOG.md#130---2026-04-09)
