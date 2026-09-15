---
title: "address-send"
sidebar_position: 14
---

Send a given coin amount to a given address. The wallet will automatically calculate the required fees.

Optionally, you can also specify the UTXOs to be used.

## Usage

```
address-send <ADDRESS> <AMOUNT> [UTXOS]...
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
address-send <address> 10

# Send 0.5 coins using a specific UTXO
address-send <address> 0.5 tx(000000000000000000059fa50103b9683e51e5aba83b8a34c9b98ce67d66136c,1)

# Send using multiple specific UTXOs
address-send <address> 5 tx(000000000000000000059fa50103b9683e51e5aba83b8a34c9b98ce67d66136c,1) block(000000000000000000059fa50103b9683e51e5aba83b8a34c9b98ce67d66136c,2)
```
