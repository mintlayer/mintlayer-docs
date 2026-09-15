---
title: "SDK Client"
description: "The Client class of the Mintlayer JavaScript SDK: creation options, connection lifecycle, network handling, and account queries."
sidebar_label: SDK Client
sidebar_position: 2
---

# SDK Client

The `Client` class offers a high-level interface for interacting with the [Mojito wallet](../../../wallet/mojito-wallet.md) extension — or with any other [account provider](account-providers.md). It covers the connection lifecycle, account queries, and one method per transaction type (see [Transactions](transactions.md)).

> 🧩 This SDK is meant to be used inside decentralized applications (dApps) that want to integrate Mintlayer features like sending transactions, minting tokens, issuing NFTs, staking, and more.

## Installation

```bash
npm install @mintlayer/sdk
```

## Creating a client

Use the async `Client.create` factory, which initializes the client and is the recommended entry point:

```ts
import { Client } from '@mintlayer/sdk';

const client = await Client.create({
  network: 'testnet',
  autoRestore: true,
  // accountProvider?: AccountProvider  — defaults to MojitoAccountProvider
  // apiProvider?: ApiProvider          — defaults to MintlayerApiProvider
});
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `network` | `'mainnet' \| 'testnet'` | `'mainnet'` | Chain the client operates on |
| `autoRestore` | `boolean` | `true` | Try to restore a previous wallet session on creation |
| `accountProvider` | `AccountProvider` | `MojitoAccountProvider` | [Provider](account-providers.md) that supplies addresses and signing |
| `apiProvider` | `ApiProvider` | `MintlayerApiProvider` | [Chain-data backend](#chain-data) for UTXOs, fees, and queries |

You can also construct the client directly with `new Client(options)` and initialize it yourself; `Client.create` is almost always what you want.

## Connection lifecycle

```ts
const addresses = await client.connect();   // prompt the user; returns connected addresses
const ok = await client.restore();          // re-attach to an existing session
const connected = client.isConnected();     // boolean
await client.disconnect();                  // clear connected addresses
```

- `connect()` asks the wallet for access and stores the returned addresses. With Mojito this opens the extension's approval prompt.
- `restore()` resumes a previously approved session without prompting the user again. When `autoRestore` is enabled this happens during `Client.create`, so returning users are connected automatically.
- `disconnect()` clears the local session state.

Connected addresses are split into receiving and change chains:

```ts
const { receiving, change } = client.getAddresses();
```

## Network

```ts
client.getNetwork();      // 'mainnet' | 'testnet'
client.setNetwork('mainnet');
```

The network must match the network the wallet is configured for; transactions built for the wrong network are rejected on signing.

## Events

```ts
client.on('accountsChanged', (data) => {
  // re-read client.getAddresses() or force a reconnect
});
```

`on(eventName, callback)` registers a listener for wallet events forwarded by the account provider, such as account or network changes in the extension. See [Mojito Inject](../../mojito-inject.md) for the underlying event model.

## Account queries

Once connected, the client exposes read helpers for the connected addresses. They resolve chain data through the configured `ApiProvider`.

| Method | Returns |
| ------ | ------- |
| `getBalance()` | Base-coin balance of the connected addresses |
| `getBalances()` | `{ coin, token: Record<tokenId, number> }` — coin and per-token balances |
| `getDelegations()` | Delegation details for the connected addresses |
| `getDelegationsTotal()` | Total delegated amount |
| `getTokensOwned()` | Token IDs owned by the connected addresses |
| `getAccountOrders()` | Trading orders created by this account |
| `getAvailableOrders()` | Trading orders available on the network |
| `getXPub()` | Extended public key from the wallet |

:::warning

`getXPub()` exposes the extended public key, from which all addresses can be derived. Only request it when you really need it, and never ask for it without telling the user why.

:::

Staking-specific helpers are covered in [Staking](staking.md), token operations in [Tokens](tokens.md).

## Chain data

The default `MintlayerApiProvider` points at the public Mintlayer API and implements the `ApiProvider` interface: chain tip, address lookups, delegations, tokens, orders, transactions, UTXO fetching, and broadcasting. To run against your own indexer, construct it with your base URLs:

```ts
import { Client, MintlayerApiProvider } from '@mintlayer/sdk';

const apiProvider = new MintlayerApiProvider('https://api.example.com', 'https://batch.example.com');

const client = await Client.create({ network: 'testnet', apiProvider });
```

The endpoints mirror the public [API reference](../../../api/index.md), so self-hosting the [API web server](../../../getting-started/install/install-from-docker.md#running-the-api-server-stack) gives you a fully local stack.

## Signing without a wallet

Everything the `Client` does through the account provider can also be done with explicit keys via the `Signer` class — see [Transactions](transactions.md#signing-with-the-signer-class). For bots and scanners that need balances derived from chain data, see [Wallet state](wallet-state.md).
