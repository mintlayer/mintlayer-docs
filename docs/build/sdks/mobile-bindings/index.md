---
title: "Kotlin & Swift SDK"
description: "Native Mintlayer wallet bindings for Android and iOS: UniFFI-generated Kotlin and Swift for key derivation, addresses, transaction encoding, signing, and intents, byte-compatible with the WASM wrappers."
sidebar_position: 1
---

# Kotlin & Swift SDK

The Mintlayer wallet bindings bring the Mintlayer wallet key, address, signing and transaction-encoding primitives to native mobile apps. They are generated with [UniFFI](https://mozilla.github.io/uniffi-rs/) from the `mintlayer-wallet-bindings` crate in the [mintlayer/rust-sdk](https://github.com/mintlayer/rust-sdk) repository, and ship as a Kotlin package (`org.mintlayer.wallet.bindings`) for Android and a Swift module (`MintlayerWalletBindings`) for iOS.

For mobile applications these bindings are the recommended integration. React Native's Hermes engine does not provide a `WebAssembly` global, so the WASM wrappers used by the [JavaScript SDK](../javascript/index.md) cannot run in React Native or Expo apps — the native bindings cover exactly that gap. The WASM path remains available for browsers and is unchanged.

## Supported platforms

| Platform | Artifact | Architectures |
| -------- | -------- | ------------- |
| Android 6.0+ (API 24) | `mintlayer-wallet-bindings-<ver>.aar` | `arm64-v8a`, `armeabi-v7a`, `x86_64` |
| iOS 15+ | `MintlayerWalletBindings.xcframework` | `ios-arm64` (device), `ios-arm64_x86_64-simulator` |

The Intel simulator slice is omitted: recent Xcode releases no longer ship Intel simulator runtimes. See [Installation](installation.md) for setup.

## Parity with the WASM wrappers

The exported surface mirrors the WASM wrappers — same function names, equivalent parameter shapes, same runtime blob formats — and outputs are **byte-for-byte identical** to `@mintlayer/wasm-lib` 1.4.0. Parity is verified in CI by two test suites:

1. **Hardcoded vectors** — the public BIP39 test mnemonic (`abandon` × 23 + `art`) must reproduce the WASM reference outputs exactly.
2. **A 3,400-case differential suite** — deterministic inputs captured from the WASM reference are replayed through every export. Signature blobs use random nonces, so those cases are cross-verified (the WASM signature is checked by the Rust verifier) rather than byte-compared. Two VRF-gated stake-pool encoders are structurally tested only, since their VRF-address input is not manufacturable from the WASM API.

Blobs produced by the native bindings can be passed to connect-sdk code and vice versa. The one porting difference to plan for: amounts move from JavaScript numbers to **decimal atom strings** (see [Data formats](reference.md#data-formats)).

## Library boundaries

The bindings are a pure cryptography and encoding library:

- **No storage, no networking, no mnemonic generation.** Your app fetches UTXOs from an [API](../../../api/index.md) and broadcasts transactions itself.
- **No panics across the FFI.** Every fallible function returns a typed error: `BindingsException` in Kotlin, `BindingsError` in Swift (see [Errors](reference.md#errors)).
- **Secret blobs are plain buffers.** The BIP39 seed and passphrase are zeroized on drop, but key blobs returned over the FFI are copied into your runtime's memory and cannot be zeroized from the Rust side. Keep their lifetime short and never log them.

## Where to go next

- [Installation](installation.md): add the AAR or the SPM package to your project.
- [Getting started](getting-started.md): derive the default account and first addresses, verified against public test vectors.
- [Transactions](transactions.md): assemble, sign, and decode transactions.
- [Messages and intents](messages-and-intents.md): message signatures, challenges, and transaction intents.
- [Reference](reference.md): the complete function table, data formats, and error variants.
- [Migrating from WASM](wasm-migration.md): port existing `@mintlayer/wasm-lib` / connect-sdk code.
