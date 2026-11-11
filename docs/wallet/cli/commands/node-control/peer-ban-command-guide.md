---
title: "peer ban"
sidebar_position: 40
---

> **Legacy spelling:** this command was previously spelled `node-ban-peer-address`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Ban an address in the node for the specified duration.

## Usage

```
peer ban <ADDRESS> <DURATION>
```

## Arguments

- **`<ADDRESS>`**: The IP address to ban.

- **`<DURATION>`**: How long to ban the address. Supports a compact format:
  - `1M`, 1 month
  - `1y 3M 10d 6h 30m 45s`, 1 year, 3 months, 10 days, 6 hours, 30 minutes, 45 seconds

## Examples

```
# Ban an address for 1 week
peer ban 1.2.3.4 7d

# Ban for 1 month
peer ban 1.2.3.4 1M
```

## Related

- [`peer unban`](peer-unban-command-guide.md): Unban an address.
- [`peer banned`](peer-banned-command-guide.md): List banned addresses.
