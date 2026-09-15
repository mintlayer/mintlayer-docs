---
title: "address-show"
sidebar_position: 15
---

Show receive-addresses with their usage state.

Whether an address is marked as used is based on the blockchain, not the wallet. An address is marked as used only once a transaction involving it has been included in a block.

## Usage

```
address-show [OPTIONS]
```

## Options

- **`--include-change`**: Also show change addresses alongside the receiving addresses.

## Example Output

```
+-------+---------+----------------------------------------------+--------------------------------+---------------------+
| Index | Purpose | Address                                      | Is used in transaction history | Coins               |
+=======+=========+==============================================+================================+=====================+
| 0     | Receive | <address>                                    | Yes                            | 1000.0              |
+-------+---------+----------------------------------------------+--------------------------------+---------------------+
```
