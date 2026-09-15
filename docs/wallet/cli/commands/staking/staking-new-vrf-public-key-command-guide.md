---
title: "staking-new-vrf-public-key"
sidebar_position: 84
---

Issue a new staking VRF (Verifiable Random Function) key for this account.

VRF keys are used as a trustless mechanism to ensure the randomness of the staking process, where no one can control the possible outcomes, to ensure decentralization.

## Usage

```
staking-new-vrf-public-key
```

## Notes

Under normal circumstances you do not need to generate VRF keys manually. Creating a new staking pool with `staking-create-pool` will generate one automatically. This command is available for specialized use-cases, such as when setting up a pool where the staking wallet differs from the pool creation wallet.

This command is available in cold wallet mode (`--cold-wallet`).

## Related

- [`staking-show-vrf-public-keys`](staking-show-vrf-public-keys-command-guide.md): Show all issued VRF keys for this account.
- [`staking-create-pool`](staking-create-pool-command-guide.md): Create a staking pool.
