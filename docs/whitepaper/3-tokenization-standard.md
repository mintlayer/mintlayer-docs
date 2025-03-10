# 3. Tokenization standard

The MLS-01 acronym stands for Mintlayer Standard version 0.1. It represents the basic standard specification for Mintlayer tokens, featuring a typical list of rules that have to be implemented to be correctly processed by a Mintlayer wallet. Thanks to the standard, every MLS-01 can be received, sent, or stored in any Mintlayer multi-token wallet. Once the wallet is installed, every exchange or service will be ready to receive any token issued on Mintlayer.&#x20;

When an MLS-01 token is created, the issuer specifies the following rules:&#x20;

* A maximum total token supply (if there is a cap).&#x20;
* The amount of token that is issued, including the address or addresses where they are held (usually the creation address) and the inflation scheme that shall follow.&#x20;
* Who or what can generate new tokens: i.e., a private key, a multi-signature, or other scripts.
* Which are Access-Control-List rules (see [§3.2.1.](3-tokenization-standard.md#3-2-1-access-control-list-conditions), [§4.3.](4-decentralized-finance-defi.md#4-3-acl-rules-for-securities)), if any.&#x20;
* If the ACL rules are permanent or can be updated. In the latter case, what are the conditions for an update as well (script, keys).&#x20;
* If the total supply/inflation scheme is permanent or can be updated (if that is the case, what are the conditions for an update).&#x20;
* If the transactions with that token pay an additional fee to the network fee (which is paid to the blockmaker creating Mintlayer blocks) and the way it is collected ([see programmable pools §4.5.](4-decentralized-finance-defi.md#4-5-programmable-pools-dividends-taxation)).

If the token has the confidential transaction feature enabled, it is labeled as MLS-02, while non-fungible tokens are labeled as MLS-03.



## 3.1. UTXO structure

Mintlayer uses the Bitcoin UTXO structure instead of the account base models of Ethereum, Ripple, Stellar, or others. From a certain point of view, the UTXO model is less efficient than the account base: since each transaction's output is stored separately (even when sent to a single address), it is only possible to spend the entire transaction’s output. Therefore, most of the transactions require a change, creating what is commonly referred to as “dust” - smaller outputs that are costly to be transferred, given the fee’s weight over the transaction volume. Despite this, the UTXO model has been chosen because of three essential features:

1. It is compatible with technologies already implemented in Bitcoin, such as the atomic swap and Lightning Network.
2. It is more privacy-oriented because a single wallet usually utilizes multiple addresses, making it difficult and sometimes impossible to distinguish which ones belong to the same user.&#x20;
3. Payments can be batched together (aggregated) in a single transaction, saving a considerable amount of the space otherwise required for making a single transaction per payment. The transaction batching practice has a particular focus in Mintlayer’s value proposition, as described later ([see §3.2.3.](3-tokenization-standard.md#3-2-3-peer-to-peer-batching)). The aggregation can be made by a single service/exchange transferring multiple transactions in a limited timeframe (i.e., the withdrawal requests of exchange/services users), as well as through a peer-to-peer network among independent users. This method is currently implemented with coinjoin in bitcoin wallets like Wasabi.&#x20;



## 3.2. MLS-01 features

The MLS-01 tokens and MLT are transferred solely on the Mintlayer sidechain without the necessity to pollute the Bitcoin blockchain. The MLS-01 standard supports different transaction features:



### 3.2.1. Access-Control-List conditions

Access-Control-Lists (ACLs) are particular limitations that can be enforced on transactions of a specific cryptocurrency. ACLs help to issue or update security tokens in compliance with company policies or other legal requirements ([see §4.2.](4-decentralized-finance-defi.md#4-2-security-tokens-and-stablecoins)) similar to how it is done on Ethereum’s ERC-20: receiving addresses can be whitelisted or blacklisted. However, the applications may be broader: they can involve conditions on how utility tokens can be spent or determine how non-fungible the token is. For example, make it impossible to transfer a certain amount of tokens per transaction under a minimum or maximum threshold or enforce a time lock that limits the token's transferability at a particular time.

**ACL conditions can be implemented on MLS-01 tokens**, and the token issuer can update these conditions merely by creating a new transaction on Mintlayer that contains the updated set of rules. Such centralized governance of the ACL rules is possible only if it is applicable, depending on the set of rules originating from the token’s creation: to update the ACL, it might be necessary to execute a particular script or sign a transaction with a particular set of keys (such as n of m multi-sig).

The tokens’ ACL conditions are maintained in a separate part of the block that users can decide not to sync, saving space and speeding up the syncing process. Instead, every participant of the network (blocksigners) shall validate this part of the block.



### 3.2.2. Lightning Network

Lightning network is enabled for all tokens managed by the Mintlayer wallet. Since Mintlayer’s code-base is inherited from Bitcoin and adapted with small changes, the Lightning Network wallet functionalities use the same BOLT specifications meant for Bitcoin.

It is expected that most of the security tokens exchanged on the Mintlayer network will not use Lightning Network due to the difficulties in developing a well-distributed network of channels for tokens with a low transaction frequency and less liquidity than those meant for monetary use.

Despite that, Lightning Network does have a great chance of success as a use case for Tether transactions and other stablecoins, especially since they are frequently transferred between custodial services/exchanges that have greater chances to create well-balanced channels. In this regard, it is worthwhile to note that the DEX will also integrate Lightning Network ([see §5.7.](5-decentralized-exchange-dex.md#5-7-lightning-network-dex)).



### 3.2.3. Peer-to-peer batching

Currently, transaction batching procedures are a prevalent practice in the Bitcoin ecosystem. The blockchain analysis highlights how beneficial it is for service providers to batch payments and how these procedures also have positive externalities on the entire community, lightening the blockchain’s load.&#x20;

Although batching is not possible under account-based models like Ethereum, it is advantageous for Bitcoin and UTXO-based models. Batched transactions are easily recognizable due to the presence of three or more outputs. In contrast, a typical transaction in a UTXO model has one output, or more commonly, two outputs (one is for the change going back to an address of the sender).

In March 2018, an analysis by Nic Carter and [@hasufl](https://twitter.com/hasufl) [($$^2$$)](3-tokenization-standard.md#footnotes) reported that between 40% to 60% of the volumes transferred are in batched transactions, accounting for 40% of the total output moved on the blockchain. A similar analysis [($$^3$$)](3-tokenization-standard.md#footnotes) has been made on a sample of almost 1 million transactions (932.278) taken from 3 different months (August, July, June 2020).

In terms of outputs, the results closely match the previously mentioned research (42% of all outputs are batched), whereas the sample shows 33% of the volumes batched. When Coinbase introduced batching in March 2020, their load on the Bitcoin network was reduced by “more than 50%”, as reported by Eli Haims, Coinbase product manager. That 50% saving in space led to an actual 75.2% saving in fees, [($$^4$$)](3-tokenization-standard.md#footnotes) as reported. It is worth noting that, with signature aggregation (requiring on Bitcoin[$$^5$$](3-tokenization-standard.md#footnotes)), the savings in terms of space are up to 70%.

Several big companies introduced batching procedures so late due to the technical complexities required in manually aggregating transactions. For this reason, Mintlayer helps users with this task, providing a dedicated user interface for the traditional batching.

Mintlayer develops two different tools inside the wallet to incentivize the use of batching:&#x20;

1. A unique user interface to help the services/businesses like the exchanges to massively batch transactions (of all MLS-01 tokens).&#x20;
2. A peer-to-peer system of batching, inspired by Wasabi’s coinjoin, where users can send one or multiple tokens to one or several destination addresses, all while combining the transaction with other users.&#x20;

If the first tool is merely a UI improvement, the more notable innovation of Mintlayer is the extension of batching procedures to every user, not only services and exchanges that process many payments at the same time. Thanks to the communication system between wallets, users can ask other peers to aggregate the payments in a single transaction. While it is inspired by Wasabi coinjoin, batching on Mintlayer extends to every transaction type, not only payments of the same amount[($$^6$$)](3-tokenization-standard.md#footnotes). Users can aggregate transactions made in different MLS-01 tokens and use signature aggregation to reduce each payment’s size by 70%.

With the implementations mentioned above, the expected amount of batched outputs is higher than 50%. If the blockchain gets saturated, every user can rely on batching not only for privacy reasons but also for paying lower fees. However, paying lower fees for aggregating payments is not the only benefit of such an approach. Since payment aggregation mixes inputs and outputs, blockchain analysis becomes much more challenging.



### 3.2.4. Atomic swap

In general, an atomic swap transaction allows two users to exchange tokens between different blockchains.

1.  **User A creates a transaction, sending an amount of BTC to user B.** The transaction output has some specific conditions:

    1. B can grab the coins within a specific timeframe (about 24 hours - 144 Bitcoin blocks). Otherwise, A can get back the coins[($$^7$$)](3-tokenization-standard.md#footnotes). This clause ensures that A does not lose money in case the exchange would not happen.&#x20;
    2. B’s only condition to spend those coins within 24 hours is to claim them before A, which is possible only if B knows a “secret” X revealed by A himself.



    B does not know the secret X, but A sends the result of a hash function of that secret h(x) to B.
2. **User B creates a transaction, sending USDT to user A in exchange for the BTC.** The transaction output has some specific conditions:
    1. A can grab the coins within a specific timeframe (about 12 hours). Otherwise, B can get his coins back.&#x20;
    2. The only condition that allows A to spend those coins within 12 hours is to reveal the secret. The “key” to unlock the output of the transaction is the secret x.

A must reveal X to grab the coins sent by B and has about 12 hours to do so. Once A grabs the coins, B knows the secret X and is able to take the BTC sent by A.

Even if A reveals the secret at the last hour (12th), B has additional 12 hours to take the BTC sent by A since the locktime for the first transaction's output is 24 hours instead of 12.

If A does not reveal the coins, both the users will get back their assets within 12 and 24 hours respectively. If everything goes as expected, both users will receive the coins in the first blocks validated on the respective chain (Bitcoin and Mintlayer).

The only flaw of a traditional cross-chain atomic swap is that the timelock (nLockTime parameter on Bitcoin) cannot be reliable as one of the blockchains may remain stuck behind due to hashrate variability. Possible reorganizations or other factors may also come into play, depending on the specific blockchain structure and rules.

Moreover, if one of the transactions involved in the atomic swap has relatively lower fees, the user might not be able to spend the output before the lock time expires. It may even invalidate the swap, leading to loss of funds for that user while the counterpart grabs all the coins on both chains.

Mintlayer bypasses these issues by introducing the **first reliable cross-chain Bitcoin atomic swap**. Since it is structured as a Bitcoin sidechain, each Mintlayer block carries a reference to the Bitcoin blockchain. The nLockTime of the two transactions returning the coins to the sender is calculated in the exact number of Bitcoin blocks counted on both chains.

Moreover, the wallet also provides the CPFP (child pays for parent) functionality, speeding up the atomic swap transaction if it is stuck in the mempool due to too low fees. For example, the wallet can collaborate with a watchtower (even controlled by the user himself, or by a service provider/oracle) to notify the user when the transaction spending output is late and suggest a proper CPFP transaction fee amount.

The atomic swap technology is at the base of the concept of a decentralized exchange. Mintlayer implements it either for cross-chain DEX transactions (between two MLS-01 tokens) or intra-chain transactions (between BTC and MLS-01 tokens). [See §5.](5-decentralized-exchange-dex.md) for more information about the DEX.



### 3.2.5. Gas free economy

The default fee for any transaction on Mintlayer is set to MLT unless the user chooses otherwise. In that case, the fee is automatically expressed in the token that the user is transferring. The user can still decide which token to use to pay fees, among those available in the wallet.

It is expected that most of the blocksigners will accept all the major MLS-01 tokens. Considering the fee economy is a free market, block proposers have incentives to accept any token as long as it has a recognized value in the market. Otherwise, transactions left behind might be grabbed by the next blocksigner. Simultaneously, this game theory mechanism may lead to the rejection of illiquid tokens, constituting an effective spam filter.

The network participants that need to calculate the fee value (i.e., to choose which transaction is more convenient, in case the chain is saturated) will query data prices from a centralized exchange (using API) or DEX oracles.

When preparing a transaction, the wallet UI suggests a fee amount for each token based on an algorithm that analyzes the Mintlayer’s mempool and past transactions.

Blockmakers can also signal if they will accept a new token in the next blocks that they will produce.



## 3.3. Confidential Transactions (MLS-02)

A token can be issued on the network by implementing Bullet-proof Confidential transactions with ring signatures[($$^8$$)](3-tokenization-standard.md#footnotes), which is the feature for the tokenization standard: MLS-02. The issuance of tokens that enables confidential transactions is a guarantee of privacy and anonymity. However, it is discouraged unless there is a real need for privacy since it comes with a tradeoff: CTs take more space (higher fees), require more resources for the verification, and cannot be batched in transactions with multiple payments. Thanks to the peg-in mechanism, it is possible to issue a confidential version of other cryptocurrencies (pegged on Mintlayer, [see §3.4.](3-tokenization-standard.md#3-4-wrapped-tokens-and-peg-in-federation)), such as m-BTC or m-Ether, to transfer already existing cryptocurrencies with higher anonymity.

It is worthwhile to note that, even if a token is issued without implementing the CT method, Mintlayer’s UTXO model grants some level of confidentiality:&#x20;

1. It is possible to have multiple independent addresses for a single account/wallet;&#x20;
2. Lightning Network transactions provide higher privacy;&#x20;
3. Peer-to-peer batching effectively mixes inputs, outputs, and signatures of different users, making chain analysis much more difficult.



## 3.4. Wrapped tokens and Peg-in federation

It is possible to use the Mintlayer blockchain as a second layer for other blockchains like Bitcoin or Ethereum. Central entities can wrap tokens on Mintlayer: they lock-in funds on the main blockchain, which creates a corresponding amount of MLS-01 or MLS-02 tokens. Independent oracles can prove the existence of the corresponding amount of locked tokens on the main blockchain. In this way, it is possible to create confidential tokens on Mintlayer([§3.3.](3-tokenization-standard.md#3-3-confidential-transactions-mls-02)), such as m-BTC or m-ETH.

It is also possible to implement Strong Federations (like Liquid[$$^9$$](3-tokenization-standard.md#footnotes)) to issue wrapped tokens and confidential assets. The federation cyclically renews the lock time (nLockTime on Bitcoin) of the transaction, freezing the funds in the multi-signature UTXO and creating the corresponding token on Mintlayer. It is always possible the peg-out of the token: in that case, the Mintlayer tokens are burned, while the original cryptocurrency is unlocked on the main network and available to the original owner.



![](https://lh3.googleusercontent.com/RsDcp99BVw-Fu6zFGXlknBhQaHmgjhpPehwVUmHVC\_HlwQmnQE2KXZ-yb6iEcgj7-j4EfrBJZy\_91b8UMkDYvRej3rfsHB8nGC8gVIcOtth5AEYc8EGELsRANEcum9RGwOdUmJcL)

Developers are free to use a combination of ACL, programmable pools, and oracles to create more sophisticated smart contracts on the Mintlayer chain and bind the issuance or existence of MLS-01 tokens to their corresponding amount locked on other blockchains (or even to automatically bind MLS tokens through oracles with assets that exist out of the digital realm).



