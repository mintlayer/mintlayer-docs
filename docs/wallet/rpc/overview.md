---
title: "Wallet RPC: Overview"
sidebar_position: 3
---

The Mintlayer wallet exposes a JSON-RPC 2.0 interface that allows programmatic control of the wallet, generating addresses, querying balances, submitting transactions, managing staking pools, and more.

The RPC interface is provided by `wallet-rpc-daemon` (headless) or by `wallet-cli` when started with `--enable-wallet-rpc-interface`.

## Connection

Both HTTP and WebSocket are served on the **same port**:

| Network | Default port |
|---|---|
| Mainnet | 3034 |
| Testnet | 13034 |

WebSocket is a superset of HTTP: it supports all RPC methods plus real-time event subscriptions.

## Protocol

All calls use the **JSON-RPC 2.0** format:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "method_name",
  "params": { ... }
}
```

## JavaScript Helper

The examples throughout this documentation use the following helper:

```js
async function rpc(method, params = {}, { host = '127.0.0.1', port = 3034 } = {}) {
  const res = await fetch(`http://${host}:${port}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const json = await res.json();
  if (json.error) throw new Error(`RPC error ${json.error.code}: ${json.error.message}`);
  return json.result;
}
```

For testnet, pass `{ port: 13034 }` as the third argument. If authentication is enabled, add credentials to the URL: `http://user:pass@127.0.0.1:3034`.

### Example: get node version

```js
const result = await rpc('node_version');
console.log(result.version);
```

## Value Representations

| Type | Format |
|---|---|
| Addresses, pool ids, delegation ids, token ids | bech32 string |
| Account id | hex string |
| Coin / token amounts | Object with `atoms` (integer string) and `decimal` (decimal string) |
| Block ids, transaction ids | hex string |

Amounts can be specified as either:
```json
{ "atoms": "100000000000" }
```
or:
```json
{ "decimal": "1.0" }
```

## Modules

The RPC is split into two modules:

- **`WalletRpc`**, All methods available in hot wallet mode (node connected).
- **`ColdWalletRpc`**, Subset of methods available in cold wallet mode (no node connection needed). Includes wallet/account management, address generation, signing, and key management.

## Authentication

By default the RPC has no authentication. To enable it, start the daemon with `--rpc-username` and `--rpc-password`. Credentials are passed as HTTP Basic Auth in the URL.

## Pages in This Section

- [Wallet Management](wallet-management.md), Create, open, close wallets; manage accounts, addresses, encryption
- [Transactions](transactions.md), Send, compose, inspect, and list transactions
- [Staking](staking.md), Create and manage pools and delegations
- [Tokens](tokens.md), Issue and manage fungible tokens and NFTs
- [Events](events.md), WebSocket event subscriptions

## Related Pages

- [Wallet RPC Daemon](index.md), How to run the daemon
- [Wallet CLI Options](../cli/index.md), `--enable-wallet-rpc-interface` and related flags
