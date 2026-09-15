---
title: "Installing Mintlayer"
description: "Overview of all Mintlayer installation methods: one-command installer, native packages, binaries, Docker, and building from source."
sidebar_position: 1
---

# Installing Mintlayer

Mintlayer offers multiple installation methods, from a one-command Docker stack to building the latest code from source. All methods install the same core software; pick the one that matches your platform and how you want to operate it.

## Which method should I choose?

| Method | What you get | Best for | Notes |
| ------ | ------------ | -------- | ----- |
| [One-command installer](install-web-gui.md) | Node + wallet daemon + web GUI in Docker | Non-technical users who want everything running with minimal setup | *(Experimental)* Linux and macOS |
| [Native packages](install-from-binaries.md#native-linux-packages-debrpm) | `deb` / `rpm` packages with systemd integration | Linux servers and desktops (Debian/Ubuntu, Fedora/RHEL) | From v1.4.1 |
| [Binaries](install-from-binaries.md) | Standalone executables (tar.gz, deb, rpm, dmg, zip, exe) | Any platform, manual control over each service | |
| [Docker](install-from-docker.md) | Containerized services via `docker compose` | Servers, headless setups, staking in the background | |
| [From source](install-from-source.md) | Locally built binaries from the latest code | Developers and advanced users | Advanced |
| [From source on Windows](install-from-source-on-windows.md) | Windows build instructions | Windows developers | Advanced |

## Installation methods

### 1. [One-command installer (Web GUI)](install-web-gui.md)

The quickest way to a full working stack: node, wallet daemon, and web interface deployed in Docker by a single command via [get.mintlayer.org](https://get.mintlayer.org), with an interactive setup wizard. *(Experimental)*

### 2. [Install from binaries](install-from-binaries.md)

Pre-built executables for Linux, macOS, and Windows, downloaded from the [official download page](https://www.mintlayer.org/download/). On Linux, from version 1.4.1 the `deb` and `rpm` artifacts are proper native packages with systemd units, a `mintlayer` system user, and man pages; see [Native Linux packages](install-from-binaries.md#native-linux-packages-debrpm).

### 3. [Install from Docker](install-from-docker.md)

Run individual services (`node-daemon`, `wallet-cli`, `wallet-rpc-daemon`, the API server stack) as containers with Docker Compose. The recommended approach for running a staking wallet in the background.

### 4. [Install from source](install-from-source.md)

Build the binaries yourself from the [mintlayer-core](https://github.com/mintlayer/mintlayer-core) repository. Gives you the latest code, but requires a Rust toolchain. *(Advanced)*

### 5. [Install from source on Windows](install-from-source-on-windows.md)

Windows-specific build instructions, since there are no native source-build shortcuts on that platform. *(Advanced)*

## After installation

Once the software is installed, follow the [Getting Started](../index.md) guide to run a node and set up a wallet, or jump straight to the [Node](../../node/index.md) and [Wallet](../../wallet/cli/index.md) documentation.
