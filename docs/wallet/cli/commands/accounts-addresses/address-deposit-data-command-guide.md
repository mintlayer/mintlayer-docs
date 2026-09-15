---
title: "address-deposit-data"
sidebar_position: 9
---

Store data on the blockchain.

The data is provided as a hex string. Note that there is a high fee for storing data on the blockchain.

## Usage

```
address-deposit-data <HEX_DATA>
```

## Arguments

- **`<HEX_DATA>`**: The data to deposit on the blockchain, encoded as a hex string. Do **not** prefix the value with `0x`.

## Examples

```
# Store the hex-encoded string "hello"
address-deposit-data 68656c6c6f
```

## Notes

- Data stored on the blockchain is permanent and publicly visible.
- Fees for data storage are significantly higher than for regular transactions.
