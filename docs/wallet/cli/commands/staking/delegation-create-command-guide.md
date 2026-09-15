---
title: "delegation-create"
sidebar_position: 25
---

Create a delegation to a given pool id and the owner address/destination.

The owner of a delegation is the key authorized to withdraw from the delegation. The delegation creation will result in creating a delegation id, where coins sent to that id will be staked by the specified pool automatically. The pool does not have the authority to spend the delegated coins.

## Usage

```
delegation-create <OWNER> <POOL_ID>
```

## Arguments

- **`<OWNER>`**: The address that will have the authority to sign withdrawals from the delegation.

- **`<POOL_ID>`**: The pool id of the pool that will receive the delegation and stake the coins.

## Notes

After creating a delegation, use `delegation-stake` to send coins to the delegation id to begin staking. Use `delegation-list-ids` to view your delegation ids and their balances.

## Related

- [`delegation-stake`](delegation-stake-command-guide.md): Send coins to a delegation to begin staking.
- [`delegation-list-ids`](delegation-list-ids-command-guide.md): List your delegation ids.
- [`delegation-withdraw`](delegation-withdraw-command-guide.md): Withdraw coins from a delegation.
