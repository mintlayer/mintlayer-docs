---
title: "Migrating from WASM"
description: "Port existing @mintlayer/wasm-lib and connect-sdk key and transaction code to the native Kotlin and Swift mobile bindings."
sidebar_label: Migrating from WASM
sidebar_position: 7
---

# Migrating from the WASM wrappers

The native bindings exist for the environments where the WASM wrappers cannot run: React Native and Expo apps, whose Hermes engine has no `WebAssembly` global. Browsers and Node.js should stay on the WASM path ([JavaScript SDK](../javascript/index.md)) — it is unchanged.

## What stays the same

- **Function names.** The exported surface mirrors the WASM wrappers one-for-one — `makeDefaultAccountPrivkey`, `encodeOutputTransfer`, `encodeWitness`, and the rest keep their names and parameter order.
- **Blob formats.** Keys, inputs, outputs, witnesses and transactions are the same runtime SCALE bytes. A blob captured from `@mintlayer/wasm-lib` decodes identically through the native bindings, and vice versa.
- **Outputs.** Byte-for-byte identical to `@mintlayer/wasm-lib` 1.4.0, verified in CI (see [Overview](index.md#parity-with-the-wasm-wrappers)).

## What changes

| WASM (JavaScript) | Native (Kotlin / Swift) |
| ----------------- | ----------------------- |
| `Uint8Array` blobs | `ByteArray` / `Data` (convert at your RN bridge boundary) |
| JS numbers for amounts | decimal atom strings (`"50000000000"` for 500 ML) |
| npm package `@mintlayer/wasm-lib` | AAR (Android) / SPM package (iOS), see [Installation](installation.md) |
| requires a `WebAssembly` global | none; pure native libraries |
| error via thrown values / exceptions | typed `BindingsException` / `BindingsError` |

The amounts change is the one that needs code review everywhere: JavaScript loses precision above 2⁵³, so the WASM wrappers accept JS numbers only for small values, while the native bindings take the exact 128-bit atom count as a decimal string. Convert once at the edge of your app (a `formatAmount`/`parseAmount` helper) and keep atoms as the in-app representation.

```js
// Before (WASM): amount as a JS number of atoms
encodeOutputTransfer(50000000000, address, 'testnet');
```

```kotlin
// After (Kotlin): amount as a decimal atom string
encodeOutputTransfer("50000000000", address, Network.TESTNET)
```

## Porting checklist

1. Swap the dependency: AAR for Android, `MintlayerWalletBindings` product for iOS ([Installation](installation.md)).
2. Update imports: `org.mintlayer.wallet.bindings.*` / `import MintlayerWalletBindings`; the function names are unchanged.
3. Replace `Uint8Array` with `ByteArray`/`Data` at the React Native bridge (or native) boundary.
4. Move amounts to decimal atom strings.
5. Handle the typed errors instead of generic exceptions ([Reference: Errors](reference.md#errors)).
6. Re-run your derivation against the [public test vectors](getting-started.md#verifying-against-the-test-vectors) — the address `tmt1qyxqfq37rra32sq6zhayqcpjwh4trc07mcfardwt` must appear for the test mnemonic on testnet.

If your app used the high-level [connect-sdk](../javascript/index.md) `Client`, note that the bindings are the primitive layer beneath it: there is no `Client`, no UTXO selection and no broadcast. Keep the connect-sdk patterns for chain data and port only the key/signing/encoding calls.
