---
title: "address qr"
sidebar_position: 11
---

> **Legacy spelling:** this command was previously spelled `address-qrcode`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Creates a QR code of the provided address.

## Usage

```
address qr <ADDRESS>
```

## Arguments

- **`<ADDRESS>`**: The address to encode as a QR code.

## Examples

```
address qr mtc1qyerxzjxfpz9zy2n7dfs73yvhglyfy5f8hkmmfu0
```

## Notes

Other commands only print additional QR code output when the wallet is started with the `--qr` startup option (off by default); the `address qr` command itself always prints the QR code.
