---
title: "address reveal-public-key"
description: "Reveal the public key behind a public key hash address, in address encoding or as a hex string."
sidebar_position: 12
---

> **Legacy spelling:** this command was previously spelled `address-reveal-public-key-as-address` (address output) or `address-reveal-public-key-as-hex` (hex output). Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Reveal the public key behind the specified "public key hash" address, in address encoding or as a hex encoded string.

## Usage

```
address reveal-public-key [OPTIONS] <PUBLIC_KEY_HASH>
```

## Arguments

- **`<PUBLIC_KEY_HASH>`**: A standard public key hash address (e.g. one returned by `address new` or `address list`).

## Options

- **`--format <FORMAT>`**: Output format of the revealed public key.
  - `address` (default): the public key in address encoding.
  - `hex`: the public key as a hex encoded string.

## Examples

```
# Public key in address encoding
address reveal-public-key mtc1qyerxzjxfpz9zy2n7dfs73yvhglyfy5f8hkmmfu0

# Public key as a hex encoded string
address reveal-public-key --format hex mtc1qyerxzjxfpz9zy2n7dfs73yvhglyfy5f8hkmmfu0
```

## Notes

The "public key address" uses a different prefix from a normal transaction address (e.g. `mptc` on mainnet vs `mtc`). It is used in specific contexts such as specifying the staking key when creating a pool with `staking create-pool`. It is not a normal address to be used in transactions; it is preferred to take addresses from the `address list` command.

## Related

- [`address new`](address-new-command-guide.md): Generate a new unused address.
- [`address list`](address-list-command-guide.md): Show receive-addresses with their usage state.
