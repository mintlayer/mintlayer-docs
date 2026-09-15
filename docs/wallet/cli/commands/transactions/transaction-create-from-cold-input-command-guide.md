---
title: "transaction-create-from-cold-input"
sidebar_position: 111
---

Creates a transaction that spends from a specific address, and returns the change to the same address (unless one is specified), without signature.

This is used for withdrawing amounts from cold storage without changing the ownership address. The resulting unsigned transaction can be signed using `account-sign-raw-transaction` in the cold wallet, then broadcast through any hot wallet.

The transaction has one input and two outputs: the amount sent to the destination, and the change returned to the input's owner.

## Usage

```
transaction-create-from-cold-input [OPTIONS] <ADDRESS> <AMOUNT> <UTXO>
```

## Arguments

- **`<ADDRESS>`**: The receiving address of the coins.

- **`<AMOUNT>`**: The amount to send, in decimal format.

- **`<UTXO>`**: The UTXO to spend. Can be from a transaction output or a block reward output:
  - `tx(<txid>,<index>)` e.g. `tx(000000000000000000059fa50103b9683e51e5aba83b8a34c9b98ce67d66136c,1)`
  - `block(<block_id>,<index>)` e.g. `block(000000000000000000059fa50103b9683e51e5aba83b8a34c9b98ce67d66136c,2)`

## Options

- **`--change <CHANGE_ADDRESS>`**: Optional change address. If not specified, change is returned to the same address as the input.

## Workflow

1. Run `transaction-create-from-cold-input` on the hot wallet to produce an unsigned transaction hex.
2. Transfer the hex to the cold wallet.
3. Run `account-sign-raw-transaction <HEX>` in the cold wallet to sign it.
4. Broadcast the signed transaction with `node-submit-transaction` from the hot wallet.

## Related

- [`account-sign-raw-transaction`](../accounts-addresses/account-sign-raw-transaction-command-guide.md): Sign the unsigned transaction in the cold wallet.
- [`node-submit-transaction`](../node-control/node-submit-transaction-command-guide.md): Broadcast the signed transaction.
