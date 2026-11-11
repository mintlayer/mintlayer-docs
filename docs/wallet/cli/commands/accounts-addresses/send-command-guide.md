---
title: "send"
sidebar_position: 14
---

> **Legacy spelling:** this command was previously spelled `address-send`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Send a given coin amount to a given address. The wallet will automatically calculate the required fees.

Optionally, you can also specify the UTXOs to be used.

## Usage

```
send <ADDRESS> <AMOUNT> [UTXOS]...
```

## Arguments

- **`<ADDRESS>`**: The receiving address of the coins.

- **`<AMOUNT>`**: The amount to send, in decimal format (e.g. `1.5`).

- **`[UTXOS]...`**: *(Optional)* Specific UTXOs to spend, space-separated. A UTXO can be from a transaction output or a block reward output:
  - Transaction output: `tx(<txid>,<index>)`
  - Block reward output: `block(<block_id>,<index>)`

## Examples

```
# Send 10 coins to an address
send <address> 10

# Send 0.5 coins using a specific UTXO
send <address> 0.5 tx(000000000000000000059fa50103b9683e51e5aba83b8a34c9b98ce67d66136c,1)

# Send using multiple specific UTXOs
send <address> 5 tx(000000000000000000059fa50103b9683e51e5aba83b8a34c9b98ce67d66136c,1) block(000000000000000000059fa50103b9683e51e5aba83b8a34c9b98ce67d66136c,2)
```
