---
title: "Blockchain architecture"
description: "Mintlayer whitepaper chapter: Blockchain architecture."
sidebar_position: 1
---

## 1.1 Introduction

Mintlayer is a Proof of Stake blockchain designed to act as a sidechain to the Bitcoin network. In Mintlayer terms, a sidechain is a chain that is directly interoperable with another blockchain; there is no master/slave relationship as some others define it. Mintlayer represents the simplest way to do DeFi-related activities in an interoperable way with Bitcoin. There is no need to use a wrapped version of Bitcoin or use Solidity or any other smart contract language to create a token. 

As a UTXO-based blockchain, just like Bitcoin, a token on Mintlayer is simply extra data embedded into a UTXO. This means creating a token is as simple as creating a transaction with some additional information. The simplicity of the tokenization model, the direct access to Bitcoin, and the liquidity of the Bitcoin network will pave the way for the future of DeFi. One clear example of where all of these things come together is the idea of tokenization of real-world assets. 

## 1.2 Participation

Mintlayer is a Proof of Stake blockchain, meaning that to participate in the system's consensus, one must lock tokens. To increase network participation, Mintlayer uses a Proof of Stake protocol based on pools, allowing those without the 40,000 ML required to run a pool to delegate to an existing pool to help secure the network and earn rewards for doing so. 

## 1.3 Blocks

A Mintlayer block is produced every 120s on average and is limited to 1MB, although it can be smaller. Each block has a version, the only implemented version at this stage is V1:

```rust

pub struct BlockV1 \{
    pub(super) header: SignedBlockHeader,
    pub(super) body: BlockBody,
\}
```


where `SignedBlockHeader` looks like :

```rust


pub struct SignedBlockHeader \{
    block_header: BlockHeader,
    signature_data: BlockHeaderSignature,
\}
pub struct BlockHeader \{
    pub(super) version: VersionTag<1>,
    pub(super) prev_block_id: Id<GenBlock>,
    pub(super) tx_merkle_root: H256,
    pub(super) witness_merkle_root: H256,
    pub(super) timestamp: BlockTimestamp,
    pub(super) consensus_data: ConsensusData,
\}
```

And `BlockBody` looks like this:
```rust

pub struct BlockBody \{
    pub(super) reward: BlockReward,
    pub(super) transactions: Vec<SignedTransaction>,
\}
```

`BlockReward` is the reward for the staking pool to participate in the consensus. The rest of the block is filled with transactions. 

## 1.4 Transactions

A transaction on Mintlayer is a defined like this:

```rust

pub struct TransactionV1 \{
    version: VersionTag<1>,
    flags: u128,
    inputs: Vec<TxInput>,
    outputs: Vec<TxOutput>,
\}
```


The essence of that are the vectors of `TxInput` and `TxOutput`. An Input is a reference to a previous unspent output (UTXO) or an account:
```rust

pub enum TxInput \{
    Utxo(UtxoOutPoint),
    AccountCommand(AccountNonce, AccountCommand),
\}
```

In Mintlayer, accounts are utilized to distribute rewards from staking pools. The rationale behind using accounts in this specific context is to avoid the creation of an excessive number of outputs in the system. Excessive outputs could lead to increased memory usage for the nodes and result in significantly large transactions. This is because the vector of inputs could become very large when spending rewards from the pools.


## 1.5 Signatures

Mintlayer employs the elliptic curve `secp256k1` for digital signatures, following a precedent set by Bitcoin. This choice provides a robust foundation for security and compatibility. In addition, Mintlayer integrates Schnorr signatures, leveraging their linearity and other beneficial properties that enhance privacy and efficiency.

