---
title: "staking-show-legacy-vrf-key"
sidebar_position: 86
---

Shows the legacy VRF key that uses an abandoned derivation mechanism.

This key will not be used for new pools and should be avoided.

## Usage

```
staking-show-legacy-vrf-key
```

## Notes

This command is available in cold wallet mode (`--cold-wallet`). It exists for compatibility purposes only. For all new pools, use `staking-show-vrf-public-keys` to view current VRF keys.

## Related

- [`staking-show-vrf-public-keys`](staking-show-vrf-public-keys-command-guide.md): Show current VRF keys.
- [`staking-new-vrf-public-key`](staking-new-vrf-public-key-command-guide.md): Generate a new VRF key.
