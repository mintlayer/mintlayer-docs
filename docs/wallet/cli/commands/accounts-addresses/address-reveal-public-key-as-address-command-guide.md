---
title: "address-reveal-public-key-as-address"
sidebar_position: 12
---

Reveal the public key behind the specified "public key hash" address in address encoding.

Note that this is not a normal address to be used in transactions. It is preferred to take addresses from the `address-show` command.

## Usage

```
address-reveal-public-key-as-address <PUBLIC_KEY_HASH>
```

## Arguments

- **`<PUBLIC_KEY_HASH>`**: A standard public key hash address (e.g. one returned by `address-new` or `address-show`).

## Notes

The returned "public key address" uses a different prefix from a normal transaction address (e.g. `mptc` on mainnet vs `mtc`). It is used in specific contexts such as specifying the staking key when creating a pool with `staking-create-pool`.
