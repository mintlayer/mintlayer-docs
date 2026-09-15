---
title: "delegation-withdraw"
sidebar_position: 28
---

Send coins from a delegation id (that you own) to stop staking them.

Note that withdrawing from a delegation requires a lock period before the coins become spendable.

## Usage

```
delegation-withdraw <ADDRESS> <AMOUNT> <DELEGATION_ID>
```

## Arguments

- **`<ADDRESS>`**: The address that will receive the withdrawn coins.

- **`<AMOUNT>`**: The amount to withdraw from the delegation.

- **`<DELEGATION_ID>`**: The delegation id to withdraw from.

## Related

- [`delegation-create`](delegation-create-command-guide.md): Create a delegation.
- [`delegation-stake`](delegation-stake-command-guide.md): Send coins to a delegation.
- [`delegation-list-ids`](delegation-list-ids-command-guide.md): List your delegation ids and balances.
