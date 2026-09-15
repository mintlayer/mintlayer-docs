---
title: "token-change-authority"
sidebar_position: 99
---

Change the authority address of a token.

The authority address is the address whose key controls token management operations such as minting, unminting, freezing, and changing the metadata URI.

## Usage

```
token-change-authority <TOKEN_ID> <ADDRESS>
```

## Arguments

- **`<TOKEN_ID>`**: The id of the token whose authority will be changed.

- **`<ADDRESS>`**: The new authority address.

## Related

- [`token-issue-new`](token-issue-new-command-guide.md): Issue a new token.
- [`token-mint`](token-mint-command-guide.md): Mint additional token supply.
- [`token-freeze`](token-freeze-command-guide.md): Freeze a token.
