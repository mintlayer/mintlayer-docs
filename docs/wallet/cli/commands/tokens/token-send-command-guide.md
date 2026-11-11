---
title: "token send"
sidebar_position: 106
---

> **Legacy spelling:** this command was previously spelled `token-send`. Both spellings work, but only the nested spelling shown here appears in `help` and tab completion (v1.4.5+).

Send the given token amount to the given address.

The wallet will automatically calculate the required fees.

## Usage

```
token send <TOKEN_ID> <ADDRESS> <AMOUNT>
```

## Arguments

- **`<TOKEN_ID>`**: The id of the token to send.

- **`<ADDRESS>`**: The destination address to receive the tokens.

- **`<AMOUNT>`**: The amount of tokens to send.

## Related

- [`token mint`](token-mint-command-guide.md): Mint tokens into the circulating supply.
- [`send`](../accounts-addresses/send-command-guide.md): Send coins (not tokens) to an address.
