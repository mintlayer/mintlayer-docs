---
title: "Getting Started"
description: "Set up the Mintlayer JavaScript SDK: installation, first call, networks, amounts, error handling, and testing for browser dApps and Node.js scripts."
sidebar_label: Getting Started
sidebar_position: 2
---

# Getting Started

This page covers everything needed to get a project running with `@mintlayer/sdk`: installation, the first call, networks, units, error handling, and testing. The `Client` API itself (connection lifecycle, queries, events) is documented in [SDK Client](client.md).

## Requirements

- **Browser (dApp path)**: a modern browser with the [Mojito Wallet](../../../wallet/mojito-wallet.md) extension installed (the `window.mojito` provider requires extension version 1.4.0 or higher; see [Mojito Inject](../../mojito-inject.md)).
- **Node.js (scripts, bots, tests)**: any recent Node.js; use the standalone [account providers](account-providers.md) instead of the extension.
- TypeScript types ship with the package; no code generation is needed.

## Installation

```bash
npm install @mintlayer/sdk
```

or with yarn:

```bash
yarn add @mintlayer/sdk
```

## First call

Create a client and connect to the wallet:

```ts
import { Client } from '@mintlayer/sdk';

const client = await Client.create({ network: 'testnet' });
await client.connect(); // opens the wallet connection prompt

const balances = await client.getBalances();
console.log(balances);
```

In Node.js, pass a standalone provider so no extension is needed:

```ts
import { Client, MnemonicAccountProvider } from '@mintlayer/sdk';

const client = await Client.create({
  network: 'testnet',
  accountProvider: new MnemonicAccountProvider('word1 word2 ... word12', 'testnet'),
});
await client.connect();
```

## Networks and endpoints

The client's `network` option (`'mainnet'` or `'testnet'`) must match the network the wallet is configured for; transactions built for the wrong network are rejected on signing.

Chain data (UTXO selection, fees, broadcasting) flows through the configured `ApiProvider`, which defaults to the public Mintlayer API. Point it at your own indexer for a self-hosted stack:

```ts
import { MintlayerApiProvider } from '@mintlayer/sdk';

const apiProvider = new MintlayerApiProvider('https://api.example.com', 'https://batch.example.com');
```

The endpoints mirror the public [API reference](../../../api/index.md).

## Amounts

Amounts passed to SDK methods are **human-readable values**; the SDK converts them to atoms internally. For display, use the exported helpers:

```ts
import { atomsToDecimal, decimalsToAtoms } from '@mintlayer/sdk';

atomsToDecimal('100000000', 8);  // '1'
decimalsToAtoms(1, 8);           // 100000000n
```

## Error handling

Every SDK method returns a promise and rejects on failure: connection prompts that are dismissed, requests the wallet denies, transactions the node rejects, and malformed arguments. `verifyChallenge` throws unless the signature is valid, so wrap it like any throwing call. Guard the browser path by checking `window.mojito` before creating the default provider, and show a sensible message when the extension is missing or outdated.

## Testing

Test against **testnet**: get TML from the [faucet](https://faucet.mintlayer.org) (testnet addresses start with `tmt1`), and create the client with `network: 'testnet'`.

- **In Node.js**, use `MnemonicAccountProvider` or `PrivateKeyAccountProvider` so tests run without a browser and without user prompts.
- In the browser, set `autoRestore: false` in tests so a stale wallet session does not silently connect.
- For fully offline unit tests, implement a custom in-memory `AccountProvider` that returns fixed addresses and signs with the `Signer` class (see [Account providers](account-providers.md#custom-providers)).

## Next steps

- [SDK Client](client.md): creation options, connection lifecycle, network, events, queries
- [Account providers](account-providers.md): Mojito, private-key, mnemonic, and custom providers
- [Guides](../../../guides/javascript/index.md): tokens, NFTs, staking, orders, and atomic swaps in code
