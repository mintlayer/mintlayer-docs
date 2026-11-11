---
title: "Upgrading from v1.4.0 to v1.4.1"
description: "PoS seal indexing infrastructure and the standalone wallet command rescan fix."
sidebar_position: 6
---

This page covers upgrading from Mintlayer v1.4.0 to v1.4.1. There are no consensus forks, no storage version changes, and no resync required.

## PoS seal indexing

Added PoS seal indexing infrastructure: duplicate-proof evidence storage for block seals. It is active by default; a chainstate configuration option can disable it. No action is needed for standard setups.

## Wallet: standalone command rescan fix

Fixed an issue where `standalone-add-watch-only-address`, `standalone-add-private-key-from-hex`, and `standalone-add-multisig` (and the corresponding RPC methods) would reset the wallet to genesis but never perform the announced rescan; the rescan is now done before the command returns.

Previously, in `wallet-cli` non-interactive mode the process would exit before the background rescan could run, leaving the wallet stuck at genesis so that every subsequent wallet open had to rescan the whole blockchain. After upgrading, wallets that were left in that state rescan on the next open as usual and then behave normally.

## Changelogs

- [Core v1.4.1](https://github.com/mintlayer/mintlayer-core/blob/master/CHANGELOG.md#141---2026-09-25)

Next release: [Upgrading from v1.4.1 to v1.4.4](upgrading-from-v1.4.1-to-v1.4.4.md).
