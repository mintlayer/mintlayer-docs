---
title: "token-unmint"
sidebar_position: 108
---

Unmint existing tokens and reduce the circulating supply.

Unminting reduces the circulating supply and puts the unminted tokens back under the issuer's control. The wallet must own the tokens being unminted.

## Usage

```
token-unmint <TOKEN_ID> <AMOUNT>
```

## Arguments

- **`<TOKEN_ID>`**: The id of the token to unmint.

- **`<AMOUNT>`**: The amount to unmint.

## Notes

The selected account must own both the tokens being unminted and the token's authority key. Unminting is not possible if the supply has been locked with `token-lock-supply`.

## Related

- [`token-mint`](token-mint-command-guide.md): Mint tokens and increase the circulating supply.
- [`token-lock-supply`](token-lock-supply-command-guide.md): Permanently lock the supply.
