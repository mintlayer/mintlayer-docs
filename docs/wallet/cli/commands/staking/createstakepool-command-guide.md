---
deprecated: true
title: "createstakepool"
sidebar_position: 23
---
:::note[Deprecated command name]

This page documents a legacy command name. In current wallet versions the command is called [`staking-create-pool`](staking-create-pool-command-guide.md).

:::



This command is used to create a new stake pool.

Usage
```
createstakepool <AMOUNT> <COST_PER_BLOCK> <MARGIN_RATIO_PER_THOUSAND>
```

## Arguments
1. `[AMOUNT]`:
    - **Description**: The total amount of funds you want to allocate for the stake pool.
    - **Type**: Amount (numeric value)
2. `<COST_PER_BLOCK>`:
    - **Description**: The cost or fee that will be deducted from the total reward for each block. This represents the operational costs of running the pool and is taken off the top of the rewards before distribution to delegators. If the cost per block is greater than the total reward, the entire reward will be given to the pool owner.
    - **Type**: Amount (numeric value)
3. `<MARGIN_RATIO_PER_THOUSAND>`:
    - **Description** : This represents the margin ratio that the pool owner will earn from the total reward after deducting the cost per block. It's a ratio out of 1000 (as a decimal number between 0 and 1). For instance, if set to 0.2, it means the pool owner will earn 20% of the remaining reward after deducting the cost per block. The rest of the reward, after deducting the COST_PER_BLOCK and the pool owner's margin, is distributed to the delegators.
    - **Type**: Decimal (decimal value between 0 and 1)
4. `[DECOMMISSION_KEY]` (optional):
    - **Description**: A key used for decommissioning purposes. If provided, it can be used to decommission the stake pool.
    - **Type**: Key (alphanumeric)
## Options
`-h, --help`: Displays help information for the `createstakepool` command.

## Examples
Create a pool with 40.000 ML tokens as pledge, 10 ML tokens as cost per block and 5% commission, the rest is sent to delegators.
```
Wallet> createstakepool 40000 10 0.05
The transaction was submitted successfully
```
