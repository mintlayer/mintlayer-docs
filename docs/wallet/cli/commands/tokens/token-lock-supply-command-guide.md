---
title: "token-lock-supply"
sidebar_position: 103
---

Lock the circulating supply for the token. **THIS IS IRREVERSIBLE.**

Once locked, tokens lose the ability to be minted or unminted. The current circulating supply becomes the permanent total supply.

## Usage

```
token-lock-supply <TOKEN_ID>
```

## Arguments

- **`<TOKEN_ID>`**: The id of the token whose supply will be locked.

## Notes

This operation is only available for tokens issued with `lockable` supply. It cannot be undone. The selected account must own the token's authority key.

## Related

- [`token-issue-new`](token-issue-new-command-guide.md): Issue a token (supply type is set at issuance).
- [`token-mint`](token-mint-command-guide.md): Mint tokens before locking supply.
- [`token-unmint`](token-unmint-command-guide.md): Unmint tokens before locking supply.
