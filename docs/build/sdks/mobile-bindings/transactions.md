---
title: "Building transactions"
description: "Assemble, sign, size and decode Mintlayer transactions with the Kotlin and Swift bindings: inputs, outputs, witnesses, fees and transaction ids."
sidebar_position: 4
---

# Building transactions

Transaction building follows one pipeline: encode the inputs and outputs as blobs, assemble the unsigned transaction, produce one witness per input, then combine them into the signed transaction. Every step works on runtime-format blobs (see [Data formats](reference.md#data-formats)), so intermediate values can be stored, logged (except key material!) or passed to other Mintlayer tooling interchangeably.

## The pipeline

| Step | Function | Produces |
| ---- | -------- | -------- |
| 1. Reference the UTXO to spend | `encodeOutpointSourceId(id, source)` → `encodeInputForUtxo(outpointSourceId, outputIndex)` | one `TxInput` blob |
| 2. Encode the output(s) | `encodeOutputTransfer(...)`, `encodeOutputTokenTransfer(...)`, … | one `TxOutput` blob each |
| 3. Assemble the unsigned transaction | `encodeTransaction(inputs, outputs, flags)` | transaction blob |
| 4. (Optional) Estimate size | `estimateTransactionSize(inputs, inputDestinations, outputs, network)` | size in bytes |
| 5. Sign each input | `encodeWitness(sighashType, privateKey, inputOwnerDestination, transaction, inputUtxos, inputIndex, additionalInfo, currentBlockHeight, network)` | one witness blob per input |
| 6. Assemble the signed transaction | `encodeSignedTransaction(transaction, signatures)` | signed transaction blob |
| 7. Inspect | `getTransactionId`, `decodeSignedTransactionToJson` | id / JSON |

`inputUtxos` in step 5 is a list with one optional entry per transaction input — the UTXO being spent, needed for the signature hash. `additionalInfo` is a `TxAdditionalInfo` record; it only needs entries when the transaction spends stake-pool or order inputs (see [Reference](reference.md#shared-types)).

The bindings do not select UTXOs or broadcast: fetch spendable UTXOs from the [API](../../../api/index.md) and submit the signed bytes back through it.

## Worked example: a coin transfer (Kotlin)

```kotlin
import org.mintlayer.wallet.bindings.Network
import org.mintlayer.wallet.bindings.SignatureHashType
import org.mintlayer.wallet.bindings.SourceId
import org.mintlayer.wallet.bindings.TxAdditionalInfo
import org.mintlayer.wallet.bindings.encodeInputForUtxo
import org.mintlayer.wallet.bindings.encodeOutpointSourceId
import org.mintlayer.wallet.bindings.encodeOutputTransfer
import org.mintlayer.wallet.bindings.encodeSignedTransaction
import org.mintlayer.wallet.bindings.encodeTransaction
import org.mintlayer.wallet.bindings.encodeWitness
import org.mintlayer.wallet.bindings.estimateTransactionSize
import org.mintlayer.wallet.bindings.getTransactionId

// Chain data: the UTXO to spend (32-byte raw tx id + output index) and
// the signing key for its address.
val utxoTxId: ByteArray = /* 32 raw bytes of the spending tx id */
val utxoOutputIndex: UInt = 0u
val utxo: ByteArray = /* the spent UTXO, decoded from the API response */
val signingKey: ByteArray = /* plain private key, e.g. from makeReceivingAddress */
val ownerAddress = "tmt1…"           // the address that owns the UTXO
val destination = "tmt1…"            // where the coins go
val amountAtoms = "50000000000"      // 500 ML in atoms (decimal string)

// 1. Input
val outpointSource = encodeOutpointSourceId(utxoTxId, SourceId.TRANSACTION)
val input = encodeInputForUtxo(outpointSource, utxoOutputIndex)

// 2. Output
val output = encodeOutputTransfer(amountAtoms, destination, Network.TESTNET)

// 3. Unsigned transaction
val inputs = listOf(input)
val outputs = listOf(output)
val tx = encodeTransaction(inputs, outputs, 0uL)

// 4. Size estimate (for fee budgeting)
val sizeBytes = estimateTransactionSize(inputs, listOf(ownerAddress), outputs, Network.TESTNET)

// 5. Witness for input 0
val witness = encodeWitness(
    SignatureHashType.ALL,
    signingKey,
    ownerAddress,
    tx,
    listOf<ByteArray?>(utxo),
    0u,
    TxAdditionalInfo(poolInfo = emptyList(), orderInfo = emptyList()),
    currentBlockHeight,              // from the chain tip
    Network.TESTNET,
)

// 6. Signed transaction, ready to broadcast
val signed = encodeSignedTransaction(tx, listOf(witness))

// 7. Id and inspection
val txId = getTransactionId(signed, false)   // lenient: tolerates witness trailing bytes
```

The Swift equivalent uses the same calls with parameter labels (`encodeWitness(.all, privateKey:, inputOwnerDestination:, transaction:, inputUtxos:, inputIndex:, additionalInfo:, currentBlockHeight:, network:)`) and `try` on every fallible call.

:::note[Transaction ids]

`getTransactionId(tx, true)` requires the bytes to be exactly one unsigned `Transaction` object; with `strictByteSize = false` trailing bytes (such as the witness list of a signed transaction) are tolerated. The id is returned as a hex string; `encodeOutpointSourceId` needs the raw 32 bytes, so hex-decode before reusing it as an input reference.

:::

## Output types

One encoder per output type, each returning a single `TxOutput` blob: `encodeOutputTransfer` and `encodeOutputTokenTransfer` (plain and token payments), `encodeOutputLockThenTransfer` / `encodeOutputTokenLockThenTransfer` (time-locked payments using the [timelock](#timelocks) encoders), `encodeOutputCoinBurn` / `encodeOutputTokenBurn`, `encodeOutputCreateDelegation` / `encodeOutputDelegateStaking` (staking), `encodeOutputCreateStakePool` (wraps the blob from `encodeStakePoolData`), `encodeOutputProduceBlockFromStake`, `encodeOutputDataDeposit`, `encodeOutputIssueFungibleToken` / `encodeOutputIssueNft` (issuance), `encodeOutputHtlc` (hash time-locked contracts) and `encodeCreateOrderOutput` (on-chain orders). Parameters are listed in the [Reference](reference.md#outputs).

## Input types

Besides `encodeInputForUtxo`, the encoders cover every chain input type: `encodeInputForWithdrawFromDelegation`, the token-authority inputs (`encodeInputForMintTokens`, `encodeInputForUnmintTokens`, `encodeInputForLockTokenSupply`, `encodeInputForFreezeToken`, `encodeInputForUnfreezeToken`, `encodeInputForChangeTokenAuthority`, `encodeInputForChangeTokenMetadataUri`) and the order inputs (`encodeInputForFillOrder`, `encodeInputForFreezeOrder`, `encodeInputForConcludeOrder`).

## Protocol fees

Fee amounts returned by the fee functions are decimal atom strings, ready to use wherever an amount is expected:

| Function | Fee for |
| -------- | ------- |
| `fungibleTokenIssuanceFee(currentBlockHeight, network)` | fungible token issuance |
| `nftIssuanceFee(currentBlockHeight, network)` | NFT issuance |
| `tokenSupplyChangeFee(currentBlockHeight, network)` | mint/unmint/lock supply |
| `tokenFreezeFee(currentBlockHeight, network)` | freeze/unfreeze |
| `tokenChangeAuthorityFee(currentBlockHeight, network)` | authority/metadata change |
| `dataDepositFee(currentBlockHeight, network)` | data deposit output |

Regular transfer transactions pay no explicit fee field: the fee is the difference between the sum of the inputs and the sum of the outputs — send the change back to a change address derived as in [Getting started](getting-started.md).

## Timelocks

`encodeLockForBlockCount`, `encodeLockForSeconds`, `encodeLockUntilTime` and `encodeLockUntilHeight` produce the timelock blobs consumed by the `LockThenTransfer` output encoders.

## Partially signed transactions

`encodePartiallySignedTransaction` assembles transactions where only some inputs carry witnesses — per-input optional entries for signatures, spent UTXOs, signing destinations and HTLC secrets. It is the format used for multi-party signing flows; the JSON decoders (`decodeTransactionToJson`, `decodeSignedTransactionToJson`, `decodePartiallySignedTransactionToJson`) inspect all three forms.
