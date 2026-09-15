---
title: "Go SDK"
description: "The Mintlayer Go SDK: one client for the node, indexer, wallet RPCs and the embedded WASM cryptography runtime."
sidebar_position: 1
---

# Go SDK

The Go SDK is the full-coverage Mintlayer SDK: it wraps the node RPC, the indexer REST API, and the wallet RPC as typed Go clients, and embeds the WASM cryptography runtime for key management and transaction building without the wallet daemon.

```bash
go get github.com/mintlayer/go-sdk
```

- Requires Go 1.21+, no CGO (the WASM runtime is embedded via [wazero](https://wazero.io/))
- Canonical API reference: [pkg.go.dev/github.com/mintlayer/go-sdk](https://pkg.go.dev/github.com/mintlayer/go-sdk)
- Source: [github.com/mintlayer/go-sdk](https://github.com/mintlayer/go-sdk)

## Architecture

A top-level `Client` wires four independent sub-clients. Import only what you need.

| Package | Purpose | Default port |
| ------- | ------- | ------------ |
| `sdk/node` | JSON-RPC 2.0 client for the node daemon | 3030 (mainnet) |
| `sdk/indexer` | REST client for the indexer (api-web-server) | 3000 (mainnet) |
| `sdk/wallet` | JSON-RPC 2.0 client for the wallet daemon | 3034 (mainnet) |
| `sdk/wasm` | Cryptography and transaction building via WASM | none (embedded) |

The sub-clients map 1:1 to the services documented in [Developer Setup](../../development.md), and the indexer client mirrors the [API endpoints](../../../api/endpoints/chain.md) endpoint-for-endpoint.

## Quick start

```go
package main

import (
	"context"
	"fmt"
	"log"

	sdk "github.com/mintlayer/go-sdk"
)

func main() {
	client := sdk.New(sdk.Config{
		NodeURL:    "http://127.0.0.1:3030",
		IndexerURL: "http://127.0.0.1:3000",
		WalletURL:  "http://127.0.0.1:3034",
	})
	defer client.Close()

	ctx := context.Background()

	// Query the chain tip from the indexer.
	tip, err := client.Indexer.GetTip(ctx)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("chain tip: height=%d id=%s\n", tip.BlockHeight, tip.BlockID)

	// Optionally initialise the embedded WASM runtime (~400 ms).
	if err := client.InitWASM(ctx); err != nil {
		log.Fatal(err)
	}

	privKey, err := client.WASM.MakePrivateKey()
	if err != nil {
		log.Fatal(err)
	}
	_ = privKey
}
```

## Guides

| Guide | Contents |
| ----- | -------- |
| [Node client](node.md) | Chainstate, mempool, P2P, block submission |
| [Indexer client](indexer.md) | Chain, blocks, transactions, addresses, pools, tokens, orders, statistics |
| [Wallet client](wallet.md) | Wallet lifecycle, accounts, balances, transactions |
| [WASM client](wasm.md) | Keys, addresses, inputs, outputs, signing, fees |
| [Transactions](transactions.md) | Building and signing transactions without the wallet daemon |
| [Staking](staking.md) | Pool creation, delegation, withdrawal |
| [Tokens](tokens.md) | Fungible tokens and NFTs: issuance, minting, freezing |

Runnable examples live in the repository under [examples/](https://github.com/mintlayer/go-sdk/tree/master/examples) (`send-coins`, `issue-token`) and [testnet-live/](https://github.com/mintlayer/go-sdk/tree/master/testnet-live).
