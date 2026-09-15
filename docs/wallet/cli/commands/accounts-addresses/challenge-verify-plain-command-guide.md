---
title: "challenge-verify-plain"
sidebar_position: 18
---

Verifies a signed challenge against an address.

## Usage

```
challenge-verify-plain <MESSAGE> <SIGNED_CHALLENGE> <ADDRESS>
```

## Arguments

- **`<MESSAGE>`**: The plain-text message that was signed.

- **`<SIGNED_CHALLENGE>`**: The hex encoded signed challenge (produced by `challenge-sign-plain`).

- **`<ADDRESS>`**: The address whose private key was used to sign the message.

## Notes

This command is available in cold wallet mode (`--cold-wallet`).

## Related

- [`challenge-sign-plain`](challenge-sign-plain-command-guide.md): Sign a plain-text challenge.
