---
title: "token-issue-new"
sidebar_position: 102
---

Issue a new fungible token.

Issuing a token defines its properties and total supply. To make tokens spendable, the authority must then `token-mint` them, moving them from the total supply into the circulating supply.

## Usage

```
token-issue-new <TOKEN_TICKER> <NUMBER_OF_DECIMALS> <METADATA_URI> <AUTHORITY_ADDRESS> <TOKEN_SUPPLY> <IS_FREEZABLE>
```

## Arguments

- **`<TOKEN_TICKER>`**: The ticker/symbol for the token (e.g. `MYTKN`).

- **`<NUMBER_OF_DECIMALS>`**: The maximum number of decimal places for the token.

- **`<METADATA_URI>`**: A URI for data related to the token (website, media, etc.).

- **`<AUTHORITY_ADDRESS>`**: The address of the authority who will be able to manage this token (mint, unmint, freeze, change URI, etc.).

- **`<TOKEN_SUPPLY>`**: The total supply of the token. Valid values are:
  - `unlimited`, no cap on supply
  - `lockable`, supply can be locked (made fixed) later with `token-lock-supply`
  - `fixed(<amount>)`, a fixed, immutable total supply

- **`<IS_FREEZABLE>`**: Whether the token can be centrally frozen for all users (e.g. for migration or compliance purposes).
  - `freezable`
  - `not-freezable`

## Examples

```
# Issue a token with a fixed supply of 1,000,000 and 8 decimal places
token-issue-new MYTKN 8 https://example.com <authority_address> fixed(1000000) not-freezable

# Issue a token with unlimited supply that can be frozen
token-issue-new MYTKN 8 https://example.com <authority_address> unlimited freezable
```

## Related

- [`token-mint`](token-mint-command-guide.md): Mint tokens into the circulating supply.
- [`token-lock-supply`](token-lock-supply-command-guide.md): Permanently lock the token supply.
- [`token-freeze`](token-freeze-command-guide.md): Freeze the token.
- [`token-nft-issue-new`](token-nft-issue-new-command-guide.md): Issue a non-fungible token (NFT).
