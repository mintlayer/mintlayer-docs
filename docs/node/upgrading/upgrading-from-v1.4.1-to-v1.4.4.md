---
title: "Upgrading from v1.4.1 to v1.4.4"
description: "Orphan pool per-peer quotas, mempool_get_config changes, and dependency security patches."
sidebar_position: 7
---

This page covers upgrading from Mintlayer v1.4.1 to v1.4.4. There are no consensus forks, no storage version changes, and no resync required.

## Orphan pool per-peer quotas

The orphan pool now enforces a per-peer capacity limit for remote orphans:

- Peers reached through outbound connections get a larger orphan quota than inbound peers.
- Eviction honors per-peer reservations, and occupancy is tracked per origin.
- The new quota fields are exposed through the `mempool_get_config` RPC method, so update anything that parses its result strictly.

## Wallet: quota rejections are transient

Remote orphan quota rejections are classified as transient errors instead of permanent failures, so wallets retry instead of treating the submission as failed.

## Security patches

Advisory-exposed dependencies were patched (rustls-webpki, webpki-root-certs, tokio) and the cargo-vet imports refreshed.

## Changelogs

- [Core v1.4.4](https://github.com/mintlayer/mintlayer-core/blob/master/CHANGELOG.md#144---2026-10-31)

Next release: [Upgrading from v1.4.4 to v1.4.5](upgrading-from-v1.4.4-to-v1.4.5.md).
