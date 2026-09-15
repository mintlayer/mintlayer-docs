---
title: "token-change-metadata-uri"
sidebar_position: 100
---

Change the metadata URI of a token.

## Usage

```
token-change-metadata-uri <TOKEN_ID> <METADATA_URI>
```

## Arguments

- **`<TOKEN_ID>`**: The id of the token to update.

- **`<METADATA_URI>`**: The new metadata URI (e.g. a URL pointing to a website or media resource).

## Notes

The selected account must own the token's authority key to perform this operation.

## Related

- [`token-change-authority`](token-change-authority-command-guide.md): Change the authority address of a token.
- [`token-issue-new`](token-issue-new-command-guide.md): Issue a new token.
