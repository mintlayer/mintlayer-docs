---
title: "Getting started: deriving addresses"
description: "Derive the default account key and addresses from a BIP39 mnemonic with the Mintlayer Kotlin and Swift bindings, verified against public test vectors."
sidebar_label: Getting started
sidebar_position: 3
---

# Getting started: deriving addresses

This page walks through the standard key-derivation workflow: a BIP39 mnemonic in, addresses out. The same five calls are all a wallet needs for its key hierarchy; the examples below reproduce public test vectors you can check on device or simulator.

## The derivation path

`makeDefaultAccountPrivkey` maps a mnemonic to the default account extended private key at `m/44'/<coin type>/0'`:

| Network | Coin type | Default account path |
| ------- | --------- | -------------------- |
| testnet | `1` | `m/44'/1'/0'` |
| mainnet | `19788` | `m/44'/19788'/0'` |

Receiving and change keys are derived from the account key with the child-index functions:

| Function | Path | Input |
| -------- | ---- | ----- |
| `makeReceivingAddress(accountPrivkey, keyIndex)` | `<account>/0/<index>` | account extended **private** key |
| `makeChangeAddress(accountPrivkey, keyIndex)` | `<account>/1/<index>` | account extended **private** key |
| `makeReceivingAddressPublicKey(accountPublicKey, keyIndex)` | `<account>/0/<index>` | account extended **public** key (watch-only) |
| `makeChangeAddressPublicKey(accountPublicKey, keyIndex)` | `<account>/1/<index>` | account extended **public** key (watch-only) |

:::note["Address" functions return keys]

Despite their names, `makeReceivingAddress` and `makeChangeAddress` return a plain **private-key blob**, not an address — the names mirror the WASM exports. Convert a key to an address with `pubkeyToPubkeyhashAddress` (or use the `…PublicKey` variants from an extended public key for watch-only wallets).

:::

## Kotlin (Android)

```kotlin
import org.mintlayer.wallet.bindings.Network
import org.mintlayer.wallet.bindings.extendedPublicKeyFromExtendedPrivateKey
import org.mintlayer.wallet.bindings.makeDefaultAccountPrivkey
import org.mintlayer.wallet.bindings.makeReceivingAddressPublicKey
import org.mintlayer.wallet.bindings.pubkeyToPubkeyhashAddress

val mnemonic = /* the user's seed phrase */
val account = makeDefaultAccountPrivkey(mnemonic, Network.TESTNET, null)
val xpub = extendedPublicKeyFromExtendedPrivateKey(account)
val receiving0 = makeReceivingAddressPublicKey(xpub, 0u)
val address = pubkeyToPubkeyhashAddress(receiving0, Network.TESTNET)
```

## Swift (iOS)

```swift
import MintlayerWalletBindings

let mnemonic = /* the user's seed phrase */
let account = try makeDefaultAccountPrivkey(
    mnemonic: mnemonic, network: .testnet, passphrase: nil)
let xpub = try extendedPublicKeyFromExtendedPrivateKey(accountPrivkey: account)
let receiving0 = try makeReceivingAddressPublicKey(
    accountPublicKey: xpub, keyIndex: 0)
let address = try pubkeyToPubkeyhashAddress(
    publicKey: receiving0, network: .testnet)
```

The optional passphrase in `makeDefaultAccountPrivkey` is the BIP39 passphrase: it changes the derived seed entirely and must be remembered together with the mnemonic.

## Verifying against the test vectors

Running the snippet with the public BIP39 test mnemonic `abandon` × 23 + `art` (24 words, checksum valid — a public test vector, no secret material) must produce exactly:

| Output | Value |
| ------ | ----- |
| Default account xpriv blob (testnet, hex) | `00038000002c800000018000000012ed17c3e72223beb38ea98ec1317581f02458f02b0ecf4abe02c6490eca170a900d967bc0c84b9c2da3b55f7db9f76cbdc0469176a76d01141af2a705b4353a` |
| Receiving public key #0 (hex) | `00035a6f28253f35e2ff1ab0b086b8c87f731159661157e5be2ca98188369625dc32` |
| Address #0 (testnet) | `tmt1qyxqfq37rra32sq6zhayqcpjwh4trc07mcfardwt` |
| Address #0 (mainnet) | `mtc1q82twmwwxa3l2pe26gf0zgghu69jtez3qq2ajqyl` |

An account key blob can be decomposed with `extendedPrivateKeyDecode`, which returns the derivation path, the 32-byte chain code and the plain public/private keys; `extendedPrivateKeyEncode` rebuilds the canonical blob (roundtrip-safe).

:::danger[Secret material]

Private-key blobs and the account extended private key are secret material. Keep their lifetime short, never log them, and never present deterministic test keys like the mnemonic above as wallet seeds — anyone running the derivation has them.

:::

## Address formats

`pubkeyToPubkeyhashAddress` produces a Bech32 address prefixed by network: `mtc1…` (mainnet), `tmt1…` (testnet). The checksum can locate up to two mistyped characters — see [address typo recovery](../../../wallet/addresses/address-format.md#address-typo-recovery) if your app accepts pasted addresses.
