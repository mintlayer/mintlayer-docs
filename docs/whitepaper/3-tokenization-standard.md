---
title: "Tokenization standard"
description: "Mintlayer whitepaper chapter: Tokenization standard."
sidebar_position: 3
---

## 3.0 Tokenization Standards

In Mintlayer, issuing a token does not require a smart contract; instead, it is a built-in feature of the protocol. A token is represented by a `TokenId` in a `Output`. 

```rust

pub enum OutputValue \{
    Coin(Amount), // ML Token is build-in
    TokenV1(TokenId, Amount), // Any other token must specify a TokenId
\}
```


A `TokenId` is defined as:
```rust

pub enum Token \{\}
pub struct Id<T> \{
    hash: H256,
\}
pub type TokenId = Id<Token>;
```


This essentially means that within the system, a token exists as a collection of Outputs, each owned by different parties.

## 3.1 Fungible Tokens (MLS01)

Standard fungible tokens, serving a similar role to Ethereum's ERC-20, are defined by the MLS-01 standard on Mintlayer. MLS-01 represents the most basic form of token on the chain. Due to the simplicity of Mintlayer's UTXO architecture, creating these tokens is significantly more straightforward than on competing chains, where a contract written in a language like Solidity is required. Any token adhering to the MLS-01 standard should be compatible with all Mintlayer wallets.

An MLS-01 token has several associated features, including a ticker, an issuance amount, a number of decimals for the issuance amount, and a metadata URI and a replaceble authority. A token can also support features such as increasing the circulating supply or preventing further increases in the circulating supply. 


```rust

pub struct TokenIssuanceV1 \{
    pub token_ticker: Vec<u8>,
    pub number_of_decimals: u8,
    pub metadata_uri: Vec<u8>,
    pub total_supply: TokenTotalSupply,
    pub authority: Destination,
    pub is_freezable: IsTokenFreezable,
\}
```


## 3.2 Non Fungible Tokens NFT (MLS03)
Non-fungible tokens, often referred to as NFTs, are implemented through the MLS-03 standard on Mintlayer. Similar to NFTs on other blockchains, they represent unique tokens. They function in a manner akin to MLS-01 tokens, with the key difference being that they do not require handling a supply, as each NFT is one-of-a-kind. However, NFTs do possess additional data attributes: a creator, a name, a description, an icon, a media hash, and a media URI.


```rust

   pub struct Metadata \{
      pub creator: Option<TokenCreator>,
      pub name: Vec<u8>,
      pub description: Vec<u8>,
      pub ticker: Vec<u8>,
      pub icon_uri: DataOrNoVec<u8>,
      pub additional_metadata_uri: DataOrNoVec<u8>,
      pub media_uri: DataOrNoVec<u8>,
      pub media_hash: Vec<u8>,
   \}
```


## 3.3 Confidential Token (MLS02)

The MLS-02 standard represents a similar token to MLS-01 but with the added benefit and complexity of being a privacy-focused token that allows for zero-knowledge based private transactions.

> NOTE: This feature is currently under development and will be part of a future upgrade. Please note that technical details are subject to change
> \{.is-danger\}


---


*[Next: Decentralized finance](4-decentralized-finance-defi.md)*
