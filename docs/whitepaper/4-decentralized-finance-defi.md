# 4. Decentralized Finance (DeFi)

## 4.1. Script-based smart contracts and Turing incompleteness

Smart contracts on a blockchain mostly consist of particular conditions for locking and unlocking funds. There are three common approaches to smart contracts in the crypto ecosystem: the script-based primarily used in Bitcoin, the Solidity contract used in the Ethereum Virtual Machine \(EVM\), and, more recently, the Web Assembly Virtual Machine \(WASM\), seen in projects like EOS or Polkadot.

Both EVM and WASM are Turing-complete, which means that the system can process whatever rule-set of data manipulation, opening up virtually infinite possibilities for developers to create smart contracts. Instead, Mintlayer uses the Bitcoin-like script-based approach: it is non-Turing complete and therefore limited by a determined set of rules that must be followed. This approach sacrifices some versatility in exchange for higher safety, sustainability, and speed of validation.

Generally, script-based smart contracts tend to produce less network pollution and execute faster than Turing-complete contracts, thus ensuring a more manageable environment for developers. On the contrary, complicated architectures on blockchains end up causing more issues than benefits: having endless possibilities might end up clogging servers, while at its core, a Turing-complete system is not even required by most blockchain applications.

The Ethereum whitepaper [ \($$^1‎^0$$\)](4-decentralized-finance-defi.md#footnotes) states that “Turing-incompleteness is not even that big of a limitation”. Out of all the contract examples that the Ethereum team had conceived when writing a whitepaper, only one required a loop, and even that loop could be removed by making 26 repetitions of a one-line piece of code. A more recent study[ \($$^1‎^1$$\)](4-decentralized-finance-defi.md#footnotes) says that only 6,9% of smart contracts built on the Ethereum Virtual Machine truly require Turing-complete language functions. It also notes that the vast majority of Ethereum’s smart contracts can be coded to function the same way on a Turing-incomplete machine.

To prevent potentially infinite loops in an EVM environment, which requires excessive resources, the contract execution is limited by the gas \(ETH\). The problem is, when a smart contract runs out of gas, the transaction is nullified \(the fee in ETH gas is paid to the miner in any case\). Therefore, it is necessary to provide enough gas in advance to cover the worst-case scenario, which is very difficult to foresee.

It is one of the main reasons why Solidity smart contracts have shown a higher probability of breaking over time: among the historical failures, more notable ones are the DAO hack and Parity's multiple signature validation program. On the other hand, the possibilities provided by a script-based system are sufficient and proportionate to the purpose of Mintlayer’s DeFi and DEX functionalities, without incurring the risks of Turing completeness. By combining several simple scripts, it is possible to produce highly advanced contracts.

Two very primitive script-based smart contracts are the **multi-signature account** and the **time lock**. **Multi-signature** requires a number n of signatures over m to unlock a specific unspent output, whereas **time lock** requires that the output is spent only after block x, or only n blocks after the event x occurred \(event x might also be a particular transaction or block\). Combining these two simple scripts together makes it possible to create sophisticated contracts while keeping the high reliability, efficiency, and predictability of their basic components.

The potentiality and versatility of a script-based approach are well expressed in the development of a very particular smart contract, which has been the major focus of the entire Bitcoin developers’ community in the last years: Lightning Network. It allows locking funds in a bilateral channel between two nodes \(A and B\), while particular unlocking requirements let the nodes update the balance of bitcoins held by each one.

The revolutionary innovation is the possibility to combine more of these bilateral channels to create a payment route across the network. If a third node C is connected to B through a second channel, the bitcoins can flow between all the nodes A, B, and C just by updating the balances of two channels. Extending this mechanism to a vast network of channels can effectively create an off-chain peer-to-peer layer on top of Bitcoin, allowing to send and receive bitcoin without using transactions written on the blockchain.

Mintlayer supports Lightning Network for all MLS-01 tokens and other HTLC script-based contracts used explicitly for the DEX, like atomic swap \([§5.2.](5-decentralized-exchange-dex.md#5-2-the-atomic-swap-dex)\) or lightning swaps \([§5.7.](5-decentralized-exchange-dex.md#5-7-lightning-network-dex)\), which are also interoperable with the Bitcoin blockchain.



## 4.2. Security tokens and stablecoins

On Mintlayer, MLS-01 tokens represent the most versatile tokenization technology to digitize securities. Tokenizing security means representing an ownership right \(such as shares in a company\) or a credit in a token. This right is usually guaranteed by the token issuer, who is contractually bound to recognize the token as a bearer security.

The token can also represent an asset in the issuer's custody: an example is stablecoin Tether, which has the dollar as its underlying asset, held by Tether Inc. On a theoretical level, stablecoins can be included within the broader definition of security tokens, although in some jurisdictions, the classification may be different for legal reasons.

While cryptocurrencies like Bitcoin are issued in a decentralized way, the issuance of security is always centralized, meaning the issuing entity is also prosecutable by the authorities or central entities. Despite this, the advantage of a blockchain for security is palpable: the blockchain is the first technology capable of transferring bearer securities in digital form without relying on a centralized system.

In the case of security tokens, the topic revolves around the transfer, not the issuance. However, it still makes the difference as the security can be sold directly by the company without intermediaries or even traded on a DEX for other cryptocurrencies \(i.e., Bitcoin\). The token may also grant administrative rights concerning company shares, where the token buyer exercises his rights cryptographically and anonymously by demonstrating ownership of the security using his private key.

Mintlayer’s architecture offers various tools for developing decentralized finance with particular regard for securities: Access-Control-List with verification through a decentralized identity, programmable pools to pay dividends, and tax transactions.

It is possible to picture a future in which companies or self-employed people freely issue shares or bonds on a blockchain and then transfer them without any friction. Private arbitrators elected by the parties handle fraud cases of the token issuer. Examples of fraud cases might be:

* The business profits are not redistributed as scheduled based on the distribution of the assigned tokens;
* The administrative rights associated with the token are denied;
* The token inflation does not meet the expected schedule, or tokens are burned/locked by the issuer against the terms of the public offering.

Some of these frauds might be prevented if the MLS-01 token representing the security is issued without the possibility for the token issuer to intervene in these factors, such as the generation of new tokens \(inflation control\). However, in most cases, such rigidity might not be well-suited for securities. Therefore, when serious disputes arise, the token’s digital nature and the total absence of frictions in the exchanges would immediately lead to a fall in its value, undermining the issuer’s credibility. This incentive mechanism provides a market equilibrium in the use of these instruments.



## 4.3. ACL rules for securities

[//]: # (![]&#40;/static/images/frame-69.png&#41;)

Access-Control-List \(ACL\) acts as a filter dedicated to limit the transferability property of a token. By default, any address can transfer and use the token without any limitations unless the token creator defined some ACL upon its launch. Among the rules defined, there is also the possibility \(or impossibility\) to change those rules in the future once the token is live on the mainnet.

One purpose that can be identified for ACL is to allow trading and transfer of security tokens that need to comply with particular company policies or legislation. Some limits can be enforced on the input or the output of a transaction.

On the input side:

1. It is possible to enforce an upper or lower bound on the amount transferred;
2. Time locks can be enforced \(i.e., the UTXO cannot be spent until block x\);
3. A particular address can be blocked so that all UTXO from that address are frozen and cannot be transferred.

On the output side:

1. Only specific addresses can receive a transaction: in this case, the standard policy is to deny the transaction unless the requirement is met \(the output address is whitelisted\);
2. A certain address cannot receive a transaction: in this case, the standard policy is to allow any transaction unless the restriction is met \(the output address is blacklisted\);
3. Conditional whitelisting/blacklisting: a particular address can or cannot receive the transaction depending on the amount transferred \(upper or lower bounds\) or the lock time;

From a technical point of view, the rules are enforced through one or a series of filters and an action: _allow, deny, or check:_

* If the action is deny, and at least one of the filters is met, then the transaction cannot be validated;
* In case of allow action, the transaction can be validated only if all the filters are met;
* In case of check action, the transaction is validated only if it passes another set of rules used for another token. The check action can be used in case of multiple tokens issued with the same policy conditions or if more tokens share a common set of rules \(recalled with check\) on top of which other rules are specifically enforced for each different token. For example, the token issuer can specify or inherit the ACL that is already defined by a trusted third party in charge of the AML/KYC procedures.

[//]: # (![]&#40;../.gitbook/assets/frame-70.png&#41;)

An additional _control_ parameter can be configured when there is a need for a particular entity to approve each transaction of the token. The entity is defined as “controller” and shall “countersign” the transaction for its validation. The difference from a simple 2/2 multi-signature is that this ACL control rule requiring the controller's signature can be combined with other ACL rules or any other desired multi-signature scheme for the UTXO. For example, the users might use a ⅗ multi-sig account to hold the tokens, which can only be transferred by providing at least 3 signatures together with the controller’s signature \(so that it effectively becomes a 4/6 scheme\) and whatever other ACL rules that are configured for that token.

The controller can be the token issuer, a service, an identity provider, or more generically, an oracle. The standard identification procedure required to ask the controller for the countersignature can be performed using the DID \([§4.4.](4-decentralized-finance-defi.md#4-4-decentralized-identity-did-and-oracles)\).



## 4.4. Decentralized Identity \(DID\) and Oracles

The Mintlayer full node and light node provide a tool for creating a digital identity represented by a pair of keys: public and private. These keys can be used to encrypt/decrypt or sign/verify messages and verify the “decentralized identity”.

The DID can be used to “sign-up” or “login” to services of an oracle or directly as data is processed by the oracles to identify a particular user for generating statistics or ranking \(i.e., for the DEX transactions\). In general, oracles empower the blockchain’s inner mechanisms with data unavailable inside the blockchain. AML/KYC oracles may certify the DID countersigning their transactions to meet ACL rules. In contrast, other oracles might help the wallets perform specific tasks, such as provide better reliability of the atomic swap allowed by the watchtowers \([§3.2.4.](3-tokenization-standard.md#3-2-4-atomic-swap)\). Observers \([§5.4.](5-decentralized-exchange-dex.md#5-4-observer-of-multiparty-swaps)\) and book aggregators \([§5.5.](5-decentralized-exchange-dex.md#5-5-book-aggregators-for-multiparty-swaps)\) in DEX help synchronize the DHT and create storage for a proper order book.

Technically, the DID is a master public key \(also known as Account Extended Public Key[ $$^1‎^2$$](4-decentralized-finance-defi.md#footnotes)\) produced by a wallet’s built-in tool. It is possible to use DID as one of the keys derived from that master key. The master private key or the derived private keys are used to sign the message, proving the user’s identity.

Services may rely on a trusted third party that acts as a personal identity verifier \(i.e., a KYC provider\) so that the user does not need to submit the KYC procedures for all the registration processes with every service. Instead, users execute the KYC with a single identity provider and then verify themselves with all the services by signing a message with their DID.

The user may also publicly sign up for different services with different public keys, all derived by the same master public key used for the registration to the KYC provider so that the signup is not publicly attributable to the user’s physical identity. In this case, since the user privately provided the derivation path to the service he is using, only the service \(and not even the KYC provider\) can trace the DID back to the master public key. The service asks the KYC provider for personal information only if it is necessary for compliance reasons.



## 4.5. Programmable Pools (dividends, taxation)

There are occasions when using script-based transactions can cause more network pollution, for example, when moving small amounts that are not consolidated in a single account, as it happens on account-based systems \(i.e., Ethereum\). For this reason, Mintlayer allows users to switch from UTXO to an account base with programmable pools.

A programmable pool can be used to pay out dividends or collect “tax” on each transaction of a specific token. Some tokens can be created with ACL rules, requiring that each transaction passes through the programmable pool. In that case, the transaction will necessarily execute the programmable pool’s rule set to be validated, which may enforce sending a fee to a specific address \(taxation\) or all the addresses holding a certain amount of tokens \(dividends\).

The amounts paid for taxes and dividends increase the balance of an account-based recipient, not a UTXO. The accounts can be cleared with a transaction by creating a new UTXO of the same amount of money in the account-based balance \(minus the fee paid to the blockmaker for that transaction\).

The rule set of a programmable pool can be configured by its creator, indicating the address or addresses entitled to collect the taxes/dividends or the rule by which those addresses are selected:

1. **Dividends**: an address can receive a share of the funds held in an indicated reserve, depending on how many tokens it stores \(which might be security tokens representing quotas of the shareholders\). The programmable pool creator defines:

    * Specific address\(es\) entitled to receive the funds, proportionally distributed to a set of UTXO;
    * A defined share of funds the beneficiary needs to hold, which is required to be eligible as a beneficiary of the dividends;
    * The reserve address\(es\) from where dividends are paid;
    * The combination with any ACL filter.

2. **Taxation**: an indicated address can receive taxes for each transaction made with a specific token. The programmable pool’s creator defines:
    * The address that collects the taxes;
    * A fixed quantity of token to be paid as tax for each transaction;
    * In other cases, a specific percentage of the amount transferred to be used as a tax.

To create a pool and execute the pool’s functionalities, it is necessary to broadcast a transaction with a specific OP\_CODE. The pool rule set can be configured to determine a pool owner who has the ability to update or destroy the pool.

The smart contracts within a programmable pool might have Turing complete functionalities, in this case the advantages of a Turing incomplete system are not applicable.


