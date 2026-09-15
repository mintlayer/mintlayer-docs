---
title: "ML Token"
description: "Mintlayer whitepaper chapter: ML Token."
sidebar_position: 7
---

## 7.1. ML token

The ML token serves a utility purpose in the ecosystem. 400,000,000 ML tokens are pre-mined and are either distributed in the market or locked, according to the [token distribution table](#73-token-distribution).

### 7.1.1. Staking

The primary purposes of the ML token include paying for transaction fees and covering extra costs associated with specific transactions, such as token creation. Additionally, ML tokens enable users to stake and participate in the network as block producers, thereby earning block rewards through the consensus protocol.

Mintlayer's consensus protocol relies on pools acting as block producers within the network. This approach allows users with any amount of ML to actively participate in the network and earn rewards. A pool must be established with a minimum of 40,000 ML tokens, equivalent to 0.01% of the total initial supply, as a pledge from the pool owner. However, any user can delegate their tokens to a pool to earn rewards later.

For the first 10 years of the network's operation, each block produced will include a block reward. These rewards are paid in ML, with the specifics outlined in the following table:

| **Year after launch**| **ML Per Block**|
|----|----|
| 1st | 202 ML |
| 2nd | 151 ML |
| 3rd | 113 ML |
| 4th | 85 ML |
| 5th | 64 ML |
| 6th | 48 ML |
| 7th | 36 ML |
| 8th | 27 ML |
| 9th | 20 ML |
| 10th | 15 ML |
| .. | 0 ML |

### 7.1.2. Community Engagement

Mintlayer is an open-source project. To encourage a community-driven protocol, the ML token allows its holders to express their opinion regarding the development of the network. Users can help prioritize roadmap events, suggest features, and more.

### 7.1.3. Ecosystem Tools

ML tokens can be used to pay network fees as well as the token issuance fee that users pay when issuing a token on Mintlayer.

RBB LAB services can be bought using ML tokens:

* Mintlayer smart contracts development
* Security audit of Mintlayer smart-contracts
* Software Engineering of decentralized application on Mintlayer

## 7.2. Burn Operations

Specific operations within the network will trigger the burning of ML tokens, effectively reducing the total supply. 

| Asset | Function | Fee in $ML |
|-------|----------|------------|
| Fungible | Issuance | 100 |
| Non-Fungible | Issuance | 5 |
| Fungible | Supply Change | 50 |
| Fungible | Freeze | 50 |
| Non-Fungible | Freeze | 50 |
| Fungible | Authority Change | 20 |
| Non-Fungible | Authority Change | 20 |
| Fungible | Metadata URI Change | 20 |
| Non-Fungible | Metadata URI Change | 20 |
| - | Data Deposit | 20 |


## 7.3. Token distribution  

| Pool name                      | Token Amount | Pool Share | Vesting Type |
| ------------------------------ | ------------ | ---------- | ------------ |
| Pre-seed                       | 2,500,000    | 0.62%      | 4            |
| Seed                           | 54,600,000   | 13.65%     | 2            |
| Strategic sale - Long Vesting  | 52,000,000   | 13.00%     | 5            |
| Strategic sale - Short Vesting | 26,000,000   | 6.50%      | 2            |
| Marketing and Listing          | 48,000,000   | 12.00%     | 1            |
| Protocol Development           | 40,000,000   | 10.00%     | 4            |
| Community Incentives           | 20,000,000   | 5.00%      | 3            |
| Company Reserve                | 106,900,000  | 26.73%     | 5            |
| Team & Advisors                | 50,000,000   | 12.50%     | 4            |

 ( pool share are rounded to 2 decimal places )

**Vesting Types:**


| Type | Unlock at TGE | Unlock after TGE |
|------|---------------|------------------|
| 1 | 12% | 8% monthly over 11 months |
| 2 | 10% | 6% monthly over 15 months |
| 3 | 10% | 5% monthly over 18 months |
| 4 | 0% | 4 months locked, then unlocking 5% monthly over 20 months |
| 5 | 0% | 4 months locked, then unlocking 2% monthly over 10 months, then 4% over 20 |


The initial unlocked token supply is set to **15,820,000 ML** at the Token Generation Event.

## 7.4. Technical Roadmap

View the roadmap on the [main site](https://www.mintlayer.org/en/roadmap/)


---

[Back to home](/)
