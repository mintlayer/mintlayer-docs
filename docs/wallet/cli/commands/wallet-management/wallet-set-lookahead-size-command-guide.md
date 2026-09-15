---
title: "wallet-set-lookahead-size"
sidebar_position: 131
---

Set the lookahead size for key generation.

The lookahead size (also known as the gap limit) determines the number of addresses to generate and monitor on the blockchain following the last known address used in a transaction.

Only reduce this value if you are certain there are no incoming transactions using the addresses that would be dropped.

## Usage

```
wallet-set-lookahead-size <LOOKAHEAD_SIZE> [I_KNOW_WHAT_I_AM_DOING]
```

## Arguments

- **`<LOOKAHEAD_SIZE>`**: The new lookahead size.

- **`[I_KNOW_WHAT_I_AM_DOING]`**: *(Optional)* Required to force a reduction below the last used address index. This may cause the wallet to lose track of used addresses and show an incorrect balance.
  - Possible value: `i-know-what-i-am-doing`

## Examples

```
# Increase the lookahead size to 50
wallet-set-lookahead-size 50

# Force a reduction below the last used address
wallet-set-lookahead-size 10 i-know-what-i-am-doing
```

## Notes

This command is available in cold wallet mode (`--cold-wallet`).
