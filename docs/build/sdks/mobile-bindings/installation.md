---
title: "Installation & versioning"
description: "Add the Mintlayer wallet bindings to an Android app (versioned AAR) or an iOS app (Swift Package Manager), and how releases are tagged and versioned."
sidebar_label: Installation
sidebar_position: 2
---

# Installation & versioning

Consumers never need a Rust toolchain: each release attaches ready-built artifacts to the [GitHub releases page](https://github.com/mintlayer/rust-sdk/releases), tagged `wallet-bindings-vX.Y.Z`.

## Android

Each release attaches `mintlayer-wallet-bindings-<ver>.aar`, containing the native libraries for `arm64-v8a`, `armeabi-v7a` and `x86_64` (Android 6.0+, API 24).

1. Download the AAR from the release page.
2. Verify its SHA-256 against the `SHA256SUMS` manifest attached to the same release.
3. Place it in your app's `app/libs/` directory and add it to `app/build.gradle.kts`:

```kotlin
dependencies {
    implementation(files("libs/mintlayer-wallet-bindings-<ver>.aar"))
}
```

The Kotlin API lives under the `org.mintlayer.wallet.bindings` package.

## iOS

The iOS artifact is an XCFramework (iOS 15+, device and Apple Silicon simulator slices), consumed through Swift Package Manager. The repository root carries a `Package.swift` whose binary target pins the released artifact by URL + SHA-256, so Xcode resolves everything from the repository URL:

1. In Xcode: **File > Add Package Dependencies…**
2. Enter the repository URL: `https://github.com/mintlayer/rust-sdk`
3. Add the product **`MintlayerWalletBindings`** to your app target.

```swift
import MintlayerWalletBindings
```

The underlying FFI module is `MintlayerWalletBindingsFFI`; application code only interacts with the `MintlayerWalletBindings` wrapper.

:::note[React Native / Expo]

The iOS 15 deployment target matches the React Native minimum; the bindings are plain Kotlin/Swift, so they work both from native code and from a React Native turbo-module or Expo config plugin that bridges to them.

:::

## Versioning

- Releases are tagged `wallet-bindings-vX.Y.Z` on [github.com/mintlayer/rust-sdk](https://github.com/mintlayer/rust-sdk), matching the `version` in `bindings/Cargo.toml`.
- **Major** bump: breaking change to the FFI surface. **Minor**: additive exports. **Patch**: fixes.
- Every release attaches the AAR, the XCFramework zip and a `SHA256SUMS` manifest; changes are recorded in the repository `CHANGELOG.md`.

Pin an explicit version in your dependency management and review the release notes before upgrading.
