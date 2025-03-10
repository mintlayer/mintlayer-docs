# 2. Mintlayer wallet

![](https://lh3.googleusercontent.com/suX59GLiX38iJHZOPlI4HhN_Ai1sMFd3IjoGMFF7HEAA4Vq3Ay6RQo0tMQsx0xwT6Vi8AIjAEskpsH225WBlajij88WXdAkhBVmWj2JB9Nj399F9_raGS_2neLm7yrhhloOqMkJz)

Mintlayer is an open-source project, and every developer is free to contribute, fork the codebase, or create alternative software following the consensus/protocol RFC. There are two first-reference implementations released for desktop and mobile devices in the form of a full node and light node.

The full node wallet is built to serve every user type, from validators, stakers, to investors, traders or simple bitcoin holders. The mobile wallet application is made for average users with particular care for UX/UI. It also implements advanced functionalities such as transaction batching and DEX trading. Both types of wallets are non-custodial solutions, meaning that users can access their funds by managing their private keys independently, also by importing or exporting them from/to hardware wallets.

Mintlayer wallets have multi-token support, including bitcoin \(BTC\), Mintlayer \(MLT\), and all tokens issued or pegged on the chain \(the standard MLS, [see §3.](3-tokenization-standard.md#3-2-mls-01-features)\).

For security tokens or other tokens that require particular policies \(see ACL conditions [§3.2.1.](3-tokenization-standard.md#3-2-1-access-control-list-conditions)\), it is possible to verify the “decentralized digital identity” \(DID, see [§4](4-decentralized-finance-defi.md#4-4-decentralized-identity-did-and-oracles).\) straight from the application. The private key of the DID can also enable a “login” to access the services of third party providers.



## 2.1 The light wallet

A light wallet offers the basic multi-token functionalities:

* Store, send, and receive Bitcoin as any other traditional Bitcoin wallet \(Bech32 native SegWit support, hierarchical deterministic, BIP38, BIP39, BIP44, BIP49, BIP84, BIP174\).
* Store, send and receive MLT token and all **MLS-01, MLS-02, MLS-03 tokens** \([see §3](3-tokenization-standard.md).\).
* Batch transactions \([see §3.](3-tokenization-standard.md#3-2-3-peer-to-peer-batching)\) with other peers before broadcasting to the network to pay lower fees, alleviate the burden of the blockchain and fasten transactions.
* Use the Lightning Network for transactions \(BTC, MLT and MLS-01\).
* Peer-to-peer exchange BTC, MLT, and MLS-01 using **atomic swap DEX** \([see §5.2.](5-decentralized-exchange-dex.md#5-2-the-atomic-swap-dex)\).



## 2.2. The full node

A Mintlayer full node is coupled with a Bitcoin Core node. The user has to download both but does not necessarily have to wait for Bitcoin Core to fully sync up with mainnet because Mintlayer node uses Pierre Rochard’s idea of “node launcher” for rapid onboarding. This way, the node's functionalities are ready in the first minutes after launching the software[ \($$^1$$\)](2-mintlayer-wallet.md#footnotes) .

Also, Mintlayer full nodes use utreexo, which compacts the size of the UTXO set down to 1 KB. As such, pruned nodes will never take up more than around 3 GB of space \(about 3 days of blockchain at maximum throughput\) even in the very long run.

A Mintlayer full node offers all the light wallet functionalities, plus the following:

* Stake MLT tokens to become the “participant” of the network.
*  As a “participant”, propose or countersign blocks and earn transaction fees.
* Create an MLS-01 token by executing a Mintlayer on-chain transaction.
* Peg-in BTC to create wrapped BTC as MLS-01/02 tokens for faster transactions and lower fees \(also enabling confidential transactions\).
* Update the token policies \(such as **ACL**, [see §4.3.](4-decentralized-finance-defi.md#4-3-acl-rules-for-securities)\) to your issued MLS-01 tokens.
* Create custom smart contracts and **programmable pools** \(see [§4.5.](4-decentralized-finance-defi.md#4-5-programmable-pools-dividends-taxation)\) to manage financial operations with your tokens and create a DeFi system.
* Connect to multiple oracles to query for DEX data \(such as the DHT order book, see [§5.3.](5-decentralized-exchange-dex.md#5-3-dht-multiparty-swaps), [§5.4.](5-decentralized-exchange-dex.md#5-4-observer-of-multiparty-swaps), [§5.5.](5-decentralized-exchange-dex.md#5-5-book-aggregators-for-multiparty-swaps), [§5.8.](5-decentralized-exchange-dex.md#5-8-peer-to-peer-messaging-system)\) or identity data, also to facilitate DEX transactions or decentralized identity applications \([see §4.4.](4-decentralized-finance-defi.md#4-4-decentralized-identity-did-and-oracles)\). Standard wallet API is provided so that oracles can be programmed to help build smart contracts on Mintlayer.



## Footnotes

