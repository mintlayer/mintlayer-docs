---
title: "newpublickey"
sidebar_position: 38
---

The `newpublickey` command is used to generate a new, unused public key within the currently selected account in your Mintlayer wallet.

### Understanding Public Keys

In cryptographic systems, a public key is a large numerical value that is used to encrypt data. In the context of blockchain and cryptocurrencies, public keys are derived from private keys and can be shared openly. Addresses, which are used for transactions, are typically derived from these public keys.

## Usage

To generate a new unused public key, simply use the following command:

```
newpublickey
```

### Output

Upon execution, the command will return a fresh public key that hasn't been used for any previous transactions within the selected account. For example:

```
0003f14cb4fb0a064803769e644e561d05dbfe5498c5b2893b89d9887d85e92f463b
```

### Important Notes

- Public keys are essential components in the cryptographic mechanisms that ensure the security and integrity of transactions on the blockchain.
- While public keys can be shared openly, always ensure that the corresponding private keys are kept secure and private.

## Options

- `-h, --help`: Displays the help message for the `newpublickey` command.
