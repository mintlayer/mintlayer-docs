---
title: "Decentralized Finance (DeFi)"
description: "Mintlayer whitepaper chapter: Decentralized Finance (DeFi)."
sidebar_position: 4
---

## 4.1. Script-based smart contracts and Turing incompleteness

Smart contracts on a blockchain are self-executing contracts with the terms of an agreement between on-chain users written in software. These contracts exist across the blockchain's network. Bitcoin uses a script-based approach for its smart contracts, which are simple and limited in functionality due to its non-Turing complete scripting language. This approach allows for basic contractual conditions, such as multi-signature wallets that require signatures from multiple parties before funds can be spent. The Bitcoin approach's simplicity allows for easy contract verification and reduces the security scope.

On the other hand, Ethereum introduced a more advanced and flexible approach to smart contracts using Solidity, a Turing-complete programming language. These contracts are executed in the Ethereum Virtual Machine (EVM), an isolated environment within each Ethereum node that ensures smart contracts run precisely as programmed, without any possibility of downtime, censorship, fraud, or third-party interference. More recent blockchain projects like EOS and Polkadot are exploring the use of WebAssembly (WASM), a binary instruction format designed as a portable target for the compilation of high-level languages like C, C++, and Rust. This approach allows smart contracts to be written in multiple languages and run at near-native speed, offering both high performance and flexibility for smart contract development. Both EVM and WASM are Turing-complete, which means that the system can process whatever rule set of data manipulation, opening up virtually infinite possibilities for developers to create smart contracts. Instead, Mintlayer uses a Bitcoin-esque approach: it is non-Turing complete and therefore limited by a determined set of rules that must be followed. This approach sacrifices some versatility for higher safety, sustainability, and validation speed.

In general, the simplicity of Turing-incomplete smart contracts means they can be validated and executed faster than their Turing-complete counterparts. The existence of large Turing-complete smart contracts on some chains has caused networks to become polluted, which is less like to happen in a Turing-incomplete system due to the simplicity of the model and the fact contracts likely involve less data and fewer conditions and transactions. However, the issues caused by polluted chains have spurned innovation within the space as many large blockchains look for ways to allow smart contracts to exist on side chains to reduce traffic on the main chain. 

The Ethereum whitepaper [1] states, "Turing-incompleteness is not even that big of a limitation." Out of all the contract examples that the Ethereum team had conceived when writing a whitepaper, only one required a loop, and even that loop could be removed by making 26 repetitions of a one-line piece of code. A more recent study [2] says that only 6.9% of smart contracts built on the EVM truly require Turing-complete language functions. It also notes that most of Ethereum's smart contracts can be implemented to have the same core functionality without needing Turing completeness. This raises an important question, is making the developer's life easier when it comes to several niche applications more important than the sustainability and security of the chain?

To address the halting problem inherent in Turing-complete systems, Ethereum introduced the idea of gas which allows the execution of the contract to be limited and ensure its execution will complete. A Turing-incomplete system such as Mintlayer does not have to deal with the implementation details and issues caused by gas as the script is guaranteed to finish executing. As a result, a Mintlayer smart contract only requires a standard transaction fee, like in Bitcoin, which like other Mintlayer transactions, can be paid in ML or any MLS-01 token.

The inherent complexity of Solidity-based smart contracts, to use them as an archetype for Turing-complete smart contracts, has led to numerous security issues over the years; among the historical failures, more notable ones are the DAO hack and Parity's multiple signature validation program [4]. More recently, several smart contracts implemented in Vyper were exploited, to the tune of at least $60m, due to a compiler bug [3]. Avoiding complicated languages such as Vyper can thus be seen as a sensible step towards ensuring the long-term security of the chain. 

Two very primitive script-based smart contracts are the **multi-signature account** and the **time lock**. **Multi-signature** requires a number m of signatures out of a total of n to unlock a specific unspent output, whereas **time lock** requires that the output is spent only after block x, or only n blocks after the event x occurred \(event x might also be a particular transaction or block\). Combining these two simple scripts makes it possible to create sophisticated contracts while keeping the high reliability, efficiency, and predictability of their basic components.

On Mintlayer smart-contract primitives are built-in and addressable in transactions. 


## 4.2. Security tokens and stablecoins 

Mintlayer's MLS-01 tokens are the most versatile tokenization technology to digitize securities on Bitcoin. Tokenizing s security means representing an ownership right \(such as shares in a company\) or a credit in a token. This right is usually guaranteed by the token issuer, who is contractually bound to recognize the token as a bearer security. By issuing an asset on Mintlayer, the asset is exposed to the liquidity held on the Bitcoin blockchain, as users can interact with the assets directly from Bitcoin.

