---
title: "token-unfreeze"
sidebar_position: 107
---

Unfreeze the token, making all operations available for it again.

This is only possible if the token was frozen with the `unfreezable` option. Tokens frozen as `not-unfreezable` cannot be unfrozen.

The selected account must own the token's authority key to unfreeze it.

## Usage

```
token-unfreeze <TOKEN_ID>
```

## Arguments

- **`<TOKEN_ID>`**: The id of the token to unfreeze.

## Related

- [`token-freeze`](token-freeze-command-guide.md): Freeze a token.
- [`token-issue-new`](token-issue-new-command-guide.md): Issue a token with freezability configured.
