# 1. Blockchain architecture

## 1.1. Consensus on top of Bitcoin



![](https://lh6.googleusercontent.com/1ffvgXb4ZPWGcSUEo42tzpzMXBcIV9rIGdx-79hxy8zo6dSPNTXiRwytCuirPvycqDfH8FseFclEGE7h_wijUxgbO1y6cK6wuhtxmA1sYSJ-l6I6LzAGnAfMgZFc7tb-OQVU4Vxt)

Mintlayer blockchain is anchored to Bitcoin: every Mintlayer block has a reference to a Bitcoin block. In each Mintlayer round, lasting 1008 Bitcoin blocks, the participants are selected among the stakers to collaborate on creating the chain’s blocks.

A user who decides to actively participate in the network consensus needs to run a node and stake enough MLT tokens to pass a minimum threshold. Each round, an election is automatically enforced by the algorithm, where the user may be chosen as a “participant”. The higher the token stake, the higher the chances are to be selected.

The selection mechanism uses hashes of the Bitcoin blocks as a randomization source to ensure an unbiased selection of the participants and randomly establish the order they will follow in the creation and validation of blocks.

At a specific time in each round, every participant is requested to build and propagate a block for which all the transaction fees will be collected.

The long-term security of the Mintlayer chain is guaranteed by a checkpoint system on the Bitcoin blockchain.



## 1.2. Participation in the network

In order to become a “participant” for the round, it is necessary to stake MLT tokens \([see §6](6-token-and-public-sale.md#6-1-1-staking)\). Anyone staking at least 0,01% of the total token supply has a chance to be selected by the algorithm. The 0,01% accounts for 40,000 MLT tokens upon the mainnet launch.

There are 1008 member slots available, but a single user can be rewarded with more than one slot \([see the DSA Consensus Paper §4-5](https://www.mintlayer.org/docs/consensus-paper.pdf)\).

MLT tokens must be staked two rounds before the desired participation round \(active round\). Tokens will be locked for the entire duration of 3 rounds \(auction round, active round, and lock-in round\).

* _Setup round_ \(round x-2\): the user who wants to apply as a participant in round x must stake MLT tokens in one block of the round x-2. Tokens are not locked during this round.
* _Auction round_ \(round x-1\): the hash of the first Bitcoin block of the round x-1 is used as a source of entropy to determine the participants for the active round x. The participants are only selected from those who \(a\) have staked tokens in one block of the round x-2 and \(b\) did not move those coins at stake up until the beginning of the round x-1. Since the first block of the auction round, the funds staked by the selected users as participants are locked-in.
* _Active round_ \(round x\): the participants selected in the auction round x-1 generate and countersign blocks.
* _Lock-in round_ \(round x+1\): the participants of round x cannot move the locked-in tokens during the auction round.


The extended timeframe during which the coins of the participants are locked in \(about 3 weeks\) discourages users that obtained a significant number of slots from any malicious behavior or any attack attempts, considering that they will be committed with a high stake in the chain and will not be able to move the MLT tokens for a long period.

If a participant decides to renew his lock-in, the same stake used to participate in the previous auction round is also used to participate in the next round, thus effectively eliminating the need to wait for several rounds to pass to participate again. This implies that the validator holding a fixed share of the network stake can maintain approximately the same amount of slots for each round.

Once a round is determined, each participant knows the number of blocks they will be able to create and at what block height they will be issued. Thus, users conducting a large number of transactions in the network would benefit from being in the participant’s position as it grants them the possibility to include their own transactions in the blocks that they create while paying zero-fees for it. Therefore, those users would be economically incentivized to become MLT token holders and participants of the network.



## 1.3. Block frequency and size limit

**Block generation frequency on Mintlayer is dynamic:** each block proposer is given a timeframe during which there is a high probability of getting the block countersigned by other participants. That time frame spans between 1 and 2 minutes.

In case the Mintlayer mempool is empty of transactions, the block proposers have incentives to wait up to 2 minutes before creating and broadcasting the block in hopes to collect more fees from incoming transactions. If the blockchain is congested, the block proposers might be willing to create blocks faster, depending on their considerations on how the fee market will react and whether the network will benefit from a higher block issuing frequency.

Hypothetically, if there are no transactions to be validated, the participant who is expected to create the block in that timeframe has no incentives for doing so, and neither do other participants in that round have any reason to replace him in the block generation. Such a system discourages network pollution with empty blocks, especially when the blockchain has just been launched.

With the purpose of long-term sustainability, the block size limit is set to 1 MB so that, in theory, the blockchain size could not get larger than 525 GB per year even when fully saturated and with its block frequency at the peak. Furthermore, the pruning system, which is based on checkpoints, and the utreexo technology, which is used to reduce the size of the UTXO, dramatically reduce hardware storage requirements. Thanks to these optimizations, it will always be possible to run a full node on an average personal computer, fostering a more decentralized network.



## 1.4. Checkpoint system

**The checkpoint system serves three purposes:**

1. To increase the security of the network, preventing long-range attacks.
2. To decrease the initial blockchain download time \(IBD\) for users willing to run a node with a fast-sync mode.
3. To discard \(prune\) the blockchain before a certain block height so that the space required on disk remains minimal.

Anyone can create a “marker” on the Bitcoin blockchain in a Bitcoin transaction by using a specific OP\_RETURN. The participant of the Mintlayer network can include that marker in a Mintlayer block, creating a checkpoint request. The checkpoint is consolidated and locally enforced by the nodes once the participants have validated enough Mintlayer blocks on top of that checkpoint request \([see the Consensus paper §11-12](https://www.mintlayer.org/docs/consensus-paper.pdf)\).

Creating a checkpoint on the Bitcoin blockchain means to notarize or “snapshot” the status of Mintlayer so that the Bitcoin proof-of-work secures it. Anyone running a node with a fast-sync mode can download the blockchain starting from the latest checkpoint instead of downloading the whole blockchain. In the case of full-synch from the genesis block, it is always possible to prune the entire blockchain up to the checkpoint, saving most of the space otherwise required.

While checkpoints allow for shrinking the blockchain’s, the utreexo technology shrinks the size of the UTXO set, which is merkelized and reduced down to about 1 KB instead of several Gigabytes.



## 1.5. Token inclusivity

In the cryptocurrency ecosystem, the blockchains supporting multiple tokens \(such as Ethereum\) force users to pay transaction fees in the native blockchain currency \(e.g., ETH\). The impossibility of transferring a token without having a “gas” bank in the native cryptocurrency creates entry barriers and introduces friction in user experience, preventing a broader network effect.

Mintlayer has no base currency to pay transaction fees. Instead, users can pay in any MLS-01 or MLS-02 \([see §3.2.5](3-tokenization-standard.md#3-2-5-gas-free-economy).\) cryptocurrency they choose as long as the network participants are willing to accept it. Every block proposer can signal the list of tokens accepted in the block - the free market dictates its rules.

Because transactions do not necessarily pay fees in a determined gas token, it is possible to make transfers without owning more cryptocurrencies, or without storing and spending a gas bank in a token which is different from the ones transferred, which implies higher transaction costs and pollution for the network \(UTXO dust\).




