---
title: "Upgrading Mintlayer"
description: "How to upgrade a Mintlayer node: binaries, source, and Docker Compose, plus what to do before and after the upgrade."
sidebar_position: 1
---

# Upgrading Mintlayer

Upgrading your Mintlayer node is straightforward. The node handles any necessary data migrations (such as wallet file upgrades) automatically on first launch.

**Always back up your wallet file before upgrading.**

## Before you upgrade

1. **Back up your wallet file** and seed phrase.
2. **Check the version-specific guides** below: some releases contain breaking changes (RPC renames, option moves, forks) or require a resync.
3. **Check the target version** on [mintlayer.org/download](https://www.mintlayer.org/download/) or the [release tags](https://github.com/mintlayer/mintlayer-core/tags).

## Upgrading from binaries (recommended)

1. Stop the running node and wallet.
2. Download the new binaries from [mintlayer.org/download](https://www.mintlayer.org/download/). Use the filters to select your operating system, architecture, and package type (ZIP, DEB, RPM, DMG, EXE, TAR.GZ).
3. Replace the old binaries with the new ones.
4. Start the node again.

The node automatically applies any required upgrades to its data on startup.

## Upgrading with Docker Compose

If you run the node with one of the [Docker Compose setups](../../getting-started/install/install-from-docker.md):

1. Stop and back up as above (the chainstate and wallet data live in the `./mintlayer-data` directory, which persists across container replacement).
2. Pull the new images:

   ```bash
   docker compose pull
   ```

3. Recreate the services with the new images:

   ```bash
   docker compose up -d
   ```

**Pull all images together.** Docker never re-pulls an image that already exists locally, so mixing an old `node-daemon:latest` with a newer `wallet-cli:latest` can break the setup. A plain `docker compose pull` before `up -d` avoids this.

If you run the [one-command installer stack](../../getting-started/install/install-web-gui.md) from get.mintlayer.org, the same flow applies: it is a Docker Compose stack, so `docker compose pull && docker compose up -d` in its directory upgrades the whole stack while the `mintlayer-data` directory keeps node and wallet state.

## Upgrading from source

```bash
git fetch --all --tags
git checkout tags/<latest_tag>
cargo build --release --bin node-daemon --bin wallet-cli --bin wallet-rpc-daemon
```

Replace `<latest_tag>` with the desired release tag (e.g. `v1.4.0`). The binaries are written to `target/release/`; replace your deployed copies with the newly built ones and restart the node.

## Verify the upgrade

After starting the new version:

- Check the reported version: `node_version` over [RPC](../node-rpc.md), or `version` inside wallet-cli.
- Confirm the node is syncing (or already at the chain tip): `chainstate_info` over RPC, or watch the logs.
- If you run an API server, verify it serves data (`GET /api/v2/chain/tip`); note that some releases bump the indexer storage version, which triggers an automatic full resync on first launch.

## Version-specific guides

Some releases include breaking changes or forks that need attention:

| Guide | Covers |
| ----- | ------ |
| [Upgrading to v1.0.0](upgrading-to-version-1.0.0.md) | v1.0.0 breaking changes |
| [Upgrading from v1.0.2 to v1.2.0](upgrading-from-v1.0.2-to-v1.2.0.md) | Mainnet fork at height 517700 (Orders V1, token id generation, input commitments V1), WASM binding changes, full resync |
| [Upgrading from v1.2.0 to v1.3.1](upgrading-from-v1.2.0-to-v1.3.1.md) | Wallet RPC renames, `--clean-data` option move, bootstrap format, PST format, API server full resync |
| [Upgrading from v1.3.1 to v1.4.0](upgrading-from-v1.3.1-to-v1.4.0.md) | Soft fork (token metadata URI and zero-amount rules), mempool ordering and cluster limits, Ledger support |

## Need help?

If you run into issues, open an [issue](https://github.com/mintlayer/mintlayer-core/issues/new) on mintlayer-core.
