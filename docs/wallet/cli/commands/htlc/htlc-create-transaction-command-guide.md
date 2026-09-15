---
title: "htlc-create-transaction"
sidebar_position: 34
---

Create a transaction with an HTLC (Hashed TimeLock Contract) output without broadcasting it.

An HTLC locks funds that can be claimed in two ways:
- **Spend path**: the recipient provides the correct secret whose hash matches `<SECRET_HASH>` before the timelock expires.
- **Refund path**: the sender reclaims the funds after the refund timelock expires, without needing the secret.

## Usage

```
htlc-create-transaction <CURRENCY> <AMOUNT> <SECRET_HASH> <SPEND_ADDRESS> <REFUND_TIMELOCK> <REFUND_ADDRESS>
```

## Arguments

- **`<CURRENCY>`**: The currency to lock. Use a token id or `coin` for ML coins. For NFTs, use the token id.

- **`<AMOUNT>`**: The amount to lock. For NFTs, use `1`.

- **`<SECRET_HASH>`**: Hex-encoded hash of the HTLC secret. Generate a secret with `htlc-generate-secret` and hash it with `htlc-calc-secret-hash`.

- **`<SPEND_ADDRESS>`**: The address that can spend the HTLC by revealing the secret.

- **`<REFUND_TIMELOCK>`**: When the sender can reclaim funds if the HTLC is not spent. One of:
  - `block_count(N)`, N blocks from now
  - `seconds(N)`, N seconds from now
  - `until_height(N)`, until block height N
  - `until_time(RFC3339)`, until a specific datetime, e.g. `until_time(2026-06-01T00:00:00Z)`

- **`<REFUND_ADDRESS>`**: The address that can reclaim the funds after the timelock expires.

## Examples

```
# Lock 10 ML coins, claimable with a secret, refundable after 720 blocks (~12 hours)
htlc-create-transaction coin 10 <secret_hash> <spend_address> block_count(720) <refund_address>

# Lock tokens, refundable after a specific date
htlc-create-transaction <token_id> 500 <secret_hash> <spend_address> until_time(2026-06-01T00:00:00Z) <refund_address>
```

## Notes

This command creates the transaction but does not broadcast it. Use `node-submit-transaction` to broadcast it after signing if needed.

Use `htlc-generate-secret` to generate a random secret and `htlc-calc-secret-hash` to compute its hash before creating the HTLC.

## Related

- [`htlc-generate-secret`](htlc-generate-secret-command-guide.md): Generate a random HTLC secret.
- [`htlc-calc-secret-hash`](htlc-calc-secret-hash-command-guide.md): Compute the hash of a secret.
- [`utxo-spend`](../transactions/utxo-spend-command-guide.md): Spend or refund an HTLC UTXO.
- [`node-submit-transaction`](../node-control/node-submit-transaction-command-guide.md): Broadcast a transaction.
