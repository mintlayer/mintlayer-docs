---
title: "Function reference"
description: "Complete reference of the Mintlayer Kotlin and Swift wallet bindings: every exported function, data formats, shared types and error variants."
sidebar_label: Reference
sidebar_position: 6
---

# Function reference

Names below are the generated Kotlin names in the `org.mintlayer.wallet.bindings` package; the Swift names in the `MintlayerWalletBindings` module are identical except that optional parameters use labels (`makeDefaultAccountPrivkey(mnemonic:network:passphrase:)`). Byte parameters are `ByteArray` in Kotlin, `Data` in Swift.

## Keys and addresses

| Function | Returns | Notes |
| -------- | ------- | ----- |
| `makePrivateKey()` | private-key blob | random new key |
| `makeDefaultAccountPrivkey(mnemonic, network, passphrase?)` | extended private-key blob | BIP39 → `m/44'/<coin type>/0'` (coin type 1 testnet, 19788 mainnet) |
| `extendedPrivateKeyDecode(blob)` | `ExtendedPrivateKeyData` | decompose into path, chain code, public/private keys |
| `extendedPrivateKeyEncode(parts)` | extended private-key blob | canonical form, roundtrip-safe |
| `makeReceivingAddress(accountPrivkey, keyIndex: UInt32)` | private-key blob | path `<account>/0/<index>` — returns a **key**, not an address |
| `makeChangeAddress(accountPrivkey, keyIndex)` | private-key blob | path `<account>/1/<index>` — same naming note |
| `makeReceivingAddressPublicKey(accountPublicKey, keyIndex)` | public-key blob | watch-only derivation |
| `makeChangeAddressPublicKey(accountPublicKey, keyIndex)` | public-key blob | watch-only derivation |
| `publicKeyFromPrivateKey(privateKey)` | public-key blob | |
| `extendedPublicKeyFromExtendedPrivateKey(accountPrivkey)` | extended public-key blob | |
| `pubkeyToPubkeyhashAddress(publicKey, network)` | `String` | Bech32 address (`mtc1…` / `tmt1…`) |
| `encodeDestination(address, network)` | destination blob | address → destination for outputs/witnesses |

Key indices must not have the most significant bit set (`InvalidKeyIndex` otherwise), matching BIP32 hardened-key rules.

## Transactions

| Function | Returns | Notes |
| -------- | ------- | ----- |
| `encodeTransaction(inputs, outputs, flags)` | transaction blob | assemble from input/output blobs |
| `encodeSignedTransaction(transaction, signatures)` | signed transaction blob | witness list appended |
| `encodePartiallySignedTransaction(...)` | partially signed blob | per-input optional witnesses, UTXOs, destinations, HTLC secrets |
| `getTransactionId(transaction, strictByteSize)` | `String` (hex) | strict = exactly one `Transaction`; lenient tolerates witness bytes |
| `decodeTransactionToJson(transaction, network)` | `String` (JSON) | empty witness list shape |
| `decodeSignedTransactionToJson(transaction, network)` | `String` (JSON) | |
| `decodePartiallySignedTransactionToJson(transaction, network)` | `String` (JSON) | |
| `estimateTransactionSize(inputs, inputDestinations, outputs, network)` | `UInt64` | encoded size in bytes |
| `encodeOutpointSourceId(id, source)` | outpoint blob | `id` = raw 32-byte tx/block-reward id, `source` = `SourceId` |
| `extractHtlcSecret(signedTx, strictByteSize, htlcOutpointSourceId, htlcOutputIndex)` | secret bytes | revealed HTLC pre-image from a spend |

## Inputs

Each returns one input blob: `encodeInputForUtxo(outpointSourceId, outputIndex)`, `encodeInputForWithdrawFromDelegation`, `encodeInputForMintTokens`, `encodeInputForUnmintTokens`, `encodeInputForLockTokenSupply`, `encodeInputForFreezeToken`, `encodeInputForUnfreezeToken`, `encodeInputForChangeTokenAuthority`, `encodeInputForChangeTokenMetadataUri`, `encodeInputForFillOrder`, `encodeInputForFreezeOrder`, `encodeInputForConcludeOrder`.

## Outputs

