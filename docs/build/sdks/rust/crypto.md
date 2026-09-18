---
title: "Cryptography"
description: "Cryptography reference for the Mintlayer Rust SDK: keys, addresses, inputs, outputs, signing, intents."
sidebar_position: 6
---

# Cryptography (`crypto`)

The `crypto` module provides native key management and transaction
building backed by mintlayer-core. Unlike the go-sdk there is no embedded
WASM runtime, no `InitWASM` and no `Close`: functions are called directly
and exchange typed values (`Transaction`, `TxOutput`, `PrivateKey`,
`Amount`, ...) instead of opaque byte arrays. Every type participates in
the SCALE encoding; `crypto::types::{Encode, DecodeAll}` provide
byte-level access (`value.encode() -> Vec<u8>`).

Enable the feature (it pulls in the mintlayer-core dependency graph):

```toml
[dependencies]
mintlayer-sdk = { version = "...", features = ["crypto"] }
```

**Amounts** are `crypto::Amount`, a `u128` atom count — 1 ML =
100,000,000,000 atoms. Build with `Amount::from_atoms(n)` or
`Amount::ZERO`.

**Networks**: every function that derives addresses or is fork-sensitive
takes `Network` (`Mainnet`, `Testnet`, `Regtest`, `Signet`).

**Fork sensitivity:** some functions take a `current_block_height`
parameter because their result depends on whether a hard fork has been
activated. Pass the height of the block into which the transaction is
supposed to be included — a wallet that cannot predict it should use the
current tip height plus one and refuse to operate near a fork height.

Errors are returned as `crypto::Error` with typed variants
(`InvalidMnemonic`, `AddressParse { address, message }`, `InputSigning`,
`Sighash`, `OrdersV1NotActivated`, ...).

---

## Key derivation

Paths are `44'/coin_type'/0'` for the account, then `/0/i` (receiving)
and `/1/i` (change).

| Function | Notes |
|----------|-------|
| `make_private_key() -> PrivateKey` | Random Secp256k1Schnorr key from entropy |
| `make_default_account_privkey(mnemonic: &str, network: Network, passphrase: Option<&str>) -> Result<ExtendedPrivateKey, Error>` | The optional BIP39 passphrase changes the seed entirely |
| `make_receiving_address(account_key: &ExtendedPrivateKey, key_index: u32) -> Result<PrivateKey, Error>` | `<account>/0/<key_index>` |
| `make_change_address(account_key: &ExtendedPrivateKey, key_index: u32) -> Result<PrivateKey, Error>` | `<account>/1/<key_index>` |
| `make_receiving_address_public_key(account_public_key: &ExtendedPublicKey, key_index: u32) -> Result<PublicKey, Error>` | Watch-only derivation |
| `make_change_address_public_key(account_public_key: &ExtendedPublicKey, key_index: u32) -> Result<PublicKey, Error>` | Watch-only derivation |
| `public_key_from_private_key(private_key: &PrivateKey) -> PublicKey` | |
| `extended_public_key_from_extended_private_key(account_key: &ExtendedPrivateKey) -> ExtendedPublicKey` | For watch-only wallets |

The BIP39 seed and passphrase are zeroized on drop, but the returned key
objects are plain values without zeroization (mirroring mintlayer-core).
Avoid cloning or logging keys and keep their lifetime short.

## Addresses

| Function | Notes |
|----------|-------|
| `encode_destination(address: &str, network: Network) -> Result<Destination, Error>` | Parses bech32 into a `Destination` |
| `pubkey_to_pubkeyhash_address(public_key: &PublicKey, network: Network) -> String` | Bech32 P2PKH address |
| `encode_multisig_challenge(public_keys: &[PublicKey], min_required_signatures: u8, network: Network) -> Result<ClassicMultisigChallenge, Error>` | `min_required_signatures` must be at least 1 |
| `multisig_challenge_to_address(challenge: &ClassicMultisigChallenge, network: Network) -> String` | Bech32 multisig address |

## Chain-assigned ids

Deterministic ids derived from a transaction's inputs; the same inputs
always produce the same id.

