---
title: "delegation sweep"
sidebar_position: 91
---

> **Legacy spelling:** this command was previously spelled `staking-sweep-delegation`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Sweep all the coins from a delegation to a given address. The wallet will automatically calculate the required fees.

## Usage

```
delegation sweep <DESTINATION_ADDRESS> <DELEGATION_ID>
```

## Arguments

- **`<DESTINATION_ADDRESS>`**: The address that will receive all coins from the delegation.

- **`<DELEGATION_ID>`**: The delegation id to sweep.

## Notes

This withdraws the entire delegation balance in a single operation. For partial withdrawals, use `delegation withdraw`.

## Related

- [`delegation withdraw`](delegation-withdraw-command-guide.md): Withdraw a specific amount from a delegation.
- [`delegation list`](delegation-list-command-guide.md): List your delegation ids and balances.
