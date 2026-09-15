---
title: "Wallet & Signing (WASM)"
description: "Generate a Mintlayer wallet and sign transactions and messages with the Go SDK's embedded WASM runtime: no wallet daemon, full custody."
sidebar_position: 7
---

# Wallet & Signing (WASM)

The Go SDK embeds the same WASM cryptography runtime that the wallets use ([wazero](https://wazero.io/), no CGO). With it you can generate and restore wallets, derive addresses, and sign transactions entirely in your own process, there is no wallet daemon holding your keys.

This guide covers the wallet side; building arbitrary transactions is covered in [Forging custom transactions](custom-transactions.md) and the [Building Transactions](../sdks/go/transactions.md) reference.

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

Initialization compiles the embedded WASM module (~400 ms); do it once per process.

## Generating a wallet

A Mintlayer wallet is a **BIP-39 mnemonic** plus the derivation hierarchy the runtime implements (`m/44'/coin_type'/0'` for the default account, then `current/0/index` for receiving and `current/1/index` for change keys). Generate the 12/24 words with any standard BIP-39 library, then hand them to the runtime:

```go
mnemonic := "legal winner thank year wave sausage worth useful legal winner thank yellow"

// Default account extended private key
accountKey, err := c.MakeDefaultAccountPrivkey(mnemonic, mintlayer.Mainnet)
if err != nil {
    log.Fatal(err)
}

// First receiving address
recvKey, err := c.MakeReceivingAddress(accountKey, 0)
pubKey, err   := c.PublicKeyFromPrivateKey(recvKey)
addr, err     := c.PubkeyToPubkeyHashAddress(pubKey, mintlayer.Mainnet)
fmt.Println(addr) // mxtc1q...
```

Derive more addresses by iterating the key index:

```go
func deriveAddresses(c *mintlayer.Client, accountKey []byte, network mintlayer.Network, count uint32) []string {
    addrs := make([]string, 0, count)
    for i := uint32(0); i < count; i++ {
        key, err := c.MakeReceivingAddress(accountKey, i)
        if err != nil {
            log.Fatal(err)
        }
        pub, err := c.PublicKeyFromPrivateKey(key)
        if err != nil {
            log.Fatal(err)
        }
        addr, err := c.PubkeyToPubkeyHashAddress(pub, network)
        if err != nil {
            log.Fatal(err)
        }
        addrs = append(addrs, addr)
    }
    return addrs
}
```

Change addresses derive identically via `MakeChangeAddress(accountKey, i)`.

:::danger

The mnemonic is the wallet. Anyone with the words holds every derived key. Generate it in a secure environment, never log it, and persist it (encrypted) before using the derived keys for anything valuable.

:::

### Single-key wallets

For ephemeral or single-purpose keys (faucet hot keys, tests), skip the mnemonic entirely:

```go
privKey, err := c.MakePrivateKey() // random key
pubKey, err := c.PublicKeyFromPrivateKey(privKey)
addr, err    := c.PubkeyToPubkeyHashAddress(pubKey, mintlayer.Testnet)
```

### Watch-only wallets

From an extended private key you can export the extended public key and derive **addresses without any private key**: useful for monitoring services:

```go
accountXPub, err := c.ExtendedPublicKeyFromExtendedPrivateKey(accountKey)

// First receiving address, public derivation only
recvPub, err := c.MakeReceivingAddressPublicKey(accountXPub, 0)
```

## Signing a transaction

Signing follows the eight-step flow documented in [Building Transactions](../sdks/go/transactions.md): encode inputs and outputs, build the unsigned transaction, produce witness bytes per input with `EncodeWitness`, and assemble with `EncodeSignedTransaction`. Condensed:

```go
tx, err := c.EncodeTransaction(encodedInputs, encodedOutputs, 0)

var witnessBytes []byte
for i := range utxos {
    w, err := c.EncodeWitness(
        mintlayer.SigHashAll,
        spendKey,      // private key from derivation above
        fromAddr,      // address owning the UTXO
        tx,
        allUtxoBytes,  // per-input UTXO entries (see reference)
        uint32(i),
        mintlayer.TxAdditionalInfo{},
        0,             // block height, 0 when no timelock constraint
        mintlayer.Mainnet,
    )
    if err != nil {
        log.Fatalf("sign input %d: %v", i, err)
    }
    witnessBytes = append(witnessBytes, w...)
}

signedTx, err := c.EncodeSignedTransaction(tx, witnessBytes)
```

Inspect the result without broadcasting:

```go
txID, err := c.GetTransactionID(signedTx, true)
json, err := c.DecodeSignedTransactionToJS(signedTx, mintlayer.Mainnet)
```

Broadcast via the indexer (`SubmitTransaction`) or the node (`P2PSubmitTransaction`); see step 8 of the [reference](../sdks/go/transactions.md#step-8-assemble-and-submit).

Special inputs use dedicated witnesses: `EncodeWitnessNoSignature` (fill-order inputs need no signature), `EncodeWitnessHTLCSpend` and `EncodeWitnessHTLCRefundSingleSig` (HTLC inputs).

## Signing messages

Prove control of an address with a challenge-response exchange:

```go
// Signer side
signature, err := c.SignChallenge(spendKey, []byte("login-nonce-1234"))

// Verifier side
ok, err := c.VerifyChallenge(addr, mintlayer.Mainnet, signature, []byte("login-nonce-1234"))
```

`VerifyChallenge` checks the signature against the bech32m address. For spending-authorization messages (transaction intents), use `SignMessageForSpending` / `VerifySignatureForSpending` instead; see [Transaction intents](custom-transactions.md#transaction-intents).

## Cheat sheet

| Task | Call |
| ---- | ---- |
| Wallet from mnemonic | `MakeDefaultAccountPrivkey` |
| Receiving / change key | `MakeReceivingAddress` / `MakeChangeAddress` |
| Address from key | `PublicKeyFromPrivateKey` → `PubkeyToPubkeyHashAddress` |
| Random key | `MakePrivateKey` |
| Watch-only derivation | `ExtendedPublicKeyFromExtendedPrivateKey` + `MakeReceivingAddressPublicKey` |
| Sign one input | `EncodeWitness` |
| Assemble signed tx | `EncodeSignedTransaction` |
| Sign a message | `SignChallenge` / `VerifyChallenge` |
