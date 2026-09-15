---
title: "Transactions"
description: "Building, signing, and broadcasting Mintlayer transactions with the JavaScript SDK: one-call methods, manual building, fees, HTLCs, and message signing."
sidebar_position: 4
---

# Transactions

The SDK offers three layers for working with transactions, from most to least convenient:

1. **One-call methods** — `client.transfer(...)`, `client.issueToken(...)`, and friends: build, sign, and return the signed transaction.
2. **Manual building** — the `buildX(...)` variants and `buildTransaction({ type, params })` return an unsigned `Transaction` you can inspect, sign yourself, and broadcast explicitly.
3. **Low-level signing** — the `Signer` class signs transactions with explicit private keys, independent of any wallet.

## One-call methods

Every supported transaction type has a convenience method that builds the transaction, selects UTXOs, computes the fee, signs via the account provider, and resolves to the signed transaction:

```ts
const signedTx = await client.transfer({
  to: 'tmt1q...',   // recipient address
  amount: 10,       // human-readable units
  // token_id: 'tmltk1...', // optional: omit to send the base coin
});
```

`transfer` sends the base coin when no `token_id` is given, or the specified token when it is. All other methods follow the same pattern and are documented in their respective guides: [Tokens](tokens.md), [Staking](staking.md), and [Orders](orders.md).

## Manual building

Each convenience method has a `buildX` counterpart that stops before signing and returns a `Transaction` object:

```ts
const tx = await client.buildTransfer({
  to: 'tmt1q...',
  amount: 10,
});

// Inspect before signing
console.log(tx.getFee());        // { atoms: '...', decimal: '...' }
console.log(tx.JSONRepresentation);
console.log(tx.HEXRepresentation_unsigned);
```

Or use the generic dispatcher with a transaction `type`:

```ts
const tx = await client.buildTransaction({
  type: 'BurnToken',
  params: {
    amount: 10,
    token_id: 'tmltk1...',
    token_details: {
      authority: 'tmt1q...',
      number_of_decimals: 8,
    },
  },
});
```

Supported types for `buildTransaction`:

| Type | Convenience method |
| ---- | ------------------ |
| `Transfer` | `transfer` / `buildTransfer` |
| `BurnToken` | `burn` / `buildBurn` |
| `IssueFungibleToken` | `issueToken` / `buildIssueToken` |
| `IssueNft` | `issueNft` / `buildIssueNft` |
| `MintToken` | `mintToken` / `buildMintToken` |
| `UnmintToken` | `unmintToken` / `buildUnmintToken` |
| `LockTokenSupply` | `lockTokenSupply` / `buildLockTokenSupply` |
| `ChangeMetadataUri` | `changeMetadataUri` / `buildChangeMetadataUri` |
| `ChangeTokenAuthority` | `changeTokenAuthority` / `buildChangeTokenAuthority` |
| `FreezeToken` | `freezeToken` / `buildFreezeToken` |
| `UnfreezeToken` | `unfreezeToken` / `buildUnfreezeToken` |
| `DataDeposit` | `dataDeposit` / `buildDataDeposit` |
| `CreateDelegationId` | `delegationCreate` / `buildDelegationCreate` |
| `DelegationStake` | `delegationStake` / `buildDelegationStake` |
| `DelegationWithdraw` | `delegationWithdraw` / `buildDelegationWithdraw` |
| `CreateOrder` | `createOrder` / `buildCreateOrder` |
| `ConcludeOrder` | `concludeOrder` / `buildConcludeOrder` |
| `FillOrder` | `fillOrder` / `buildFillOrder` |

## Signing and broadcasting

### Signing with the wallet

`signTransaction` asks the account provider to sign (with Mojito, the user approves in the extension):

```ts
const signedTx = await client.signTransaction(tx); // signed transaction hex
```

### Signing with the Signer class

Since SDK version 1.0.17 the `Signer` class signs transactions locally with explicit private keys — useful with the standalone [account providers](account-providers.md) or on its own:

```ts
import { Signer } from '@mintlayer/sdk';

const signer = new Signer({
  'tmt1qxyz...': new Uint8Array([/* private key bytes */]),
});

const signedTx = await signer.signTransaction(tx); // signed hex, ready to broadcast
```

### Broadcasting

```ts
const response = await client.broadcastTx(signedTx);
```

`broadcastTx` accepts a signed hex string or an object with `hex` and `json`, and submits through the configured `ApiProvider`.

## Fees

```ts
const feeAtoms = client.getFeeForType('Transfer'); // bigint, in atoms
```

The fee of a built transaction is available on the `Transaction` object as `tx.getFee()` (`{ atoms, decimal }`). The SDK selects UTXOs and adds change automatically; use the `buildX` methods when you need to see the fee before signing.

## HTLCs (hash time-locked contracts)

The SDK covers the full HTLC lifecycle used by e.g. the [atomic swap guide](../../guides/atomic-swap.md):

| Method | Purpose |
| ------ | ------- |
| `createHtlc(params)` | Lock funds behind a secret hash and timelock |
| `spendHtlc(params)` | Claim by revealing the secret |
| `refundHtlc(params)` | Refund after the timelock expires |
| `extractHtlcSecret(tx)` | Pull the secret out of a counterparty's spend transaction |
| `requestSecretHash()` | Ask the wallet for a secret hash |

`createHtlc` takes the `amount`, optional `token_id`, a `secret_hash`, the `spend_address`/`spend_pubkey`, a `refund_address`, and the `refund_timelock`.

## Message signing (challenges)

Prove ownership of an address by signing a challenge message, then verify the signature:

```ts
const { message, address, signature } = await client.signChallenge({
  message: 'login-nonce-1234',
});

const valid = await client.verifyChallenge({ message, address, signature });
```

- `signChallenge` signs with the connected account's key; pass an explicit `address` to sign with a different one of the connected addresses.
- `verifyChallenge` throws unless the signature was produced by the key of the given address. The address must be a `pubkeyhash` address.

## Transaction object

The `Transaction` returned by `buildX` methods exposes:

| Member | Description |
| ------ | ----------- |
| `transaction_id` / `getTransactionId()` | Transaction ID |
| `JSONRepresentation` / `json()` | Structured JSON of the transaction |
| `HEXRepresentation_unsigned` | Unsigned hex |
| `BINRepresentation` | Binary inputs/outputs and transaction size |
| `getFee()` | `{ atoms, decimal }` fee |
| `fromHEX(hex)` | Parse a transaction from hex (also available as a static method) |

## UTXO previews

For UI feedback before broadcasting, `previewUtxoChange(tx)` returns the UTXOs a transaction would spend and create:

```ts
const { spent, created } = client.previewUtxoChange(tx);
```

:::warning

`previewUtxoChange` is a **local simulation** of the unsigned transaction. Until the transaction is actually broadcast and accepted, the changes it reports are not real.

:::
