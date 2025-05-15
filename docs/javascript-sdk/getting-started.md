---
id: sdk-client
title: Mintlayer SDK Client
sidebar_label: SDK Client
---

# Mintlayer SDK Client

The Mintlayer SDK provides a `Client` class that offers a high-level interface for interacting with the Mojito wallet extension.

> 🧩 This SDK is meant to be used inside decentralized applications (dApps) that want to integrate Mintlayer features like sending transactions, minting tokens, issuing NFTs, staking, and more.

---

## Installation

```bash
npm install @mintlayer/sdk
```

## Getting Started

```ts
import { Client } from '@mintlayer/sdk';

const client = await Client.create({ network: 'testnet' });
```