The token can also represent an asset in the issuer's custody, such as real estate, luxury goods, or, as most will be familiar with at this point, a stablecoin. Theoretically, stablecoins can be included within the broader definition of security tokens. However, in some jurisdictions, the classification may differ for legal reasons. From an implementation perspective, all tokenized assets on Mintlayer are the same.

Mintlayer's architecture offers various tools for developing decentralized finance. Mintlayer's tokenization system is far simpler than the solutions found in other projects. The MLS-01 standard, which exists to fill the same fungible token niche as ERC-20, is far simpler than its predecessor. In order to release a token on Mintlayer, one doesn't need to write a smart contract in a language like Solidity but can create a transaction with a few data fields filled, and once the transaction is sent, the token exists. This works as a token on Mintlayer and is no more than some extra information in the UTXO header. If you have 100 ML, which is the fee to create a token, then you can create a token with essentially no technical know-how.

```

pub struct TokenIssuance \{
    pub token_ticker: Vec<u8>,
    pub amount_to_issue: Amount,
    pub number_of_decimals: u8,
    pub metadata_uri: Vec<u8>,
\}
```


The structure defining a basic MLS-01 token on Mintlayer can be seen above. This represents the minimum set of information required to issue the token. 

In addition to the simplicity of issuing a token, Mintlayer tokens have a number of features that make them suitable for DeFi contexts. Most notably, MLS-01 tokens support multi-sig and can include a whitelist to ensure only KYC'd addresses can receive the token, which is especially useful for a security token-based context. Mintlayer's smart contract environment allows these tokens to have additional features, such as transaction taxes and dividends, to be implemented. That is to say, all of the key features one may want from a token on Ethereum can be replicated on Mintlayer in order to safely and legally issue a security token.

In addition to MLS-01, Mintlayer has NFT tokens in the form of the MLS-03 standard. These have the same basic features of the MLS-01 bar the fact they're non-fungible. Once again, these tokens can be used for a variety of DeFi and other on-chain purposes.

## 4.3. ACL rules for securities

> NOTE: This feature is currently under development and will be part of a future upgrade. Please note that technical details are subject to change
> \{.is-danger\}

Access control lists, often called whitelists, act as a filter to limit a token's transferability. By default, any address can transfer and use the token without any limitations unless the token creator defined some ACL upon its creation or added one at a later date. The token owner is able to update the ACL, at will, in the future to ensure the whitelist is always up-to-date.

One purpose that can be identified for ACLs is to allow the trading and transfer of security tokens that must comply with particular company policies or legislation. Limits can be enforced on transactions.

With a basic ACL implementation, it is possible to ensure the token can only be sent to a known address within the ACL. This means the default behavior of the token is that it cannot be sent to anyone unless their address has been added to the ACL by the token owner. An address can also be removed from the ACL to ensure it is continuously updated. More complicated tokenization rules can be implemented through the smart contract system, which could include actions akin to a superset of the ACL feature, such as requiring a minimum transfer amount or a transfer tax when the transaction comes from or goes to an address within a specific set.

It is possible to get similar behavior to an ACL without having to use one formally. By using the multi-sig functionality within Mintlayer, it is possible to require the owner, or a set of owners, to approve a transaction before it can happen. In this case, the address of the recipient can be checked offline in an entirely private fashion before the centralized entity approves. The centralized nature of this approach is not necessarily a downside as it is an inherent feature of the securities market, for which ACLs and multi-sig approvals are particularly important, and the standard approach relies on a centralized entity maintaining a public list anyway. There is a distinct benefit to this approach, a token issuer does not have to program their desired behavior onto the token or blockchain and can change their policy to approvals or even have a system too complicated to be automated in order to ensure the transaction is valid; for example, if the recipient of a transaction is not known to the token issuer an ACL approach would reject the transaction whereas a multi-sig approach would allow the issuer to whitelist the recipient offline.

## 4.4 Built-in Smart-Contracts

MLS01, MLS03 and other features like Multisig are smart-contract natively available on Mintlayer. They are controllable as Output types, see the following table:

