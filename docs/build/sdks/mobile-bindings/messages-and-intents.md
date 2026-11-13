---
title: "Messages and intents"
description: "Sign and verify messages, challenges and transaction intents with the Mintlayer Kotlin and Swift bindings."
sidebar_position: 5
---

# Messages and intents

Beyond transaction witnesses, the bindings expose two signature flavors with distinct verification rules: **spending signatures** (verified against a public key) and **challenge signatures** (verified against an address). Transaction intents build on challenge signatures.

## Spending signatures

`signMessageForSpending(privateKey, message)` signs an arbitrary message with a plain private key; `verifySignatureForSpending(publicKey, signature, message)` checks it against the matching public key. This is the flavor used by transaction witnesses.

```swift
import MintlayerWalletBindings

let message = Data("withdraw:123".utf8)
let signature = try signMessageForSpending(privateKey: key, message: message)
let ok = try verifySignatureForSpending(
    publicKey: publicKeyFromPrivateKey(privateKey: key),
    signature: signature,
    message: message)
```

## Challenges

`signChallenge(privateKey, message)` produces a signature that `verifyChallenge` checks against a **bech32 address** rather than a raw public key — useful when the verifier only knows the address (for example, proving control of a wallet address to a backend).

## Transaction intents

A transaction intent is an on-chain record that the signers of specific inputs approve of a given message. The flow:

1. Build the message to sign: `makeTransactionIntentMessageToSign(intent, transactionId)` — `intent` is an arbitrary string, `transactionId` the hex id of the transaction that carries the intent.
2. Sign that message once per input destination with `signChallenge`.
3. Assemble: `encodeSignedTransactionIntent(signedMessage, signatures)` — one challenge signature per input, in input order.
4. Verify: `verifyTransactionIntent(expectedSignedMessage, encodedSignedIntent, inputDestinations, network)`.

```kotlin
import org.mintlayer.wallet.bindings.makeTransactionIntentMessageToSign
import org.mintlayer.wallet.bindings.signChallenge
import org.mintlayer.wallet.bindings.encodeSignedTransactionIntent

val message = makeTransactionIntentMessageToSign(intent, txIdHex)
val signatures = listOf(signChallenge(inputKey0, message))   // one per input destination
val signedIntent = encodeSignedTransactionIntent(message, signatures)
```

## Multisig destinations

`encodeDestination(address, network)` turns a bech32 address into a destination blob; `encodeMultisigChallenge` and `multisigChallengeToAddress` build and inspect multisig challenges (a signature-count threshold plus public keys). These are the building blocks for multisig destinations in outputs and witnesses.
