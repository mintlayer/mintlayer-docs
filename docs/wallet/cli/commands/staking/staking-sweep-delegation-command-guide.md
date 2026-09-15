---
title: "staking-sweep-delegation"
sidebar_position: 91
---

Sweep all the coins from a delegation to a given address. The wallet will automatically calculate the required fees.

## Usage

```
staking-sweep-delegation <DESTINATION_ADDRESS> <DELEGATION_ID>
```

## Arguments

- **`<DESTINATION_ADDRESS>`**: The address that will receive all coins from the delegation.

- **`<DELEGATION_ID>`**: The delegation id to sweep.

## Notes

This withdraws the entire delegation balance in a single operation. For partial withdrawals, use `delegation-withdraw`.

## Related

- [`delegation-withdraw`](delegation-withdraw-command-guide.md): Withdraw a specific amount from a delegation.
- [`delegation-list-ids`](delegation-list-ids-command-guide.md): List your delegation ids and balances.
