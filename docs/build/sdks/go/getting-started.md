---
title: "Getting Started"
description: "Set up the Mintlayer Go SDK: installation, first call, networks and ports, amounts, error handling, and testing."
sidebar_position: 2
---

# Getting Started

This page covers everything needed to get a project running with the Go SDK: installation, the first call, networks, units, error handling, and testing. The sub-client references ([Node](node.md), [Indexer](indexer.md), [Wallet](wallet.md), [WASM](wasm.md)) document the full API surface.

## Requirements

- **Go 1.21+** (module `github.com/mintlayer/go-sdk`)
- No CGO: the WASM cryptography runtime is embedded in the binary via [wazero](https://wazero.io/)
- Whichever services your code talks to: a synced [node-daemon](../../../node/index.md) for chain/mempool access, an [api-web-server](../../../getting-started/install/install-from-docker.md#running-the-api-server-stack) for indexer data, and/or a wallet-rpc-daemon for signing. For development setups see [Developer Setup](../../development.md).

## Installation

```bash
go get github.com/mintlayer/go-sdk
```

## First call

Create the top-level client with the URLs of the services you need, and query the chain tip:

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
    tip, err := client.Indexer.GetTip(ctx)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("chain tip: height=%d id=%s\n", tip.BlockHeight, tip.BlockID)
}
```

Notes:

- Every remote call takes a `context.Context`.
- Only the sub-clients whose URL is set are created; use the top-level client when you need several, or import sub-packages (`node`, `indexer`, `wallet`, `wasm`) directly when you need one.
- The WASM cryptography runtime is initialized lazily; call `client.InitWASM(ctx)` once per process (~400 ms) before using `client.WASM`, or use `sync.Once` with the `wasm` package directly.

## Networks and endpoints

| Service | Mainnet | Testnet | Protocol |
| ------- | ------- | ------- | -------- |
| node-daemon RPC | `3030` | `13030` | JSON-RPC 2.0 (HTTP and WebSocket) |
| api-web-server (indexer) | `3000` | `13000` | REST under `/api/v2/` |
| wallet-rpc-daemon RPC | `3034` | `13034` | JSON-RPC 2.0 |

All three clients accept options: basic auth for the node and wallet (`node.WithBasicAuth`, `wallet.WithBasicAuth`) and per-client timeouts (`node.WithTimeout`, ...). The indexer API is unauthenticated. Loopback `http://` is fine; for remote daemons prefer TLS or an authenticated tunnel.

Cryptography functions that derive addresses or are fork-sensitive take the network explicitly (`sdk.Mainnet`, `sdk.Testnet`, ...).

## Amounts

All coin and token amounts are atom counts: **1 ML = 100,000,000,000 atoms** (11 decimal places). The wallet client models amounts as `wallet.Amount{Atoms: "..."}`; the WASM client uses `mintlayer.NewAmount("...")`. Token amounts use the token's own decimals.

## Error handling

- The node client returns daemon errors as `*node.RPCError` with a numeric `Code` and `Message`.
- The indexer client returns non-2xx responses as `*indexer.HTTPError` with a `StatusCode` field.
- The wallet client surfaces daemon JSON-RPC errors analogously; always check the `error` return before using a result.

## Testing

- The SDK repository ships its own test suite (`go test ./...`) plus runnable programs in [examples/](https://github.com/mintlayer/go-sdk/tree/master/examples) (`send-coins`, `issue-token`) and [testnet-live/](https://github.com/mintlayer/go-sdk/tree/master/testnet-live), which run against the public testnet.
- For your own code, test against **testnet**: get TML from the [faucet](https://faucet.mintlayer.org) (testnet addresses start with `tmt1`) and point the clients at the testnet ports above.
- For fully local iteration, run a [regtest node](../../../build/development.md#running-a-node-for-development) and generate blocks on demand, no faucet required.

## Next steps

- [Node Client](node.md), [Indexer Client](indexer.md), [Wallet Client](wallet.md), [WASM Client](wasm.md): the full API references
- [Building Transactions](transactions.md): the full-custody flow without the wallet daemon
- [Guides](../../../guides/go/index.md): tokens, NFTs, staking, orders, and atomic swaps in Go
