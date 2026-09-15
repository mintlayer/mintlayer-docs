---
title: "token-mint"
sidebar_position: 104
---

Given a token that is already issued, mint new tokens and increase the circulating supply.

## Usage

```
token-mint <TOKEN_ID> <ADDRESS> <AMOUNT>
```

## Arguments

- **`<TOKEN_ID>`**: The id of the token to mint.

- **`<ADDRESS>`**: The address that will receive the newly minted tokens.

- **`<AMOUNT>`**: The amount to mint.

## Notes

The selected account must own the token's authority key. Minting is not possible if the token supply has been locked with `token-lock-supply`.

## Related

- [`token-unmint`](token-unmint-command-guide.md): Unmint tokens and reduce the circulating supply.
- [`token-lock-supply`](token-lock-supply-command-guide.md): Permanently lock the supply.
- [`token-issue-new`](token-issue-new-command-guide.md): Issue a new token.
