---
title: "Address Generator"
sidebar_position: 2
---

## Introduction
The Wallet Address Generator is a command-line utility for generating addresses for different networks in the Mintlayer blockchain. Users can specify the network, the number of addresses to generate, and provide a mnemonic phrase.

## Usage
Execute the command below to run the address generator, replacing `[OPTIONS]` with actual options as described in the subsequent section.
```shell
wallet-address-generator [OPTIONS]
```

### Options
- **--network \<NETWORK>**: Specifies the network for which addresses will be generated. Possible values are `mainnet`, `testnet`, `regtest`, and `signet`. The default is `mainnet`.
- **--address-count \<ADDRESS_COUNT>**: Specifies the number of addresses to generate and display. The default is 1.
- **--mnemonic \<MNEMONIC>**: Provides a mnemonic phrase consisting of 12, 15, or 24 words as a single quoted argument. If not specified, a new mnemonic phrase is generated and printed.
- **-h, --help**: Prints help information.
- **-V, --version**: Prints version information.

Example command:
```shell
wallet-address-generator --network testnet --address-count 5 --mnemonic 'your mnemonic phrase here'
```

## Important Note on Security
It is critical to keep the mnemonic phrase safe and secure. Anyone with access to the mnemonic can potentially access the associated addresses and funds. We strongly recommend running the address generator command on a new and unplugged computer to ensure the safety of your mnemonic. Make sure to write down and store the mnemonic in a secure location.

---
For more information and updates, visit the [Mintlayer official website](https://www.mintlayer.org/).