| Function | Notes |
|----------|-------|
| `get_token_id(inputs: &[TxInput], current_block_height: u64, network: Network) -> Result<String, Error>` | The id scheme depends on the upgrade active at that height |
| `get_pool_id(inputs: &[TxInput], network: Network) -> Result<String, Error>` | Required for `encode_output_create_stake_pool` |
| `get_delegation_id(inputs: &[TxInput], network: Network) -> Result<String, Error>` | |
| `get_order_id(inputs: &[TxInput], network: Network) -> Result<String, Error>` | |

## Inputs

| Function | Notes |
|----------|-------|
| `encode_input_for_utxo(outpoint_source_id: OutPointSourceId, output_index: u32) -> TxInput` | |
| `encode_input_for_withdraw_from_delegation(delegation_id: &str, amount: Amount, nonce: u64, network: Network) -> Result<TxInput, Error>` | Nonce must follow the delegation's account spendings |
| `encode_input_for_mint_tokens(token_id: &str, amount: Amount, nonce: u64, network: Network) -> Result<TxInput, Error>` | |
| `encode_input_for_unmint_tokens(token_id: &str, nonce: u64, network: Network) -> Result<TxInput, Error>` | |
| `encode_input_for_lock_token_supply(token_id: &str, nonce: u64, network: Network) -> Result<TxInput, Error>` | |
| `encode_input_for_freeze_token(token_id: &str, is_token_unfreezable: IsTokenUnfreezable, nonce: u64, network: Network) -> Result<TxInput, Error>` | |
| `encode_input_for_unfreeze_token(token_id: &str, nonce: u64, network: Network) -> Result<TxInput, Error>` | |
| `encode_input_for_change_token_authority(token_id: &str, new_authority: &str, nonce: u64, network: Network) -> Result<TxInput, Error>` | |
| `encode_input_for_change_token_metadata_uri(token_id: &str, new_metadata_uri: &str, nonce: u64, network: Network) -> Result<TxInput, Error>` | |
| `encode_input_for_fill_order(order_id: &str, fill_amount: Amount, destination: &str, nonce: u64, current_block_height: u64, network: Network) -> Result<TxInput, Error>` | Must not be signed — see below |
| `encode_input_for_freeze_order(order_id: &str, current_block_height: u64, network: Network) -> Result<TxInput, Error>` | Orders V1 only; errors before the fork |
| `encode_input_for_conclude_order(order_id: &str, nonce: u64, current_block_height: u64, network: Network) -> Result<TxInput, Error>` | Nonce ignored after the orders V1 fork |

Account-command nonces (`nonce: u64`) must be in sequence with the
authority's other account spendings; fetch the next expected value from
the indexer (`next_nonce`).

