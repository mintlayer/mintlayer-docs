---
title: "transaction compose"
sidebar_position: 110
---

> **Legacy spelling:** this command was previously spelled `transaction-compose`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Compose a new transaction from the specified outputs and selected UTXOs.

The transaction is returned as a hex encoded PartiallySignedTransaction that can be passed to `transaction sign`. The fees that will be paid are also returned.

## Usage

```
transaction compose [OPTIONS] [OUTPUTS]...
```

## Arguments

- **`[OUTPUTS]...`**: The transaction outputs, in the format `transfer(address,amount)`.
  - Example: `transfer(tmt1q8lhgxhycm8e6yk9zpnetdwtn03h73z70c3ha4l7,0.9)`

## Options

- **`--utxos <UTXOS>`**: Specific UTXOs to spend. A UTXO can be from a transaction output or a block reward output:
  - `tx(<txid>,<index>)` e.g. `tx(000000000000000000059fa50103b9683e51e5aba83b8a34c9b98ce67d66136c,1)`
  - `block(<block_id>,<index>)` e.g. `block(000000000000000000059fa50103b9683e51e5aba83b8a34c9b98ce67d66136c,2)`

- **`--only-transaction`**: Return a simple hex encoded transaction instead of a PartiallySignedTransaction. This produces a shorter hex string but cannot be used with `transaction sign` in cold wallet mode, which requires the extra information in a PartiallySignedTransaction. Only use this if you specifically need a smaller hex string.

## Examples

```
# Compose a transaction with two outputs
transaction compose transfer(<address1>,10) transfer(<address2>,5)

# Compose spending a specific UTXO
transaction compose --utxos tx(000000000000000000059fa50103b9683e51e5aba83b8a34c9b98ce67d66136c,1) transfer(<address>,10)
```

## Related

- [`transaction sign`](transaction-sign-command-guide.md): Sign the composed transaction.
- [`node submit-transaction`](../node-control/node-submit-transaction-command-guide.md): Broadcast the signed transaction.
