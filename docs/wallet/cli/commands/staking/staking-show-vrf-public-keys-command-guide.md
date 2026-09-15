---
title: "staking-show-vrf-public-keys"
sidebar_position: 87
---

Show the issued staking VRF (Verifiable Random Function) keys for this account.

These keys are generated when pools are created. VRF keys are used as a trustless mechanism to ensure the randomness of the staking process, where no one can control the possible outcomes, to ensure decentralization.

## Usage

```
staking-show-vrf-public-keys
```

## Notes

This command is available in cold wallet mode (`--cold-wallet`).

## Related

- [`staking-new-vrf-public-key`](staking-new-vrf-public-key-command-guide.md): Generate a new VRF key manually.
- [`staking-show-legacy-vrf-key`](staking-show-legacy-vrf-key-command-guide.md): Show the legacy VRF key.