| Function | Parameters |
| -------- | ---------- |
| `encodeOutputTransfer` | `amount`, `address`, `network` |
| `encodeOutputTokenTransfer` | `amount`, `address`, `tokenId`, `network` |
| `encodeOutputLockThenTransfer` | `amount`, `address`, `lock` (timelock blob), `network` |
| `encodeOutputTokenLockThenTransfer` | `amount`, `address`, `tokenId`, `lock`, `network` |
| `encodeOutputCoinBurn` | `amount` |
| `encodeOutputTokenBurn` | `amount`, `tokenId`, `network` |
| `encodeOutputCreateDelegation` | `poolId`, `ownerAddress`, `network` |
| `encodeOutputDelegateStaking` | `amount`, `delegationId`, `network` |
| `encodeOutputCreateStakePool` | `poolId`, `poolData` (blob from `encodeStakePoolData`), `network` |
| `encodeOutputProduceBlockFromStake` | `poolId`, `staker`, `network` |
| `encodeOutputDataDeposit` | `data` (arbitrary bytes) |
| `encodeOutputIssueFungibleToken` | `authority`, `tokenTicker`, `metadataUri`, `numberOfDecimals`, `totalSupply` (`TotalSupply`), `supplyAmount?`, `isFreezable` (`FreezableToken`), `currentBlockHeight`, `network` |
| `encodeOutputIssueNft` | `tokenId`, `authority`, `name`, `ticker`, `description`, `mediaHash`, `creator?`, `mediaUri?`, `iconUri?`, `additionalMetadataUri?`, `currentBlockHeight`, `network` |
| `encodeOutputHtlc` | `amount`, `tokenId?`, `secretHash`, `spendAddress`, `refundAddress`, `refundTimelock` (timelock blob), `network` |
| `encodeCreateOrderOutput` | `askAmount`, `askTokenId?`, `giveAmount`, `giveTokenId?`, `concludeAddress`, `network` |

All amounts are decimal atom strings; token ids are bech32 strings.

## Witnesses

| Function | Use |
| -------- | --- |
| `encodeWitness(sighashType, privateKey, inputOwnerDestination, transaction, inputUtxos, inputIndex, additionalInfo, currentBlockHeight, network)` | standard single-signature witness |
| `encodeWitnessNoSignature()` | witness for inputs that need no signature |
| `encodeWitnessHtlcSpend(...)` | spend an HTLC by revealing the secret |
| `encodeWitnessHtlcRefundSingleSig(...)` | refund an HTLC after the timelock (single signature) |
| `encodeWitnessHtlcRefundMultisig(...)` | refund an HTLC after the timelock (multisig) |

`sighashType` is a `SignatureHashType`; `inputUtxos` carries one optional UTXO blob per transaction input.

## Messages and challenges

| Function | Notes |
| -------- | ----- |
| `signMessageForSpending(privateKey, message)` | spending-flavor signature over arbitrary bytes |
| `verifySignatureForSpending(publicKey, signature, message)` | verified against a public key, returns `Boolean` |
| `signChallenge(privateKey, message)` | challenge-flavor signature |
| `verifyChallenge(...)` | verified against a bech32 address, returns `Boolean` |

## Transaction intents

| Function | Notes |
| -------- | ----- |
| `makeTransactionIntentMessageToSign(intent, transactionId)` | message bytes for an intent string + hex tx id |
| `encodeSignedTransactionIntent(signedMessage, signatures)` | one challenge signature per input destination, in input order |
| `verifyTransactionIntent(expectedSignedMessage, encodedSignedIntent, inputDestinations, network)` | returns `Boolean` |

## Fees

All take `(currentBlockHeight: UInt64, network)` and return a decimal atom string: `fungibleTokenIssuanceFee`, `nftIssuanceFee`, `tokenSupplyChangeFee`, `tokenFreezeFee`, `tokenChangeAuthorityFee`, `dataDepositFee`.

## Timelocks

Each returns one timelock blob for the `LockThenTransfer` encoders: `encodeLockForBlockCount(count)`, `encodeLockForSeconds(seconds)`, `encodeLockUntilTime(timestampSeconds)`, `encodeLockUntilHeight(height)`.

## Ids

| Function | Parameters | Returns |
| -------- | ---------- | ------- |
| `getTokenId` | issuance input blobs, `currentBlockHeight`, `network` | `String` (bech32) |
| `getOrderId` | order creation input blobs, `currentBlockHeight` | `String` |
| `getDelegationId` | delegation creation input blobs, `currentBlockHeight` | `String` |
| `getPoolId` | pool creation input blobs, `currentBlockHeight` | `String` |

## Staking

| Function | Notes |
| -------- | ----- |
| `encodeStakePoolData(value, staker, vrfPublicKey, decommissionKey, marginRatioPerThousand, costPerBlock, network)` | pool data blob for `encodeOutputCreateStakePool` |
| `effectivePoolBalance(network, pledgeAmount, poolBalance)` | effective balance in atoms, accounting for the pledge |
| `stakingPoolSpendMaturityBlockCount(network)` | blocks a stake spend must wait |

