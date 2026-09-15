---
title: "token-freeze"
sidebar_position: 101
---

Freeze the token, which forbids any operations with it (except for the optional unfreeze).

After a token is frozen, no transfers, spends, or any other operation can be performed on it.

The selected account must own the token's authority key to freeze it.

## Usage

```
token-freeze <TOKEN_ID> <IS_UNFREEZABLE>
```

## Arguments

- **`<TOKEN_ID>`**: The id of the token to freeze.

- **`<IS_UNFREEZABLE>`**: Whether the token can be unfrozen later, or is permanently frozen.
  - `unfreezable`, the token can be unfrozen with `token-unfreeze`
  - `not-unfreezable`, the freeze is permanent and cannot be reversed

## Examples

```
# Freeze a token but allow unfreezing later
token-freeze <token_id> unfreezable

# Permanently freeze a token
token-freeze <token_id> not-unfreezable
```

## Related

- [`token-unfreeze`](token-unfreeze-command-guide.md): Unfreeze a token (only possible if frozen with `unfreezable`).
- [`token-issue-new`](token-issue-new-command-guide.md): Issue a token with freezability configured.
