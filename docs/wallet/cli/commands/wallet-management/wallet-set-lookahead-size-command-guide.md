---
title: "wallet set-lookahead-size"
sidebar_position: 131
---

> **Legacy spelling:** this command was previously spelled `wallet-set-lookahead-size`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Set the lookahead size for key generation.

The lookahead size (also known as the gap limit) determines the number of addresses to generate and monitor on the blockchain following the last known address used in a transaction.

Only reduce this value if you are certain there are no incoming transactions using the addresses that would be dropped.

## Usage

```
wallet set-lookahead-size [OPTIONS] <LOOKAHEAD_SIZE>
```

## Arguments

- **`<LOOKAHEAD_SIZE>`**: The new lookahead size.

## Options

- **`--force`**: Required to reduce the lookahead size below the last used address index; this may cause the wallet to lose track of used addresses and show an incorrect balance.

## Examples

```
# Increase the lookahead size to 50
wallet set-lookahead-size 50

# Force a reduction below the last used address
wallet set-lookahead-size 10 --force
```

## Notes

The legacy flat spelling also accepted a positional consent value: `wallet set-lookahead-size 10 i-know-what-i-am-doing` still works and is equivalent to `--force`.

In cold wallet mode (`--cold-wallet`), this command is only available through its legacy flat spelling `wallet-set-lookahead-size`; cold wallets do not accept the nested grammar.
