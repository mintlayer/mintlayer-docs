---
title: "Managing a Multisig Address"
sidebar_position: 4
---

A multisig (multi-signature) address requires M signatures from a set of N defined public keys before funds can be spent. This is useful for shared treasuries, escrow, team funds, or any situation where a single key should not be able to move funds unilaterally.

This guide covers setting up a multisig address and the full workflow for spending from it.

## Prerequisites

- A running, synced `node-daemon`
- `wallet-cli` connected to the node (one instance per participant, or a coordinator collecting signatures)
- The public keys of all participants

---

## Concepts

**M-of-N multisig**: A multisig address defined by N public keys where at least M of them must sign a transaction for it to be valid. For example, a 2-of-3 address requires any 2 of the 3 keyholders to sign.

**PartiallySignedTransaction (PST)**: A transaction that has been composed but not yet fully signed. It is passed between participants as a hex string so each can add their signature. Once M signatures are collected the transaction can be broadcast.

**Standalone address**: Multisig addresses are tracked as standalone addresses in the wallet, they are watched for incoming funds but not derived from the wallet's seed phrase. Each participant must add the same multisig address to their own wallet.

---

## Part 1: Setting Up the Multisig Address

### Step 1: Collect public keys from all participants

Each participant must reveal the public key for the address they will use to sign. In each participant's wallet:

```
address-reveal-public-key-as-hex <address>
```

This returns the raw hex public key for that address. Collect these from all N participants out of band (e.g. shared securely over a messaging channel).

### Step 2: Create the multisig address

In any wallet (typically the coordinator's), register the multisig address:

```
standalone-add-multisig <MIN_REQUIRED_SIGNATURES> <pubkey1> <pubkey2> ... <pubkeyN>
```

Example, a 2-of-3 multisig with an optional label:

```
standalone-add-multisig --label "Treasury" 2 <pubkey1> <pubkey2> <pubkey3>
```

The command returns the multisig address. Share this address with all participants.

### Step 3: Each participant adds the same address

Every participant who may need to sign transactions must also add the multisig address to their wallet:

```
standalone-add-multisig --no-rescan true 2 <pubkey1> <pubkey2> <pubkey3>
```

Using `--no-rescan true` skips a full blockchain rescan if the address has no existing history yet. Omit it (or use `false`) if the address may have already received funds.

### Step 4: Verify the address is tracked

```
standalone-address-show
```

To inspect the full details (participants, required signatures):

```
standalone-address-details <multisig_address>
```

---

## Part 2: Receiving Funds

Send funds to the multisig address like any other address, the sender just uses `address-send` or `token-send` with the multisig address as the destination.

To check the multisig address balance and available UTXOs:

```
standalone-multisig-utxos
```

---

## Part 3: Spending from the Multisig Address

Spending requires M participants to each sign a PartiallySignedTransaction. The typical flow is: compose → sign (round-robin) → broadcast.

### Step 1: Compose the transaction

The coordinator composes a transaction spending from the multisig UTXO:

```
transaction-compose --utxos <utxo> transfer(<destination_address>,<amount>)
```

The UTXO identifier comes from `standalone-multisig-utxos` output, in the format `tx(<txid>,<index>)` or `block(<block_id>,<index>)`.

This returns a hex-encoded PartiallySignedTransaction with no signatures yet.

### Step 2: First participant signs

Pass the hex to the first signer's wallet:

```
account-sign-raw-transaction <hex>
```

The wallet adds its signature and returns a new hex string with one signature applied. If this wallet holds enough keys to fully sign the transaction (e.g. it controls 2 of 2 keys in a 2-of-2), it is complete after this step.

### Step 3: Additional participants sign (if needed)

Pass the updated hex to the next signer:

```
account-sign-raw-transaction <hex_from_previous_signer>
```

Repeat until M signatures have been collected. Each signer outputs an updated hex, always pass the latest hex to the next participant.

### Step 4: Broadcast the fully signed transaction

Once M signatures are present, broadcast from any wallet connected to the node:

```
node-submit-transaction <fully_signed_hex>
```

---

## Worked Example: 2-of-3 Treasury

**Setup** (done once):

```
# Each participant reveals their public key
address-reveal-public-key-as-hex <my_address>
# → <pubkeyA>, <pubkeyB>, <pubkeyC> collected from each participant

# Coordinator registers the multisig
standalone-add-multisig --label "Treasury 2-of-3" 2 <pubkeyA> <pubkeyB> <pubkeyC>
# → returns: <multisig_address>

# Participants B and C also add it
standalone-add-multisig --no-rescan true 2 <pubkeyA> <pubkeyB> <pubkeyC>
```

**Spending** (each time funds need to move):

```
# Coordinator lists UTXOs and composes a transaction
standalone-multisig-utxos
transaction-compose --utxos tx(<txid>,0) transfer(<destination_address>,500)
# → <pst_hex_v0>  (0 signatures)

# Participant A signs
account-sign-raw-transaction <pst_hex_v0>
# → <pst_hex_v1>  (1 signature)

# Participant B signs
account-sign-raw-transaction <pst_hex_v1>
# → <pst_hex_v2>  (2 signatures: threshold reached)

# Coordinator broadcasts
node-submit-transaction <pst_hex_v2>
```

---

## Managing the Address

### Rename or remove the label

```
# Rename
standalone-address-label-rename --label "New Label" <multisig_address>

# Remove label
standalone-address-label-rename <multisig_address>
```

---

## Quick Reference

| Task | Command |
|---|---|
| Get your public key | `address-reveal-public-key-as-hex <address>` |
| Create multisig address | `standalone-add-multisig <M> <pubkey1> ... <pubkeyN>` |
| List standalone addresses | `standalone-address-show` |
| Inspect multisig details | `standalone-address-details <address>` |
| View multisig UTXOs | `standalone-multisig-utxos` |
| Compose spend transaction | `transaction-compose --utxos <utxo> transfer(<address>,<amount>)` |
| Sign transaction | `account-sign-raw-transaction <hex>` |
| Broadcast transaction | `node-submit-transaction <hex>` |
| Rename label | `standalone-address-label-rename --label <label> <address>` |

---

## Related Pages

- [`standalone-add-multisig`](../../wallet/cli/commands/standalone/standalone-add-multisig-command-guide.md)
- [`standalone-multisig-utxos`](../../wallet/cli/commands/standalone/standalone-multisig-utxos-command-guide.md)
- [`standalone-address-show`](../../wallet/cli/commands/standalone/standalone-address-show-command-guide.md)
- [`standalone-address-details`](../../wallet/cli/commands/standalone/standalone-address-details-command-guide.md)
- [`standalone-address-label-rename`](../../wallet/cli/commands/standalone/standalone-address-label-rename-command-guide.md)
- [`address-reveal-public-key-as-hex`](../../wallet/cli/commands/accounts-addresses/address-reveal-public-key-as-hex-command-guide.md)
- [`transaction-compose`](../../wallet/cli/commands/transactions/transaction-compose-command-guide.md)
- [`account-sign-raw-transaction`](../../wallet/cli/commands/accounts-addresses/account-sign-raw-transaction-command-guide.md)
- [`node-submit-transaction`](../../wallet/cli/commands/node-control/node-submit-transaction-command-guide.md)
