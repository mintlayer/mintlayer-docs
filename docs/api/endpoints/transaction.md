---
title: "Transactions"
description: "Transaction endpoints of the Mintlayer indexer API: list, lookup, merkle path, and single UTXO output."
sidebar_position: 3
---

# Transaction endpoints

## GET /transaction

Lists transactions, newest first. Supports [pagination](../conventions.md#pagination) with `offset` and `items`.

```bash
curl "https://api-server.mintlayer.org/api/v2/transaction?offset=0&items=1"
```

```json
[
  {
    "block_id": "9887b79f2ff7610e932a51012812aaec10bf72569638bdbf8e91197734e80a97",
    "confirmations": "34",
    "fee": { "atoms": "148200000000", "decimal": "1.482" },
    "flags": 0,
    "id": "0d737672be3ab99eac02ad7bdbf22403f5c31369ce74774da2b438b74799a52c",
    "inputs": [
      {
        "input": {
          "index": 0,
          "input_type": "UTXO",
          "source_id": "536e50e9b9e0bccb44ec195225ea5fc2f06307a233c14eaf9f57d192e5fc419e",
          "source_type": "Transaction"
        },
        "utxo": {
          "destination": "mtc1q8n9u3g3aw4h40gsagxn7yw0jatdfe9xsuftnvur",
          "type": "Transfer",
          "value": { "amount": { "atoms": "3947888348193000", "decimal": "39478.88348193" }, "type": "Coin" }
        }
      }
    ],
    "is_replaceable": false,
    "outputs": [],
    "timestamp": 1789467559,
    "tx_global_index": 1234567,
    "version_byte": 0
  }
]
```

Each entry includes the resolved inputs (`utxo` is the output being spent, so you can see amounts and destinations without a second lookup) and the transaction `outputs`.

Query parameters:

| Parameter | Description |
| --------- | ----------- |
| `offset`, `items` | Standard [pagination](../conventions.md#pagination) |
| `offset_mode` | `legacy` (default) or `absolute` for stable pagination over the global index. See [Conventions](../conventions.md#pagination) |

## GET /transaction/\{id\}

Returns a single transaction by ID (64-character hex), with the same shape as the list entries above.

```bash
curl https://api-server.mintlayer.org/api/v2/transaction/0d737672be3ab99eac02ad7bdbf22403f5c31369ce74774da2b438b74799a52c
```

Returns 404 if the transaction is unknown.

## GET /transaction/\{id\}/merkle-path

Returns the transaction's merkle proof in its block, usable for SPV-style inclusion verification.

```json
{
  "block_id": "9887b79f2ff7610e932a51012812aaec10bf72569638bdbf8e91197734e80a97",
  "merkle_path": ["3b2a75c2b69e0b7172ec29bcebd267644b6dd0076b3e9e483ff94cac8887bce4"],
  "merkle_root": "a68b3c..."
}
```

## GET /transaction/\{id\}/output/\{index\}

Returns a single UTXO output of a transaction (the output at position `{index}`), as stored in the UTXO set. Returns an error if the output index does not exist or the output was already spent.

> **Note:** as of September 2026, the production deployment returns `400 Bad request` for this endpoint. It works as documented when running `api-web-server` from current sources yourself.

## Go SDK

```go
txs, err := client.Indexer.ListTransactions(ctx, indexer.PageOpts{Items: 10})  // GET /transaction
tx, err := client.Indexer.GetTransaction(ctx, txID)                            // GET /transaction/:id
mp, err := client.Indexer.GetTransactionMerklePath(ctx, txID)                  // .../merkle-path
utxo, err := client.Indexer.GetTransactionOutput(ctx, txID, 0)                 // .../output/:idx
```

See the [indexer client reference](../../build/sdks/go/indexer.md#transactions).