```rust

pub enum TxOutput \{
    Transfer(OutputValue, Destination),
    LockThenTransfer(OutputValue, Destination, OutputTimeLock),
    Burn(OutputValue),
    CreateStakePool(PoolId, Box<StakePoolData>),
    ProduceBlockFromStake(Destination, PoolId),
    CreateDelegationId(Destination, PoolId),
    DelegateStaking(Amount, DelegationId),
    IssueFungibleToken(Box<TokenIssuance>),
    IssueNft(TokenId, Box<NftIssuance>, Destination),
    DataDeposit(Vec<u8>),
\}
```

In the future, we plan to introduce multiple output types to Mintlayer. For instance, features like Atomic Swaps and HTLC (Hashed Timelock Contracts) will be added as distinct types of Outputs.

### 4.4.1 Transfer
```rust

    Transfer(OutputValue, Destination),
```

The 'Transfer' output is utilized to create a simple payment transaction. 

### 4.4.2 LockThenTransfer
```rust

  LockThenTransfer(OutputValue, Destination, OutputTimeLock),
```

This smart contract is designed to send tokens to a specific destination. The recipient at the specified destination cannot spend the output before a certain time, which is defined in `OutputTimeLock`.


### 4.4.3 Burn
```rust

    Burn(OutputValue)
```

This smart contract is used to destroy the output, effectively decreasing the supply of the token.

### 4.4.4 CreateStakePool

```rust     

CreateStakePool(PoolId, Box<StakePoolData>)
```


`CreateStakePool` generates a staking pool. This function is used by the wallet to inform the network that a pledge is being committed to a staking pool. Once this is done, the software can then start generating blocks.

### 4.4.5 ProduceBlockFromStake
```rust

    ProduceBlockFromStake(Destination, PoolId)
```

This output is utilized specifically for decommissioning a staking pool, enabling the movement of funds out of the pool.

### 4.4.6 CreateDelegationId
```rust

CreateDelegationId(Destination, PoolId)
```

This output is utilized to generate a delegation. Funds can subsequently be transferred to and from this delegation for participation in a staking pool.

### 4.4.7 DelegateStaking
```rust

    DelegateStaking(Amount, DelegationId)
```

Used to send a certain amount of ML tokens to a delegation. 

### 4.4.8 IssueFungibleToken
```rust

IssueFungibleToken(Box<TokenIssuance>)
```

This output is used to create a new fungible token. For more details, refer to [Chapter 3.1: Fungible Tokens (MLS01)](3-tokenization-standard.md#31-fungible-tokens-mls01).
The cost of issuance is specified in the chain configuration constant `FUNGIBLE_TOKEN_MIN_ISSUANCE_FEE`.

### 4.4.9 IssueNft
```rust

  IssueNft(TokenId, Box<NftIssuance>, Destination)
```

This output is utilized to create a new non-fungible token (NFT). For more details, please see [Chapter 3.1: Non-Fungible Tokens (MLS03)](3-tokenization-standard.md#32-non-fungible-tokens-nft-mls03). The cost of issuance is specified in the chain configuration constant `NFT_MIN_ISSUANCE_FEE`.

### 4.4.10 DataDeposit
```rust

DataDeposit(Vec<u8>)
```

In Mintlayer, the equivalent function to Bitcoin's `OP_RETURN` is used to store arbitrary data. The maximum size for this data is defined by the `DATA_DEPOSIT_MAX_SIZE` chain config constant. Additionally, the cost for data storage is set by the `DATA_DEPOSIT_MIN_FEE`.


---

## Footnotes

[1] Buterin, V. (2014). Ethereum: A Next-Generation Smart Contract and Decentralized Application Platform. https://ethereum.org/669c9e2e2027310b6b3cdce6e1c52962/Ethereum_Whitepaper_-_Buterin_2014.pdf

[2] Jansen, M., Hdhili, F., Gouiaa, R., Qasem, Z. (2020). Do Smart Contract Languages Need to Be Turing Complete?. In: Prieto, J., Das, A., Ferretti, S., Pinto, A., Corchado, J. (eds) Blockchain and Applications. BLOCKCHAIN 2019. Advances in Intelligent Systems and Computing, vol 1010 . Springer, Cham. https://doi.org/10.1007/978-3-030-23813-1_3

[3] LearnWeb3. (2023). $60M hack on Curve Finance: Technical breakdown and reproducing the hack. https://learnweb3.io/lessons/60-m-hack-on-curve-finance-technical-breakdown-and-reproducing-the-hack/

[4] Parity technologies. (2017). A Postmortem on the Parity Multi-Sig Library Self-Destruct. https://www.parity.io/blog/a-postmortem-on-the-parity-multi-sig-library-self-destruct/

---

*[Next: Decentralized exchange](5-decentralized-exchange-dex.md)*
