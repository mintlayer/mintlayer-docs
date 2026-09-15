---
title: "Addresses"
description: "Address endpoints of the Mintlayer indexer API: balances, UTXOs, delegations, and token authority."
sidebar_position: 4
---

# Address endpoints

All endpoints take a bech32 address (see [Conventions](../conventions.md#identifiers-and-encodings)).

## GET /address/\{address\}

Returns the address summary: coin balances, held tokens, and transaction history.

```bash
curl https://api-server.mintlayer.org/api/v2/address/mtc1q8n9u3g3aw4h40gsagxn7yw0jatdfe9xsuftnvur
```

```json
{
  "coin_balance": { "atoms": "0", "decimal": "0" },
  "locked_coin_balance": { "atoms": "0", "decimal": "0" },
  "tokens": [],
  "transaction_history": [
    "0d737672be3ab99eac02ad7bdbf22403f5c31369ce74774da2b438b74799a52c",
    "536e50e9b9e0bccb44ec195225ea5fc2f06307a233c14eaf9f57d192e5fc419e"
  ]
}
```

- `transaction_history` is ordered with the most recent transaction first.
- `tokens` lists fungible token IDs with a non-zero balance at this address.

## GET /address/\{address\}/all-utxos

Returns every UTXO paying to the address, including spent ones (with spend info).

## GET /address/\{address\}/spendable-utxos

Returns only currently spendable UTXOs. Response is an array of UTXO objects; an empty array means no spendable funds:

```json
[]
```

A spendable UTXO entry contains the outpoint (`source_type`, `source_id`, `index`), the output itself (`destination`, `type`, `value`), and confirming block info.

## GET /address/\{address\}/delegations

Returns the delegation IDs associated with the address:

```json
[]
```

## GET /address/\{address\}/token-authority

Returns the token IDs for which the address holds the authority key:

```bash
curl "https://api-server.mintlayer.org/api/v2/address/mmtc1q3v0hye8eg6vg7f7thmpy6y834u8h0r4as0hyax2/token-authority"
```

```json
[
  "mmltk1q43gmfrsau2lnev65d56a4w02a70s7j6ccvc8jlx6twy2e75fa2q45h2wd",
  "mmltk1pncjq62qx93z67e9vx5vvsufglx4sc2hdyza9xapd00we4u3zuys6cmswt"
]
```

Addresses with no token authority return an error rather than an empty list.

## Go SDK

```go
info, err := client.Indexer.GetAddressInfo(ctx, addr)        // GET /address/:address
utxos, err := client.Indexer.GetSpendableUTXOs(ctx, addr)
delegations, err := client.Indexer.GetDelegations(ctx, addr)
```

See the [indexer client reference](../../build/sdks/go/indexer.md#addresses).
