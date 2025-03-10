# 6. MLT Token

## 6.1. MLT token

The MLT token serves a utility purpose in the ecosystem. 400,000,000 MLT tokens are pre-mined and are either distributed in the market or locked, according to the token distribution table ([§6.2](https://docs.mintlayer.org/whitepaper/6-token-and-public-sale#6-2-token-distribution)).

### 6.1.1. Staking

The main token use case is the Mintlayer [Dynamic Slot Allotment Mechanism](https://www.mintlayer.org/docs/DSA-consensus-paper-draft.pdf): the blocksigners are users who “legitimize” the blocks created by signing them. They alternate in the creation of new blocks according to a selection algorithm.

The blocksigner group is dynamic: for participating in the auction, it is necessary to stake the MLT token. Every user can apply for the blocksigner role as long as they stake enough MLT Tokens (40,000 tokens, equal to 0.01% of the initial total token supply).

There is no Proof-of-Work: users have to stake their tokens and participate in a recurring auction that determines who qualifies as blocksigners for the next round. Each round lasts about 1 week (or every 1008 Bitcoin blocks). If the demand for participants is higher than the available blocksigner slots, users with more MLT tokens have a higher probability of becoming a blocksigner.

Blocksigners collect transaction fees from the blocks they create (mining), while the network users can pay fees in any token transferred on the Mintlayer, including MLT.

### 6.1.2. Community Engagement

Mintlayer is an open-source project. To encourage community-driven protocol, MLT token allows its holders to express their opinion regarding the development of the network. Users can help prioritizing roadmap events, suggest features, and more.

### 6.1.3. Ecosystem Tools

MLT token can be used pay network fees as well as the token issuance fee that users pay when issuing a token on Mintlayer.

RBB LAB services can be bought using MLT tokens:

* Mintlayer smart contracts development
* Security audit of Mintlayer smart-contracts
* Software Engineering of decentralised application on Mintlayer

### 6.1.4. Farming

**This approach strengthens the Mintlayer community:**

*   In the first 10 years since the mainnet launch, each Mintlayer&#x20;

    block will generate a reward for the block creators until the&#x20;

    total supply reaches the 600,000,000 MLT hard cap
*   Newly generated tokens are collected by network participants&#x20;

    staking a minimum of 40,000 MLT tokens, following the&#x20;

    Mintlayer conensus rules.
* Long-term believers will benefit from the commitment to the project, because the longer they participate in staking, the more MLT tokens they receive.

## **6.2. Token distribution**

| Pool name                      | Token Amount | Pool Share | Vesting Type |
| ------------------------------ | ------------ | ---------- | ------------ |
| Pre-seed                       | 2,500,000    | 0.63%      | 4            |
| Seed                           | 54,600,000   | 13.65%     | 2            |
| Fair launch                    | 12,605,042   | 3.15%      | 2            |
| Public sale                    | 22,000,000   | 5.50%      | unlocked     |
| Marketing and Listing          | 48,000,000   | 12.00%     | 1            |
| Strategic sale - Long Vesting  | 52,000,000   | 13.00%     | 5            |
| Strategic sale - Short Vesting | 26,000,000   | 6.50%      | 2            |
| Protocol Development           | 40,000,000   | 10.00%     | 4            |
| Community Incentives           | 20,000,000   | 5.00%      | 3            |
| Company Reserve                | 72,294,958   | 18.07%     | 5            |
| Team & Advisors                | 50,000,000   | 12.50%     | 4            |

Vesting Types:

* Type 1        unlocking 12% at TGE + 8% monthly over 11 months
* Type 2        unlocking 10% at TGE + 6% monthly over 15 months
* Type 3        unlocking 10% at TGE + 5% monthly over 18 months
* Type 4        4 months locked after TGE, then unlocking 5% monthly over 20 months
* Type 5        4 months locked after TGE, then unlocking 2% monthly over 10 months, then 4% over 20 months

The initial unlocked token supply is set to 39,080,504 MLT at the Token Generation Event.

## 6.3. Roadmap

| Time    | Goal                                                                             |
| ------- | -------------------------------------------------------------------------------- |
| Q1/2021 | Mintlayer DSA and DEX prototyping                                                |
| Q2/2021 | Implementation of UTXO and BLS on Substrate                                      |
| Q3/2021 | Testnet fullnode with basic PoS consensus                                        |
| Q4/2021 | Launch of “Von Neumann” Testnet                                                  |
| Q1/2022 | New node codebase off Substrate started                                          |
| Q2/2022 | Mobile wallet beta version (Bitcoin enabled)                                     |
| Q3/2022 | Mobile wallet support for Bitcoin Lightning Network                              |
| Q4/2022 | Launch of “Lovelace” testnet Fullnode release candidate for Linux, Windows, Mac  |
|         | MLS-01 and MLS-03 standards in testnet                                           |
| Q1/2023 | Mainnet launch                                                                   |
|         | DSA Consensus System v.0                                                         |
| Q2/2023 | Mobile wallet integration of MLT and MLS tokens                                  |
|         | Free gas market for transactions                                                 |
| Q3/2023 | WebAssembly Programmable Pools                                                   |
|         | Access Control List for MLS-01                                                   |
| Q4/2023 | Basic Atomic Swap system                                                         |
| Q1/2024 | Atomic Swap DEX with Distributed Hash Table                                      |
| Q2/2024 | Lightning Network Integration                                                    |
| Q3/2024 | MLS-02 Confidential Transactions                                                 |
