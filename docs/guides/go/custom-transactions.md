---
title: "Forging Custom Transactions (Advanced)"
description: "Compose arbitrary Mintlayer transactions with the Go SDK's WASM runtime: mixed inputs and outputs, protocol fees, fee estimation, multi-party signing, and intents."
sidebar_position: 8
---

# Forging Custom Transactions (Advanced)

A Mintlayer transaction is just **inputs + outputs + witnesses**. The wallet daemon assembles standard shapes for you; the WASM runtime lets you forge any valid combination yourself. This is the advanced guide; the basic eight-step flow is documented in [Building Transactions](../../build/sdks/go/transactions.md). Here we focus on what you can *combine*.

```go
import (
    "context"
    mintlayer "github.com/mintlayer/go-sdk/wasm"
)

ctx := context.Background()
c, err := mintlayer.New(ctx)
if err != nil {
    log.Fatal(err)
}
defer c.Close()
```

## The shape of a transaction

```go
tx, err := c.EncodeTransaction(encodedInputs, encodedOutputs, 0 /* flags */)
```

- `encodedInputs`: **concatenation** of input blobs. Most inputs are UTXO spends (`EncodeInputForUtxo`), but protocol inputs exist too: token operations (`EncodeInputForMintTokens`, `EncodeInputForUnmintTokens`, `EncodeInputForFreezeToken`, …), delegation withdrawals, and order operations. All concatenate the same way.
- `encodedOutputs`: concatenation of output blobs. Any mix of transfers, burns, issuances, data deposits, HTLCs, order creations, and pool operations.
- `flags`: `0` for standard transactions.

Nothing stops you from mixing output types freely in one transaction.

## Mixed outputs in one transaction

Payments, an on-chain memo, and a time-locked vesting payout, all atomic:

```go
// 1. Plain coin payment
payment, err := c.EncodeOutputTransfer(
    mintlayer.NewAmount("500000000000"), "mxtc1qrecipient...", mintlayer.Mainnet)

// 2. Arbitrary bytes on-chain
memo, err := c.EncodeOutputDataDeposit([]byte("order-ref:2026-09-16-042"))

// 3. Coins the recipient cannot spend for 1000 blocks
lock, err := c.EncodeLockForBlockCount(1000)
vesting, err := c.EncodeOutputLockThenTransfer(
    mintlayer.NewAmount("100000000000"), "mxtc1qemployee...", lock, mintlayer.Mainnet)

// 4. Token payment alongside the coins
tokenOut, err := c.EncodeOutputTokenTransfer(
    mintlayer.NewAmount("25"), "mxtc1qrecipient...", "ttml1tokenid...", mintlayer.Mainnet)

allOutputs := append(payment, memo...)
allOutputs = append(allOutputs, vesting...)
allOutputs = append(allOutputs, tokenOut...)
```

## Mixing UTXO and protocol inputs

Protocol operations are inputs like any other. Minting tokens, for example, consumes a **nonce input** keyed by the token ID, while the network fee still comes from a regular coin UTXO:

```go
tokenInfo, err := idxClient.GetToken(ctx, tokenID) // NextNonce

mintInput, err := c.EncodeInputForMintTokens(
    tokenID, mintlayer.NewAmount("100000"), tokenInfo.NextNonce, mintlayer.Mainnet)

feeInput, err := c.EncodeInputForUtxo(srcID, uint32(0)) // coin UTXO covering the fee

encodedInputs := append(mintInput, feeInput...)
```

The mint's `EncodeInputForMintTokens` requires the token's current `NextNonce` from the indexer: every protocol input (freezes, authority changes, delegation withdrawals, order ops) consumes its nonce the same way.

## Protocol fees

Token operations carry minimum protocol fees that must be added to the transaction outputs. Query them at the current height:

```go
tip, err := idxClient.GetTip(ctx)

issuanceFee, err := c.FungibleTokenIssuanceFee(tip.BlockHeight, mintlayer.Mainnet)
mintFee, err     := c.TokenSupplyChangeFee(tip.BlockHeight, mintlayer.Mainnet)
freezeFee, err   := c.TokenFreezeFee(tip.BlockHeight, mintlayer.Mainnet)
authorityFee, err := c.TokenChangeAuthorityFee(tip.BlockHeight, mintlayer.Mainnet)
```

Add matching coin outputs (typically back to yourself or the new authority) covering the fee amounts.

## Network fee estimation

Size drives the network fee, and size depends on the *signed* transaction. Estimate before finalizing outputs, then deduct the fee from change:

```go
rate, err := idxClient.GetFeeRate(ctx, 1) // atoms per KB, top 1 MB of mempool

size, err := c.EstimateTransactionSize(encodedInputs, destAddresses, allOutputs, mintlayer.Mainnet)

fee := new(big.Int).Mul(new(big.Int).SetUint64(uint64(size)), feeRateAtoms)
fee.Div(fee, big.NewInt(1000))
```

`destAddresses` is one owner address per input, in input order; for mixed inputs, that is the UTXO's address, or the relevant delegation/order owner for protocol inputs.

## Predicting IDs

Creation transactions get their IDs from their inputs, deterministically; compute them before broadcasting:

```go
poolID, err := c.GetPoolId(encodedInputs, mintlayer.Mainnet)
tokenID, err := c.GetTokenId(encodedInputs, tip.BlockHeight, mintlayer.Mainnet)
delegationID, err := c.GetDelegationId(encodedInputs, mintlayer.Mainnet)
orderID, err := c.GetOrderId(encodedInputs, mintlayer.Mainnet)
```

This is how a transaction that creates a delegation can immediately delegate to it, or how you can show a user "your token will be `ttml1…`" before signing.

## Multi-party signing (PSBT-style)

`EncodeSignedTransaction` expects witnesses for every input. For flows where different parties sign different inputs, build partial signatures and merge:

```go
partiallySigned, err := c.EncodePartiallySignedTransaction(
    tx, witnessBytes, inputUtxos, inputDestinations,
    htlcSecrets,              // empty when unused
    mintlayer.TxAdditionalInfo{},
    mintlayer.Mainnet,
)
```

Exchange the partially signed transaction out-of-band; the final assembler produces the complete signed transaction once every input has a witness.

## Transaction intents

An intent is a **signed declaration of purpose** (what a transaction is meant to do), bound to the transaction ID but independent of its bytes. Signers can verify what they are authorizing before producing a witness:

```go
msg, err := c.MakeTransactionIntentMessageToSign(intent, transactionID)
sig, err := c.SignMessageForSpending(privKey, msg)

signedIntent, err := c.EncodeSignedTransactionIntent(msg, [][]byte{sig})

// Verifier side, before signing:
err = c.VerifyTransactionIntent(expectedSignedMessage, signedIntent, inputDestinations, mintlayer.Mainnet)
```

This is the building block for co-signers and policy engines that must approve transactions they can't fully parse.

## Sanity checks before broadcasting

- Every input witness present, in input order (see [Wallet & Signing](wallet-wasm.md#signing-a-transaction)).
- `TxAdditionalInfo` populated for any pool or order input, signing fails or produces an invalid sighash otherwise (see [the reference](../../build/sdks/go/wasm.md#additional-info-for-signing)).
- Protocol fees included as outputs; nonce values fresh from the indexer.
- Dry-run the result: `GetTransactionID` and `DecodeSignedTransactionToJS` before `SubmitTransaction`.
