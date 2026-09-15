---
title: "Transaction submission"
description: "POST /transaction endpoint of the Mintlayer indexer API, including its gating and body format."
sidebar_position: 12
---

# Transaction submission

## POST /transaction

Submits a signed transaction to the Mintlayer network through the indexer's connected node.

```bash
curl -X POST "https://api-server.mintlayer.org/api/v2/transaction" \
  -H "Content-Type: application/octet-stream" \
  --data-binary @signed-tx.hex
```

- The body is the hex-encoded signed transaction (the `signed-tx.hex` file contains the hex string, without `0x` prefix and without newlines).
- On success the endpoint returns the transaction ID as a JSON string.
- Invalid encodings return HTTP 400 with a JSON error body.

### Gating

This endpoint is **disabled by default**. The server returns `403 Forbidden` unless it was started with the `--enable-post-routes` flag (see the [api-web-server CLI reference](../../reference/cli/api-web-server.md)).

The request body size is capped (currently 1 MB). The production API operated by Mintlayer does **not** enable this route; to submit transactions over this path, run your own api-web-server. Alternatives:

- Submit via the node's RPC: the [`node-submit-transaction`](../../wallet/cli/commands/node-control/node-submit-transaction-command-guide.md) wallet-cli command
- Submit via the wallet: [`address-send`](../../wallet/cli/commands/accounts-addresses/address-send-command-guide.md) and related wallet commands

## Go SDK

The SDK's indexer client exposes submission when the target server enables it:

```go
txID, err := client.Indexer.SubmitTransaction(ctx, signedTxHex)
```

See the [indexer client reference](../../build/sdks/go/indexer.md).