**Quirk:** fill-order inputs must not be signed — use
`encode_witness_no_signature()` for them. Before the orders V1 fork the
input's `nonce` and `destination` are significant; after the fork both are
ignored (the destination is derived from the order's outputs).

## Outputs

| Function | Notes |
|----------|-------|
| `encode_output_transfer(amount: Amount, address: &str, network: Network) -> Result<TxOutput, Error>` | Coin transfer |
| `encode_output_token_transfer(amount: Amount, address: &str, token_id: &str, network: Network) -> Result<TxOutput, Error>` | |
| `encode_output_lock_then_transfer(amount: Amount, address: &str, lock: OutputTimeLock, network: Network) -> Result<TxOutput, Error>` | |
| `encode_output_token_lock_then_transfer(amount, address, token_id, lock, network) -> Result<TxOutput, Error>` | |
| `encode_output_coin_burn(amount: Amount) -> TxOutput` | |
| `encode_output_token_burn(amount: Amount, token_id: &str, network: Network) -> Result<TxOutput, Error>` | |
| `encode_output_create_delegation(pool_id: &str, owner_address: &str, network: Network) -> Result<TxOutput, Error>` | |
| `encode_output_delegate_staking(amount: Amount, delegation_id: &str, network: Network) -> Result<TxOutput, Error>` | |
| `encode_output_create_stake_pool(pool_id: &str, pool_data: StakePoolData, network: Network) -> Result<TxOutput, Error>` | `pool_id` must come from `get_pool_id` of the first input |
| `encode_output_produce_block_from_stake(pool_id: &str, staker: &str, network: Network) -> Result<TxOutput, Error>` | |
| `encode_output_data_deposit(data: &[u8]) -> TxOutput` | |
| `encode_output_issue_fungible_token(...) -> Result<TxOutput, Error>` | See [Tokens and NFTs](tokens.md) |
| `encode_output_issue_nft(...) -> Result<TxOutput, Error>` | See [Tokens and NFTs](tokens.md) |
| `encode_output_htlc(amount, token_id: Option<&str>, secret_hash, spend_address, refund_address, refund_timelock, network) -> Result<TxOutput, Error>` | `None` token id means coins |
| `encode_create_order_output(ask_amount, ask_token_id: Option<&str>, give_amount, give_token_id: Option<&str>, conclude_address, network) -> Result<TxOutput, Error>` | See [Tokens and NFTs](tokens.md) |

## Timelocks

| Function | Returns |
|----------|---------|
| `encode_lock_for_block_count(block_count: u64) -> OutputTimeLock` | Locked for N blocks after inclusion |
| `encode_lock_for_seconds(total_seconds: u64) -> OutputTimeLock` | Locked for N seconds after inclusion |
| `encode_lock_until_time(timestamp_since_epoch_in_seconds: u64) -> OutputTimeLock` | Locked until a UNIX timestamp |
| `encode_lock_until_height(block_height: u64) -> OutputTimeLock` | Locked until a block height |

## Fees and staking helpers

Protocol fees are static or height-dependent; all return `Amount` in atoms
and must be funded by the transaction's coin inputs:

| Function | Notes |
|----------|-------|
| `fungible_token_issuance_fee(_current_block_height: u64, network: Network) -> Amount` | |
| `nft_issuance_fee(current_block_height: u64, network: Network) -> Amount` | |
| `token_supply_change_fee(current_block_height: u64, network: Network) -> Amount` | Minting and unminting |
| `token_freeze_fee(current_block_height: u64, network: Network) -> Amount` | Freezing and unfreezing |
| `token_change_authority_fee(current_block_height: u64, network: Network) -> Amount` | |
| `data_deposit_fee(current_block_height: u64, network: Network) -> Amount` | |

| Function | Notes |
|----------|-------|
| `encode_stake_pool_data(value, staker, vrf_public_key, decommission_key, margin_ratio_per_thousand: u16, cost_per_block, network) -> Result<StakePoolData, Error>` | See [Staking](staking.md) |
| `effective_pool_balance(network: Network, pledge_amount: Amount, pool_balance: Amount) -> Result<Amount, Error>` | Pledge-capped balance used by consensus |
| `staking_pool_spend_maturity_block_count(current_block_height: u64, network: Network) -> u64` | Blocks until decommissioned funds are spendable |

## Transactions

| Function | Notes |
|----------|-------|
| `encode_outpoint_source_id(id: H256, source: SourceId) -> OutPointSourceId` | `SourceId::Transaction` or `SourceId::BlockReward` |
| `encode_transaction(inputs: Vec<TxInput>, outputs: Vec<TxOutput>, flags: u64) -> Result<Transaction, Error>` | Flags are currently always zero |
| `transaction_id(transaction: &Transaction) -> String` | Lowercase hex |
| `decode_transaction(bytes: &[u8]) -> Result<Transaction, Error>` | Requires exactly one transaction |
| `decode_transaction_lenient(bytes: &[u8]) -> Result<Transaction, Error>` | Ignores trailing witness bytes |
| `encode_signed_transaction(transaction: Transaction, signatures: Vec<InputWitness>) -> Result<SignedTransaction, Error>` | |
| `encode_partially_signed_transaction(transaction, signatures: Vec<Option<InputWitness>>, input_utxos, input_destinations, htlc_secrets, additional_info, _network) -> Result<PartiallySignedTransaction, Error>` | One entry per input, `None` marks absent |
| `decode_signed_transaction_to_json(transaction: &[u8], network: Network) -> Result<serde_json::Value, Error>` | JSON with bech32 addresses |
| `decode_partially_signed_transaction_to_json(transaction: &[u8], network: Network) -> Result<serde_json::Value, Error>` | |
| `estimate_transaction_size(inputs: &[TxInput], input_destinations: &[&str], outputs: &[TxOutput], network: Network) -> Result<usize, Error>` | Script hash/multisig destinations unsupported; HTLC inputs counted as UTXO |
| `extract_htlc_secret(signed_tx: &SignedTransaction, htlc_outpoint_source_id: OutPointSourceId, htlc_output_index: u32) -> Result<HtlcSecret, Error>` | |

## Signing

| Function | Notes |
|----------|-------|
| `encode_witness(sighash_type, private_key, input_owner_destination, transaction, input_utxos: &[Option<TxOutput>], input_index: usize, additional_info: &TxAdditionalInfo, current_block_height, network) -> Result<InputWitness, Error>` | Signs one input; see [Building transactions](transactions.md) |
| `encode_witness_no_signature() -> InputWitness` | For fill-order inputs |
| `encode_witness_htlc_spend(..., secret: HtlcSecret, ...) -> Result<InputWitness, Error>` | Spends an HTLC, revealing the secret |
| `encode_witness_htlc_refund_single_sig(...) -> Result<InputWitness, Error>` | HTLC refund to a single-sig address |
| `encode_witness_htlc_refund_multisig(sighash_type, private_key, key_index: u8, input_witness: Option<&InputWitness>, challenge, transaction, input_utxos, input_index, additional_info, current_block_height, network) -> Result<InputWitness, Error>` | Cumulative; `None` for the first signer |
| `sign_message_for_spending(private_key: &PrivateKey, message: &[u8]) -> Result<Signature, Error>` | |
| `verify_signature_for_spending(public_key: &PublicKey, signature: &Signature, message: &[u8]) -> bool` | |
| `sign_challenge(private_key: &PrivateKey, message: &[u8]) -> Result<Vec<u8>, Error>` | Arbitrary-message signature for a pubkeyhash address |
| `verify_challenge(address: &str, network: Network, signed_challenge: &[u8], message: &[u8]) -> Result<bool, Error>` | |

`input_utxos` in every witness function must hold one entry per
transaction input: `None` for non-UTXO inputs, `Some(output)` otherwise.
`additional_info` must cover every `ProduceBlockFromStake`, `FillOrder`
and `ConcludeOrder` input of the transaction, not just the one signed.

## Transaction intents

| Function | Notes |
|----------|-------|
| `make_transaction_intent_message_to_sign(intent: &str, transaction_id_hex: &str) -> Result<String, Error>` | Every input destination signs this with `sign_challenge` |
| `encode_signed_transaction_intent(signed_message: &str, signatures: Vec<Vec<u8>>) -> Result<SignedTransactionIntent, Error>` | One signature per input, in input order |
| `verify_transaction_intent(expected_signed_message: &str, encoded_signed_intent: &[u8], input_destinations: &[&str], network: Network) -> Result<(), Error>` | Pubkey and pubkeyhash addresses are interchangeable |

## Re-exported types

`crypto::types` re-exports mintlayer-core primitives so consumers do not
need a direct dependency: `Transaction`, `SignedTransaction`, `TxInput`,
`TxOutput`, `Destination`, `OutputValue`, `OutPointSourceId`,
`InputWitness`, `StakePoolData`, `OutputTimeLock`, `HtlcSecret`,
`ClassicMultisigChallenge`, `H256`, `PrivateKey`, `PublicKey`,
`Signature`, `ExtendedPrivateKey`, `ExtendedPublicKey`, and the SCALE
`Encode`/`DecodeAll` traits. Also at the module root: `SigHashType`,
`TokenTotalSupply` (`Fixed(Amount)`, `Lockable`, `Unlimited`),
`IsTokenFreezable`/`IsTokenUnfreezable` (`Yes`/`No`), `Amount`,
`TxAdditionalInfo`, and `SourceId`.
