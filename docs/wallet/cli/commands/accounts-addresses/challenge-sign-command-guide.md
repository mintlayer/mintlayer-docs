---
title: "challenge sign"
sidebar_position: 17
---

> **Legacy spelling:** this command was previously spelled `challenge-sign-plain`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Signs a challenge with a private key corresponding to the provided address.

## Usage

```
challenge sign <MESSAGE> <ADDRESS>
```

## Arguments

- **`<MESSAGE>`**: The plain-text message to sign. Pass the message as hex encoded bytes with the `--hex` flag (the legacy spelling `challenge-sign-hex` corresponds to this variant).

- **`<ADDRESS>`**: The address whose corresponding private key will be used to sign the message.

## Notes

The resulting signature can be verified by anyone using `challenge verify` with the message, the signature, and the address, without needing the private key.

This command is available in cold wallet mode (`--cold-wallet`).

## Related

- [`challenge verify`](challenge-verify-command-guide.md): Verify a signed challenge.
