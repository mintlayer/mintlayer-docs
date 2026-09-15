---
title: "delegation-stake"
sidebar_position: 27
---

Send coins to a delegation id to be staked.

## Usage

```
delegation-stake <AMOUNT> <DELEGATION_ID>
```

## Arguments

- **`<AMOUNT>`**: The amount of coins to delegate for staking.

- **`<DELEGATION_ID>`**: The delegation id to send coins to.

## Notes

The delegation must have been created first with `delegation-create`. The pool associated with the delegation will stake the coins on your behalf. You retain full ownership and can withdraw at any time with `delegation-withdraw`, subject to a lock period.

## Related

- [`delegation-create`](delegation-create-command-guide.md): Create a delegation.
- [`delegation-withdraw`](delegation-withdraw-command-guide.md): Withdraw coins from a delegation.
- [`delegation-list-ids`](delegation-list-ids-command-guide.md): List your delegation ids and balances.
