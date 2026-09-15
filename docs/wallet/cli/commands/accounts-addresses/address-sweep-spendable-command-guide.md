---
title: "address-sweep-spendable"
sidebar_position: 16
---

Sweep all spendable coins or tokens from the specified (or all) addresses to the given destination address.

Spendable coins are any coins that are not locked, and tokens that are not frozen or locked. The wallet will automatically calculate the required fees.

## Usage

```
address-sweep-spendable [OPTIONS] <DESTINATION_ADDRESS> [ADDRESSES]...
```

## Arguments

- **`<DESTINATION_ADDRESS>`**: The address that will receive all swept coins or tokens.

- **`[ADDRESSES]...`**: *(Optional)* The specific addresses to sweep. Mutually exclusive with `--all`. At least one address must be provided if `--all` is not set.

## Options

- **`--all`**: Sweep all addresses in the account. Mutually exclusive with providing specific addresses.

## Examples

```
# Sweep all addresses to a destination
address-sweep-spendable --all <destination_address>

# Sweep specific addresses
address-sweep-spendable <destination_address> <source_address_1> <source_address_2>
```
