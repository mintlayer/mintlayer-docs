---
title: "Decentralized Exchange (DEX)"
description: "Mintlayer whitepaper chapter: Decentralized Exchange (DEX)."
sidebar_position: 5
---

## 5.1. Overview

Mintlayer’s decentralized exchange (DEX) is **native to the UTXO model**: there is no centralized matching engine or off-chain custody. Orders exist fully on-chain and enforce settlement atomically.
This makes the DEX censorship-resistant, transparent and secure, while still supporting a general marketplace across **any Mintlayer asset** (ML, fungible tokens under MLS01, and NFTs under MLS03).

## 5.2. Order Representation

Orders use the `CreateOrder` output type:

```rust
CreateOrder(OrderData)
```

With payload:

```rust
struct OrderData {
    conclude_key: Destination,  // who can conclude the order
    ask: OutputValue,           // what is requested
    give: OutputValue,          // what is offered
}
```

At creation:

* `give` is an amount of an asset offered by the maker.
* `ask` is an amount of another asset that the maker wants to receive in return.
* `conclude_key` defines who can conclude the order and claim the obtained amount of the asked
asset and any remaining `give` balance.

Note: though technically the conclude key can be owned by anybody, normally it will be owned by the maker.

## 5.3. Lifecycle

The lifecycle of an order consists of creation, zero or more fills, optional freeze, and conclusion.

### 5.3.1. Create

A "create" transaction has an output of the `CreateOrder` type, which specifies the order details as explained above.
It also consumes the offered amount of the `give` asset, which is used to fund the order.

When the "create" transaction is included in a block, a temporary account associated with the order is created,
which holds the order's remaining `give` and `ask` balances (initially equal to the amounts specified in `CreateOrder`).

Note: the order account is not present in the blockchain explicitly. Instead, consensus nodes keep track of each order's
lifecycle and maintain their current states locally.

### 5.3.2. Fill

To fill the order, a taker creates a transaction that:

* Contains a special pseudo-input called `FillOrder`, which specifies the order id and the amount of the `ask` asset
to fill the order with.
* Consumes the specified amount of the `ask` asset.
* Receives the proportional amount of the `give` asset into an output of their choice.

Once the "fill" transaction is included in a block, the order's remaining balances are reduced by the corresponding amounts.

This can repeat until the give balance reaches zero**\***, or the order is frozen or concluded.

Each fill is **atomic**: the taker's payment and reward are settled together in the same transaction.

**\*** Or until the remaining `ask` balance becomes so low that it's not enough to obtain even a single atom of the `give` asset.

### 5.3.3. Conclude

The holder of `conclude_key` (chosen by the maker) can at any time withdraw the accumulated amount of the `ask` asset
and the remaining amount of the `give` asset by concluding the order.

To do so, the concluder creates a transaction that:

* Contains an input of the `ConcludeOrder` type, which specifies the id of the order to conclude and is signed by `conclude_key`.
* Receives the accumulated amount of the `ask` asset**\*\*** into an output of their choice.
* Receives the remaining amount of the `give` asset into an output of their choice.

Once the "conclude" transaction is included in a block, the order is closed and its associated account is removed.

**\*\*** Which is equal to **initial ask balance** minus **remaining ask balance**.

### 5.3.4. Freeze (optional)

Freezing an order is an optional operation that may be performed **before** the conclusion. It's only useful 
when the order has to be concluded prematurely, i.e. before it was completely filled.

Same as "conclude", "freeze" can only be done by the holder of `conclude_key`. Once the order is frozen, it can
no longer be filled and the only possible operation for it is "conclude".

The reason why this may be needed is that during a premature conclusion the remaining `give` balance is non-zero, so it
has to be withdrawn as well (otherwise it will be lost). At this point if there is a malicious actor who wants to prevent
the concluder from doing the premature conclusion, they could do it by making frequent small fills for the order, thus
constantly changing its remaining `give` balance. If such a fill manages to get into a block before the "conclude"
transaction, the latter may become invalid due to the over-withdrawal of the `give` balance, in which case it will be
rejected by consensus nodes.

One way for the concluder to overcome this is to willingly reduce the withdrawn `give` amount in the "conclude"
transaction (thus losing a certain amount of the asset), so that even after the interference of malicious fills
the withdrawn amount stays at or below the remaining balance. This approach is not ideal though, as, first of all,
the concluder will lose money and, secondly, it's unreliable.

The better approach is to freeze the order first. This operation always succeeds and once the order is frozen,
it can no longer be filled. Which means that its balances are now fixed and a "conclude" transaction can be submitted reliably.

To freeze an order, the concluder creates a transaction that contains an input of the `FreezeOrder` type, which
specifies the id of the order to freeze and is signed by `conclude_key`.

## 5.4. Atomic Settlement

* Every fill either completes fully in a transaction or does not occur at all.
* There is no risk of partial execution.
* Settlement is deterministic: the price is fixed by the initial `(ask, give)` ratio, with proportional amounts computed as:

   ```
   (taker_receives) = (fill_ask) * (give_total) / (ask_total)
   ```

## 5.5. Fully On-Chain Order Book

**The order book is the blockchain itself.**

* No entity controls discovery or matching.
* Liquidity is transparent and globally accessible.

## 5.6. Asset-Agnostic

Both `ask` and `give` are `OutputValue`. This allows trading of:

* Native ML,
* MLS01 fungible tokens,
* MLS03 NFTs,
* Even cross-type barters (e.g., token for NFT).

## 5.7. Example Flow

1. **Maker:** posts order *Give 100 ML, Ask 500 USDT*.
   → Order created with balances: give=100 ML, ask=500 USDT.

2. **Taker A:** fills with 100 USDT.

   * Receives 20 ML.
   * Order balances update: give=80 ML, ask=400 USDT.

3. **Taker B:** fills with 400 USDT.

   * Receives 80 ML.
   * Order balances update: give=0, ask=0 USDT.
   * The order is now exhausted; only the maker (via `conclude_key`) can conclude and withdraw the accumulated `ask`
   amount - 500 USDT.

## 5.8. Safety & Governance

* **Maker authority:** only `conclude_key` can withdraw.
* **Freeze:** prevents fill spam from blocking conclusion.
* **Transparency:** all orders and balances are on-chain.
* **Parallelism:** multiple independent orders and multiple fills, on the same order, can be performed in parallel thanks to UTXO concurrency.
