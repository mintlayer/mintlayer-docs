---
title: "FAQ"
description: "Frequently asked questions about Mintlayer: testnet tokens, fees, finality, staking requirements, unstaking, explorer lookups, and where to get help."
sidebar_position: 10
---

# FAQ

## How do I obtain testnet ML (TML)?

Use the [Mintlayer faucet](https://faucet.mintlayer.org): enter your testnet address (starts with `tmt1`) and request tokens. The faucet distributes up to 200 TML per day. TML is the testnet token; mainnet coins are called ML.

Notes:

- TML tokens exist only on testnet and have no value; they exist so you can test staking, token operations, and bridges without real funds.
- If you finished testing, consider returning unused tokens to the faucet address shown on the faucet page.
- Need more than the faucet allows? Ask in the [Mintlayer Developers Telegram group](https://t.me/mintlayer_devs) and the team will send testnet coins your way.

For a local-only alternative that needs no faucet at all, run a [regtest node](build/development.md#running-a-node-for-development) and generate blocks on demand.

## How are fees calculated?

Mintlayer has no protocol-mandated fee. Senders choose the fee, and block producers decide which transactions to include, so in practice the market sets the price: transactions paying more per unit of size get picked up sooner.

- **Size-based**: fees scale with the serialized size of the transaction (roughly atoms per kilobyte).
- **Estimates**: the indexer exposes a fee-rate estimate per kilobyte, based on the highest-paying transactions currently in the mempool. See the [fee rate endpoint](api/endpoints/feerate.md).
- **Wallets compute it for you**: `wallet-cli` and the wallet RPC calculate and attach an appropriate fee automatically when creating transactions.
- **Fee token**: fees are paid to the block producer, who may accept any token transferred on Mintlayer, including ML.

For exchanges and services: query the [fee rate endpoint](api/endpoints/feerate.md) for a current estimate, or rely on the wallet's automatic fee calculation. There is no fixed minimum, but transactions paying well below the estimate may stay in the mempool longer.

## What is finality? When is a transaction final?

Mintlayer is a proof-of-stake chain (the [Pulsar consensus protocol](https://arxiv.org/abs/2411.14245)): block signers are selected per slot, and the chain-selection rule prefers the chain with the densest history. The summary below reflects the design documents; verify exact behavior against the release your node runs.

Finality is **checkpoint-based rather than purely probabilistic**: Mintlayer blocks reference Bitcoin blocks, and once enough blocks are validated on top of a checkpoint request, the checkpoint is consolidated and locally enforced by nodes. After that point the history below the checkpoint is treated as final by the node. This is an area under active development, so confirm current enforcement behavior against your node release before relying on it for high-value operations.

Practical guidance:

- A transaction that is only in the mempool can still be replaced or dropped.
- A transaction in a block is confirmed, but remains theoretically reversible by a reorganization until it is covered by consolidated checkpoints.
- Follow transaction state programmatically through the [Wallet RPC events](wallet/rpc/events.md) (`Confirmed`, `Conflicted`, `Abandoned`) or the [node's WebSocket subscriptions](build/development.md#connecting-to-the-node-rpc).

See the [whitepaper chapter on architecture](whitepaper/1-blockchain-architecture.md) and Pulsar section 5.4 ("Finality") for the protocol details.

## How much ML do I need to stake?

To participate as a block signer you must stake at least 0.01% of the total token supply, which was 40,000 ML at mainnet launch (40,000 TML on testnet). A single staker can be rewarded with more than one slot per round. See [participation in the network](whitepaper/1-blockchain-architecture.md) and the [staking pool guide](wallet/guides/managing-a-staking-pool.md).

## How do staking rounds and lock-ups work?

Rounds last about one week (1008 Bitcoin blocks). Tokens staked for a round are locked across three rounds: the auction round (when you apply), the active round (when you participate), and a lock-in round afterwards. Plan liquidity accordingly; verify round timing against the network you operate on, as parameters can change between releases. See the [whitepaper chapter 6](whitepaper/7-token-and-public-sale.md) for the full timeline.

## How long is the waiting period when I unstake?

**7200 blocks, around 10 days.**

Unstaking means withdrawing coins from a delegation (`delegation-withdraw` in `wallet-cli`, `delegation_withdraw` over the [Wallet RPC](wallet/rpc/staking.md), or `delegationWithdraw` in the SDKs). The withdrawal itself goes through immediately, but the coins arrive in a time-locked output and only become spendable after the lock period, currently set to 7200 blocks (roughly 10 days). The exact unlock condition is part of your withdrawal transaction: inspect it (`transaction-inspect` in `wallet-cli` or the [transaction endpoint](api/endpoints/transaction.md)) and look at its `LockThenTransfer` output, or check the unlock time in the explorer.

You can withdraw from a delegation directly in the [Mojito wallet](wallet/mojito-wallet.md). Dismissing (decommissioning) a pool follows the same principle and is usually done via `wallet-cli` or the node GUI.

Other timelines to keep in mind:

- **Pool operators**: decommissioning a pool returns the pledge after the same lock period; delegators must withdraw their funds separately.
- **Round-based staking**: tokens staked for a round stay locked across the auction, active, and lock-in rounds (about one week each); see [How do staking rounds and lock-ups work?](#how-do-staking-rounds-and-lock-ups-work).

As with all consensus parameters, verify against the network you run, as values can change between releases.

## Why does the explorer say "not found" when I paste my address?

Most likely nothing is wrong. Mintlayer is a UTXO system, and wallets generate a **new receiving address for every payment** to preserve privacy. A freshly generated address has never been part of any transaction, so there is no on-chain history to show: no transaction involving that address is recorded yet, and the explorer reports it as not found.

In other words, "not found" means "this address has no on-chain history", not "this address is invalid or not yours".

What to do:

- **Expect it for new addresses**: the address becomes searchable as soon as it appears in a confirmed transaction, for example after it receives coins once.
- **Check balances in the wallet**: your balance lives in the wallet, which tracks all of your addresses together; no single address page shows your total.
- **Look up what has history**: transaction IDs and addresses that have been used before resolve normally.

This is by design: reusing one address for every payment would link all of your activity together. See [address format](wallet/addresses/address-format.md) for how Mintlayer addresses work.

## How do I move tokens between Mintlayer and Ethereum?

Use the [Bridge](build/bridge.md): submit a bridge request with your deposit transaction and the receiver address; the bridge releases funds on the destination chain after confirmations.

## Where do I report issues or ask questions?

- Bug reports and contributions: the [mintlayer-core repository](https://github.com/mintlayer/mintlayer-core/issues) (node, wallet) or the repository of the specific component.
- Community: the links in the site footer (Telegram, X, LinkedIn, YouTube).
- Documentation problems: open an issue on the [mintlayer-docs repository](https://github.com/mintlayer/mintlayer-docs).
