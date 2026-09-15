---
title: "node-ban-peer-address"
sidebar_position: 40
---

Ban an address in the node for the specified duration.

## Usage

```
node-ban-peer-address <ADDRESS> <DURATION>
```

## Arguments

- **`<ADDRESS>`**: The IP address to ban.

- **`<DURATION>`**: How long to ban the address. Supports a compact format:
  - `1M`, 1 month
  - `1y 3M 10d 6h 30m 45s`, 1 year, 3 months, 10 days, 6 hours, 30 minutes, 45 seconds

## Examples

```
# Ban an address for 1 week
node-ban-peer-address 1.2.3.4 7d

# Ban for 1 month
node-ban-peer-address 1.2.3.4 1M
```

## Related

- [`node-unban-peer-address`](node-unban-peer-address-command-guide.md): Unban an address.
- [`node-list-banned-peers`](node-list-banned-peers-command-guide.md): List banned addresses.
