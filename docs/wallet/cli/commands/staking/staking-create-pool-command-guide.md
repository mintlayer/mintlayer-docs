---
title: "staking-create-pool"
sidebar_position: 78
---

Create a staking pool. The pool will be capable of creating blocks and gaining rewards, as well as taking delegations from other users.

## Reward Distribution

Two parameters control how delegators receive rewards:

1. **Cost per block**: A fixed amount subtracted from each block reward and given directly to the pool operator.
2. **Margin ratio**: After subtracting the cost per block, this fraction of the remaining reward goes to the pool operator. The rest is distributed among delegators proportionally to their delegation amounts.

## Usage

```
staking-create-pool <AMOUNT> <COST_PER_BLOCK> <MARGIN_RATIO_PER_THOUSAND> <DECOMMISSION_ADDRESS> [STAKER_ADDRESS] [VRF_PUBLIC_KEY]
```

## Arguments

- **`<AMOUNT>`**: The amount to pledge to the pool. There is a minimum (40,000 TML). This amount and all staking rewards **cannot be withdrawn without decommissioning the pool**. To withdraw rewards without decommissioning, consider creating a pool and delegating to yourself, delegators have no withdrawal restrictions.

- **`<COST_PER_BLOCK>`**: A fixed amount in coins subtracted from each block reward and handed to the pool operator before applying the margin ratio.

- **`<MARGIN_RATIO_PER_THOUSAND>`**: The fraction of the remaining reward (after cost per block) given to the pool operator, expressed as a percentage with per-mill accuracy. For example: `0.1%` (= 0.001) or `5%` (= 0.05).

- **`<DECOMMISSION_ADDRESS>`**: The address whose key can decommission the pool. It is recommended to keep this key in cold storage.

- **`[STAKER_ADDRESS]`**: *(Optional)* The public key address of the wallet that will sign new blocks. Only needed if a different wallet will perform the staking. Must be a "public key address" (not a "public key hash address"), use `address-reveal-public-key-as-address` to convert. Leave empty if the current wallet will stake.

- **`[VRF_PUBLIC_KEY]`**: *(Optional)* The VRF public key used to produce PoS hashes during staking. Only needed if a different wallet will perform the staking. Leave empty if the current wallet will stake.

## Examples

```
# Create a pool with 40000 TML, 1 TML cost per block, 5% margin, decommission key in cold wallet
staking-create-pool 40000 1 5% <decommission_address>

# Create a pool where staking will be done by a separate wallet
staking-create-pool 40000 1 5% <decommission_address> <staker_public_key_address> <vrf_public_key>
```

## Related

- [`staking-decommission-pool`](staking-decommission-pool-command-guide.md): Decommission a pool.
- [`staking-list-pools`](staking-list-pools-command-guide.md): List your pools.
- [`address-reveal-public-key-as-address`](../accounts-addresses/address-reveal-public-key-as-address-command-guide.md): Convert a public key hash address to a public key address.
- [`staking-new-vrf-public-key`](staking-new-vrf-public-key-command-guide.md): Generate a VRF public key.
