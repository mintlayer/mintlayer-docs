---
title: "challenge-sign-plain"
sidebar_position: 17
---

Signs a challenge with a private key corresponding to the provided address.

## Usage

```
challenge-sign-plain <MESSAGE> <ADDRESS>
```

## Arguments

- **`<MESSAGE>`**: The plain-text message to sign.

- **`<ADDRESS>`**: The address whose corresponding private key will be used to sign the message.

## Notes

The resulting signature can be verified by anyone using `challenge-verify-plain` with the message, the signature, and the address, without needing the private key.

This command is available in cold wallet mode (`--cold-wallet`).

## Related

- [`challenge-verify-plain`](challenge-verify-plain-command-guide.md): Verify a signed challenge.