The implementation of Schnorr signatures in Mintlayer is sourced from the highly-regarded Rust library also named `secp256k1` (documented [here](https://docs.rs/secp256k1/latest/secp256k1/)). 

For digest creation, Mintlayer uses the `Blake2b` cryptographic hash function.

In the process, a 512-bit hash is computed using `Blake2b`. To fit within the constraints of our signature scheme and to maintain optimal security, we extract the first half of this hash for use in signature generation. This approach ensures both efficiency and security in our digital signature process.

### Segregated Witness 

Mintlayer adopts a concept similar to "segregated witness" for managing signatures within transactions. 

In this system, signatures are not embedded directly within the transaction data. Instead, they are stored separately in a vector following the transaction. 


## 1.6 Consensus

Mintlayer has a novel Proof of Stake consensus protocol intended to improve upon other existing protocols when viewed as a Bitcoin sidechain. As we've already said, Mintlayer aims to produce a block every 120s, and we use verifiable random functions ( *Micali, S., Rabin, M., and Vadhan, S. (1999). Verifiable random functions. 40th Annual Symposium on Foundations of Computer Science. pp. 120-130, doi: 10.1109/SFFCS.1999.814584* ) to do so. A pool is eligible to produce a block when the random number it produces via the VRF is below a threshold, made up of a network threshold updated to keep the block production rate as close to every 120s as possible and the stake of the pool, which ensures the block production rate is proportional to the size of the pool.

Mintlayer uses a unique chain selection rule to pick the canonical chain. Rather than looking at the length of a chain or the amount of work or stake required to build a given chain, Mintlayer uses the idea of chain density. That is to say that the chain with the densest set of filled slots is the chain that will be selected. 

### Nash Equilibrium and Staking Pools

There are security arguments using Nash Equilibrium on why we want to use the final supply as the total, and not the total stake in all pools. This is because the total stake changes over time, and the Nash Equilibrium is a dynamic equilibrium, not a static one. The final supply is the total amount of coins that will ever exist, and hence is a static value. This way, stakers can make decisions based on the final supply, and not have to worry about the total stake changing over time. Hence, the incentive structure is more stable.

$$\frac{\sigma + s \cdot a \cdot \left( \frac{\sigma - s \cdot \left( \frac{z - \sigma}{z} \right)}{z} \right)}{a + 1} \Rightarrow \sigma - \frac{a}{a + 1} \cdot \left( \frac{\sigma z^2 - s (z \sigma - s (z - \sigma))}{z^2} \right)$$


### Key Parameters

- $$z = \frac{1}{k}$$: The size of the saturated pool
- **Saturated pool**: A pool is saturated if its stake $$pledge + delegated$$ is equal to the size given by $$z = \frac{1}{k}$$. A pool that has reached saturation will not have additional rewards if the total stake is increased. This is to prevent pools from growing too large.
- $$a$$: The pledge influence parameter. When $$a=0$$, the pledge has no additional effect other than proportional to the stake. While $$a$$ increases, the pledge has more effect on the effective pool balance, and hence increases the reward more compared to delegation. The parameter $$a$$ can be controlled to incentivize pools to pledge more.
- $$s$$: The pool's pledge amount
- $$\sigma$$: The pool's stake pledge + delegated

### Formula Explanation

The formula is rewritten as $$\sigma - \text{something}$$ to represent the result as $$\sigma$$ minus some adjustment. Also, it makes it more suitable for integer arithmetic because there is a single division at the end.

Note: The second term is always positive, so the result is always $$\sigma$$ minus some adjustment.

### Considerations for Maximizing Gains

As a function of the total stake $$\sigma = \text{pledge} + \text{delegations}$$, the pool's effective balance is a concave down parabola. The maximum point is very close to $$\sigma = \frac{s}{2}$$ if $$\sigma \ll z$$. Meaning: pledge = delegations maximizes the effective balance. The true peak can be calculated by calculating the derivative of the function and equating it to zero. The result there is $$s_{\text{max}} = \frac{z \cdot \sigma}{2 \cdot (z-\sigma)}$$, where $$s_{\text{max}}$$ is the pledge that maximizes the effective balance. In that equation, we can see if $$\sigma \ll z$$, then it simplifies to $$s_{\text{max}} = \frac{\sigma}{2}$$.

## 1.7 Checkpointing and finality

Alongside the chain selection rule Mintlayer, there are two other features that ensure the security of the chain. These are checkpoints and finality. Checkpoints are hardcoded into the protocol to ensure that long-range attacks are infeasible and to simplify the process of syncing from the genesis block. In Mintlayer, a block is finalized after 1000 blocks, this is a tradeoff to ensure the security of the network and the practicality of being a Bitcoin sidechain, given Bitcoin can reorganize to an arbitrary depth.

## 1.7 Token usage

In the cryptocurrency ecosystem, the blockchains supporting multiple tokens \(such as Ethereum\) force users to pay transaction fees in the native blockchain currency \(e.g., ETH\). The impossibility of transferring a token without having a "gas" bank in the native cryptocurrency creates entry barriers and introduces friction in user experience, preventing a broader network effect.

Mintlayer does not force the use of ML for paying transaction fees. Instead, users can pay in ML or any MLS-01 token they choose if the network participants are willing to accept it. Every block proposer can signal the list of tokens accepted in a block - the free market dictates its rules.

> NOTE: This feature is currently under development and will be part of a future upgrade. Please note that technical details are subject to change
> \{.is-danger\}


## 1.9 Bitcoin links

The primary link between Mintlayer and Bitcoin is through the atomic swap[^3] system, which allows assets on both chains to be swapped directly without the need for an intermediary of any sort. Mintlayer intends to incorporate Bitcoin into its consensus system in the future, but this is an active area of research right now, so the exact form this will take is to be decided. 

> NOTE: This feature is currently under development and will be part of a future upgrade. Please note that technical details are subject to change
> \{.is-danger\}


---

*[Next: Mintlayer Wallet](2-mintlayer-wallet.md)*

The consensus protocol, its slot-based block production, and its checkpoint mechanics are formally described in the [Pulsar consensus paper](https://arxiv.org/abs/2411.14245) (Afach, Marsh and Rubboli).
