---
title: "utxo-spend"
sidebar_position: 119
---

Spend a specific UTXO, moving its funds (coins or tokens) to a given address.

## Usage

```
utxo-spend <UTXO> <ADDRESS> [HTLC_SECRET]
```

## Arguments

- **`<UTXO>`**: The UTXO to spend. Accepts transaction outputs or block reward outputs:
  - `tx(<txid>,<index>)` e.g. `tx(000000000000000000059fa50103b9683e51e5aba83b8a34c9b98ce67d66136c,1)`
  - `block(<block_id>,<index>)` e.g. `block(000000000000000000059fa50103b9683e51e5aba83b8a34c9b98ce67d66136c,2)`

- **`<ADDRESS>`**: The destination address to receive the funds.

- **`[HTLC_SECRET]`**: *(Optional, HTLC UTXOs only)* Hex-encoded HTLC secret.
  - Providing the secret **spends** the HTLC, the HTLC's spend address must be owned by the current account.
  - Omitting the secret **refunds** the HTLC, the HTLC's refund address must be owned by the current account, and the refund timelock must have expired.

## Notes

When spending coins, the fee is taken from the same UTXO, the transaction has exactly one input and one output. When spending tokens, additional coin inputs are selected to cover fees and a change output is generated automatically.

Pool decommissioning is technically a UTXO spend but cannot be done with this command. Use `staking-decommission-pool` instead.

## Related

- [`account-utxos`](../accounts-addresses/account-utxos-command-guide.md): List UTXOs owned by the account.
- [`staking-decommission-pool`](../staking/staking-decommission-pool-command-guide.md): Decommission a staking pool.
- [`htlc-create-transaction`](../htlc/htlc-create-transaction-command-guide.md): Create an HTLC output.