## Data formats

- **Blobs** (keys, inputs, outputs, witnesses, timelocks, transactions) cross the boundary as byte arrays in the runtime SCALE format — the same bytes the WASM wrappers produce and consume. Blobs are interchangeable with connect-sdk code.
- **Addresses and ids** are bech32 strings: `mtc1…` (mainnet), `tmt1…` (testnet) for addresses; token, pool, delegation and order ids use their own prefixes (`mdelg1…`, etc.).
- **Amounts** are decimal atom strings — `1 ML = 100,000,000,000` atoms. 128-bit atom counts do not fit in Kotlin `Long` or Swift `Int`, which is why strings are used. This is the main porting difference from JavaScript (see [Migrating from WASM](wasm-migration.md)). Only ASCII digits are accepted; `+`, whitespace or scientific notation raise `InvalidAmount`.
- **Network** is the `Network` enum: `mainnet` / `testnet` / `regtest` / `signet` (`Network.TESTNET` in Kotlin, `.testnet` in Swift).

## Shared types

| Type | Kind | Cases / fields |
| ---- | ---- | -------------- |
| `Network` | enum | `mainnet`, `testnet`, `regtest`, `signet` |
| `SourceId` | enum | `Transaction`, `BlockReward` |
| `SignatureHashType` | enum | `All`, `None`, `Single`, `AnyoneCanPay` |
| `TotalSupply` | enum | `Lockable`, `Unlimited`, `Fixed` (requires `supplyAmount`) |
| `FreezableToken` | enum | `No`, `Yes` |
| `TokenUnfreezable` | enum | `No`, `Yes` |
| `SimpleCurrencyAmount` | enum | `Coins { atoms }`, `TokenAmount { tokenId, atoms }` |
| `ExtendedPrivateKeyData` | record | `derivationPath: [UInt32]`, `chainCode` (32 bytes), `publicKey`, `privateKey` |
| `TxAdditionalInfo` | record | `poolInfo: [PoolAdditionalInfoEntry]`, `orderInfo: [OrderAdditionalInfoEntry]` |
| `PoolAdditionalInfoEntry` | record | `id`, `stakerBalance` (atoms) |
| `OrderAdditionalInfoEntry` | record | `id`, `initiallyAsked`, `initiallyGiven`, `askBalance`, `giveBalance` |

`TxAdditionalInfo` is required by witness signing and partially signed transactions; it only needs entries for `ProduceBlockFromStake`, `FillOrder` or `ConcludeOrder` inputs (entries not referenced are harmless — an empty record is correct for ordinary transfers).

## Errors

Every fallible function throws `BindingsException` in Kotlin / `BindingsError` in Swift. Nothing panics across the FFI; there are no opaque strings. Variants (casing follows each language's conventions):

| Variant | Meaning |
| ------- | ------- |
| `InvalidMnemonic` | the BIP39 mnemonic could not be parsed |
| `InvalidAmount` | amount is not a valid decimal digit string, or overflows |
| `InvalidKeyIndex` | key index has its most significant bit set |
| `Decoding` | a runtime-format blob could not be decoded |
| `AddressParse` | a bech32 address could not be parsed for the given network |
| `InvalidTransactionId` | malformed transaction id |
| `FixedTotalSupplyWithoutAmount` | fixed supply requested without a cap |
| `InvalidTokenParameters` | token issuance parameters failed chain validation |
| `InvalidNftCreatorPublicKey` | NFT creator field is not a valid public key |
| `InvalidMarginRatio` | pool margin ratio out of range |
| `ZeroMultisigRequiredSignatures` | multisig requires at least one signature |
| `InvalidHtlcSecretHash` / `UnexpectedHtlcSpendType` | malformed HTLC parameters |
| `TransactionCreation` / `SignedTransactionCreation` / `PartiallySignedTransactionCreation` | transaction assembly failed |
| `InputSigning` / `Sighash` / `KeyDerivation` / `MessageSigning` / `SignatureVerification` | signing or verification failed |
| `NoInputOutpointFound` / `InvalidWitnessCount` | witness list does not match the transaction |
| `SizeEstimation` / `EffectiveBalance` | estimation overflowed |
| `IntentVerification` / `IntentMessageNotUtf8` | intent message/verification failed |
| `Json` | JSON decoding failed |

Pattern matching over the variants lets apps surface precise messages, e.g. distinguish a bad mnemonic from a wrong-network address at input time.
