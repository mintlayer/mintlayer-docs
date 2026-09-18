---
title: "Wallet State"
description: "WalletState in the Mintlayer JavaScript SDK: derive UTXOs, balances, and transaction history for bots and scanners from any sync source."
sidebar_position: 9
---

# Wallet State

`WalletState` is a headless, storage-agnostic wallet engine. It keeps a wallet-relevant transaction log and derives from it the UTXO set, balances, and spendability, without performing any network or disk access itself. You own syncing, persistence, signing, and broadcasting; `WalletState` owns the bookkeeping.

Use it for bots, scanners, and backend services that track accounts on their own instead of relying on the Mojito extension. A simple pairing: sync with the [API](../../../api/index.md), track state with `WalletState`, sign with the [`Signer`](transactions.md#signing-with-the-signer-class).

## Creating a WalletState

```ts
import { WalletState, createMemoryWalletTxStore } from '@mintlayer/sdk';

const store = createMemoryWalletTxStore(); // or IndexedDB, SQLite, Postgres, ...

const wallet = await WalletState.create({
  accountId: 'main',
  store,
  isMineOutput: (output) => myAddressSet.has(output?.destination_addresses?.[0]),
});
```

| Option | Description |
| ------ | ----------- |
| `accountId` | Key under which this account's transactions and cursor are stored |
| `store` | `WalletTxStore` implementation (persistence adapter) |
| `isMineOutput` | Predicate deciding whether an output belongs to this wallet |

The `isMineOutput` predicate keeps the model account-agnostic: a bot can check a fixed address set, while a full wallet can use derived addresses or xpub metadata.

## Storage adapter

Implement `WalletTxStore` to plug in any storage engine:

```ts
interface WalletTxStore {
  getTransactions(accountId: string): Promise<WalletTx[]>;
  putTransaction(accountId: string, tx: WalletTx): Promise<void>;
  removeTransaction?(accountId: string, txId: string): Promise<void>;
  getCursor(accountId: string): Promise<SyncCursor | null>;
  setCursor(accountId: string, cursor: SyncCursor): Promise<void>;
}
```

`createMemoryWalletTxStore()` provides an in-memory store for tests and examples. The cursor (`{ height, blockHash }`) records how far your sync layer has progressed; `WalletState` stores and forwards it but never fetches blocks itself.

## Applying transactions

Transactions enter the log through three entry points:

```ts
// A transaction created locally: inputs are reserved immediately
// as spent_pending so you cannot double-spend them while broadcasting.
await wallet.applyLocalTx(txJson);

// Observed or accepted in mempool (call after successful broadcast).
await wallet.applyMempoolTx(txJson);

// Broadcast or policy rejected: inputs are released for rebuilding.
await wallet.markBroadcastRejected(txId, { reason: 'mempool full' });
```

## Syncing

`applySyncDiff` is the main integration point for your scanner or network layer. It can add wallet-relevant transactions, confirm pending ones, mark conflicts, and mark outputs spent:

```ts
await wallet.applySyncDiff({
  fromCursor: lastCursor,
  toCursor: { height: 12345, blockHash: '0x...' },
  transactions: [...],      // wallet-relevant transactions in these blocks
  spent: [...],             // outpoints spent in these blocks
  confirmedTxIds: [...],    // local/mempool transactions now confirmed
  conflictedTxIds: [...],
});
```

On chain rollback, orphan everything above the fork point:

```ts
await wallet.rollbackTo({ height: 12340, blockHash: '0x...' });
```

`reload()` re-reads all transactions from the store; call it when another process may have written to the same storage.

## Reading state

```ts
wallet.getUtxos();                 // owned UTXOs (spent/conflicted hidden by default)
wallet.getSpendableUtxos();        // spendable under a SpendPolicy
wallet.getBalance();               // { coin: { atoms }, tokens: { [id]: { atoms } } }
```

Balances are reported in atoms (strings) to avoid floating-point precision loss. Filters control what the views include:

```ts
wallet.getUtxos({ includeUnconfirmed: true });
wallet.getSpendableUtxos({ allowUnconfirmed: true, allowOwnChangeOnly: true });
```

The default `SpendPolicy` only spends confirmed outputs. With `allowUnconfirmed` enabled, `allowOwnChangeOnly` (default `true`) limits unconfirmed spending to the wallet's own change, and `maxUnconfirmedChainDepth` caps unconfirmed parent-chain depth.

## Transaction lifecycle

Every entry in the log carries a state:

| State | Meaning |
| ----- | ------- |
| `local` | Created by the wallet, not yet known to be accepted |
| `mempool` | Broadcast or observed as unconfirmed |
| `confirmed` | Included in the chain (with confirmation count and block info) |
| `rejected` | Broadcast or policy failure; inputs released, `rebuildRequired` may be set |
| `conflicted` / `orphaned` | Lost a conflict, or orphaned by a rollback |

Rejected transactions stop reserving their inputs, and anything spending a rejected output is rejected as well, so you can rebuild from valid base UTXOs.
