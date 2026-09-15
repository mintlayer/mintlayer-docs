---
title: "Mojito Wallet"
description: "Mojito is the Mintlayer user wallet, available as a browser extension (Chrome, Firefox) and as a mobile app for iOS and Android."
sidebar_position: 0
---

# Mojito Wallet

[Mojito](https://www.mintlayer.org/wallet) is the user-facing wallet for the Mintlayer ecosystem: a non-custodial wallet where you hold your own keys, available in two form factors:

- **Browser extension** for desktop: Chrome and Firefox
- **Mobile app** for iOS (App Store) and Android (Google Play)

All distribution channels are listed on [mintlayer.org/wallet](https://www.mintlayer.org/wallet).

## What it does

- Stores and sends **BTC, ML, MLS-01 tokens, and NFTs**
- Multiple wallets in one app
- Non-custodial: your keys, your coins. Keys stay on your device
- Connects to dApps through the browser extension (see [Mojito Inject](../build/sdks/javascript/index.md))

## Mojito vs. the wallet daemons

Mojito is built for end users. This documentation also covers the developer-oriented wallet software, which serves different purposes:

| | **Mojito** | **wallet-cli** | **wallet-rpc-daemon** |
| --- | ---------- | -------------- | --------------------- |
| Interface | Mobile app / browser extension | Interactive terminal | JSON-RPC 2.0 |
| Audience | End users | Operators, power users | Services, automation |
| dApp integration | Yes (extension injects `window.mojito`) | No | No |
| Documentation | This page and [Mojito Inject](../build/sdks/javascript/index.md) | [Wallet CLI reference](cli/commands.md) | [Wallet RPC](rpc/overview.md) |

## Building on Mojito

If you are a developer integrating wallets into a dApp:

- The browser extension injects a `window.mojito` provider: see [Mojito Inject](../build/sdks/javascript/index.md)
- The [JavaScript SDK](../build/sdks/javascript/index.md) wraps that provider in a typed `Client`
