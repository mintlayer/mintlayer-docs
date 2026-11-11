---
title: "challenge verify"
sidebar_position: 18
---

> **Legacy spelling:** this command was previously spelled `challenge-verify-plain`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Verifies a signed challenge against an address.

## Usage

```
challenge verify <MESSAGE> <SIGNED_CHALLENGE> <ADDRESS>
```

## Arguments

- **`<MESSAGE>`**: The plain-text message that was signed. Pass the message as hex encoded bytes with the `--hex` flag (the legacy spelling `challenge-verify-hex` corresponds to this variant).

- **`<SIGNED_CHALLENGE>`**: The hex encoded signed challenge (produced by `challenge sign`).

- **`<ADDRESS>`**: The address whose private key was used to sign the message.

## Notes

This command is available in cold wallet mode (`--cold-wallet`).

## Related

- [`challenge sign`](challenge-sign-command-guide.md): Sign a plain-text challenge.
