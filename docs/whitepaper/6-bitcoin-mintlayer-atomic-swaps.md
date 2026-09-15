---
title: "Mintlayer ↔ Bitcoin Atomic Swaps"
description: "Mintlayer whitepaper chapter: Mintlayer ↔ Bitcoin Atomic Swaps."
sidebar_position: 6
---

This page defines recommended **default parameters** for Hashed Timelock Contract (HTLC) atomic swaps between Mintlayer and Bitcoin. These parameters provide safe interoperability while balancing liveness, fee markets, and security assumptions.

## 6.1. Hash Function

* **HASH160** (`RIPEMD160(SHA-256(x))`) is the canonical choice for cross‑chain compatibility with Mintlayer’s HTLC implementation.
* Mintlayer derives `secret_hash = RIPEMD160(SHA-256(secret))` from a **32‑byte secret**.
* Use the **same hash function on Bitcoin** (OP_HASH160) to ensure the revealed preimage unlocks both chains.

## 6.2. Bitcoin Script Style

* **P2WSH (SegWit v0):** widely supported. Use **OP_HASH160** for the hash path to match Mintlayer’s HASH160.
* **Taproot (P2TR):** preferred long‑term option; encode HASH160 in a script path. If counterparties only support SHA‑256 templates, do **not** mix with Mintlayer HASH160-both sides must match.

**Recommendation:** Prefer Taproot where supported; otherwise P2WSH. Ensure **HASH160** is used consistently on both chains.

## 6.3. Timelock Defaults

Atomicity in HTLCs requires **asymmetric timelocks**: the HTLC of the initiator (the party who creates the secret and locks first) should always have a **significantly longer refund timelock** compared to that of the responder, to avoid race conditions.

In other words, the initiator’s HTLC must expire much later, giving the responder enough time to learn the secret and claim funds before the initiator’s refund path becomes available.

The difference (`T_initiator − T_responder`) provides a safety margin covering reorg depth, network propagation, and confirmation lag.

The recommended timelock for the initiator is 48h (or 288 Bitcoin blocks, or 1440 Mintlayer blocks).
The recommended timelock for the responder is 24h (or 144 Bitcoin blocks, or 720 Mintlayer blocks).

## 6.4. Confirmations

* **Mintlayer:** 1–3 blocks recommended before considering the HTLC lock confirmed.
* **Bitcoin:** 1–3 blocks recommended, depending on value and risk tolerance.

Wallets should wait for these confirmations before moving to the next protocol step.

## 6.5. Fee Policy

* Each chain pays fees in its **native asset** (ML on Mintlayer, BTC on Bitcoin).
* On Bitcoin, fee bumping (RBF, CPFP) should be supported for time‑critical claim transactions.
* On Mintlayer, indexers/wallets should estimate fees based on mempool congestion and block target times.

## 6.6. Example Parameter Set

Assuming that the initiator is on Bitcoin and the responder is on Mintlayer.

* **Hash:** HASH160 (RIPEMD160(SHA‑256))
* **Bitcoin Script:** Taproot (fallback to P2WSH)
* **T_ml:** 720 ML blocks (~24h)
* **T_btc:** 288 BTC blocks (~48h)
* **Confirmations:** ML: 2, BTC: 2

This ensures that if the initiator reveals the preimage on Bitcoin, the responder has at least 24 hours to claim on Mintlayer before initiator's refund path becomes valid.

## 6.7. Bitcoin HTLC Script Example (Single‑Signature, P2WSH)

Below is the **actual script** used for Mintlayer ↔ Bitcoin swaps. It employs **OP_HASH160** for the hash path and **OP_CHECKSEQUENCEVERIFY (CSV)** for the refund path. This ensures compatibility with Mintlayer’s `HtlcSecretHash` (RIPEMD160(SHA‑256(secret))).

```text

OP_IF
  OP_HASH160
  <secretHash>
  OP_EQUALVERIFY
  <receiverPubKey>
OP_ELSE
  <lockBlockCount>
  OP_CHECKSEQUENCEVERIFY
  OP_DROP
  <senderPubKey>
OP_ENDIF
OP_CHECKSIG
```


### 6.7.1. Semantics

* **Hash path (OP_IF):**

  * Redeemer must provide a preimage `x` such that `HASH160(x) = secretHash`.
  * Must also provide a valid signature with `<receiverPubKey>`.
* **Refund path (OP_ELSE):**

  * After `<lockBlockCount>` blocks have passed (relative to confirmation), `<senderPubKey>` can sign and refund.
* **Final OP_CHECKSIG:** Enforces that either branch requires a valid ECDSA/Schnorr signature.

### 6.7.2. Witness Examples

*Hash‑path spend (receiver claims before timelock):*

```text

<sig_by_receiver> <preimage_x> 1 <redeem_script>
```


*Refund path (sender after timelock):*

```text

<sig_by_sender> 0 <redeem_script>
```


### 6.7.3. Notes

* Refund uses **CSV**: relative timelock from confirmation, not absolute CLTV.
* Both branches enforce signatures, avoiding anyone spending with only the preimage.
* Must set `nSequence` fields correctly when broadcasting refund transactions.

**Taproot variant (optional):** The same logic can be encoded as a Taproot script path using HASH160 and CSV; this reduces fingerprinting and improves efficiency.
