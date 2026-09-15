---
title: "Account Providers"
description: "Account providers in the Mintlayer JavaScript SDK: Mojito wallet, private keys, mnemonic seeds, and custom implementations."
sidebar_position: 3
---

# Account Providers

An `AccountProvider` decides **where addresses come from** and **who signs**. The `Client` is agnostic: swap the provider and the same application code runs against the Mojito extension in a browser or against raw keys in a Node.js script.

```ts
interface AccountProvider {
  connect(): Promise<Address>;
  restore(): Promise<Address>;
  disconnect(): Promise<void>;
  request(method: string, params: any): Promise<any>;
}
```

`connect()` and `restore()` return the account's addresses; `request(method, params)` is the signing and query channel; for the Mojito provider it forwards to the wallet extension, which asks the user for approval.

## MojitoAccountProvider (default)

The default provider talks to the [Mojito Wallet](../../../wallet/mojito-wallet.md) browser extension through the `window.mojito` injection API (see [Mojito Inject](../../mojito-inject.md)). Signing requires user approval; keys never leave the wallet.

```ts
import { Client, MojitoAccountProvider } from '@mintlayer/sdk';

// Implicit (the default):
const client = await Client.create({ network: 'testnet' });

// Explicit:
const client = await Client.create({
  network: 'testnet',
  accountProvider: new MojitoAccountProvider(),
});
```

## PrivateKeyAccountProvider

A standalone provider backed by explicit addresses and private keys. Suitable for Node.js scripts, tests, and faucets where the wallet extension is not available. Signing is performed locally with the [`Signer`](transactions.md#signing-with-the-signer-class).

```ts
import { Client, PrivateKeyAccountProvider } from '@mintlayer/sdk';

const provider = new PrivateKeyAccountProvider(
  {
    receiving: ['tmt1q...'],
    change: ['tmt1q...'],
  },
  {
    'tmt1q...': new Uint8Array([...]), // raw private-key bytes, keyed by address
  },
  'testnet',
);

const client = await Client.create({ network: 'testnet', accountProvider: provider });
```

:::danger

Private keys handled by this provider live in your process memory. Use dedicated test wallets outside of testing, and never hard-code keys in source control.

:::

## MnemonicAccountProvider

Derives addresses and keys from a BIP39 seed phrase, so you can drive the SDK from the same phrase your wallet uses.

```ts
import { Client, MnemonicAccountProvider } from '@mintlayer/sdk';

const provider = new MnemonicAccountProvider(
  'word1 word2 ... word12',
  'testnet',
  { receivingAddressCount: 5, changeAddressCount: 2 },
);

const client = await Client.create({ network: 'testnet', accountProvider: provider });
```

Derivation follows the Mintlayer paths: `44'/<coin type>'/0'/0/<index>` for receiving and `44'/<coin type>'/0'/1/<index>` for change addresses. By default one receiving and one change address are derived; increase the counts with the options above.

## Custom providers

Implement `AccountProvider` to plug in anything else, a hardware wallet bridge, a remote signing service, or an in-memory account for tests:

```ts
import { Client, Signer, type AccountProvider } from '@mintlayer/sdk';

class MyAccountProvider implements AccountProvider {
  async connect() {
    return addresses; // your addresses
  }

  async restore() {
    return addresses;
  }

  async disconnect() {}

  async request(method: string, params: any) {
    if (method === 'signTransaction') {
      const signer = new Signer(privateKeys);
      return signer.sign(params.txData);
    }
    throw new Error(`Method ${method} not implemented`);
  }
}

const client = await Client.create({
  network: 'testnet',
  autoRestore: false,
  accountProvider: new MyAccountProvider(),
});
```

The `request` contract is simple: the client sends `signTransaction` with the transaction data and expects the signed transaction back. Any additional methods are up to you.

## Choosing a provider

| Provider | Environment | Keys live | Best for |
| -------- | ----------- | --------- | -------- |
| `MojitoAccountProvider` | Browser | Wallet extension | dApps; user-approvals for every signature |
| `PrivateKeyAccountProvider` | Node.js, tests | Your process | Faucets, scripts, CI |
| `MnemonicAccountProvider` | Node.js, tests | Your process | Seed-phrase-based bots and tooling |
| Custom | Any | Your choice | Hardware wallets, remote signers, custodial setups |
