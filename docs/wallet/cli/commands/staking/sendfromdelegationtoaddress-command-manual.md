---
title: "`sendfromdelegationtoaddress` Command Manual"
sidebar_position: 75
---
:::warning[Removed command]

This command is no longer available in current wallet-cli versions. use [`delegation-withdraw`](delegation-withdraw-command-guide.md) instead.

:::



The `sendfromdelegationtoaddress` command provides users with the ability to send tokens from a delegation to a specific address within the wallet interface.

## Usage

```
sendfromdelegationtoaddress <ADDRESS> <AMOUNT> <DELEGATION_ID>
```

## Arguments
1. `<ADDRESS>`: The destination address where you want to send the tokens.

2. `<AMOUNT>`: The number of tokens you want to send.

3. `<DELEGATION_ID>`: The unique identifier of the delegation from which you are sending tokens.

## Example

```
Wallet> sendfromdelegationtoaddress tmt1q9p6q46...jg3kfvx0llpu 1000 tdelg14xnrh2...c75vk3mhssuq6ux2
```

NOTE: tokens will be locked for 2,000 blocks, which is roughly equivalent to 3 days, following the operation.
