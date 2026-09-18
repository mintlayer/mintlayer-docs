---
title: "Wallet client"
description: "Wallet client reference for the Mintlayer Rust SDK: lifecycle, accounts, balances, transactions, staking, tokens, orders."
sidebar_position: 5
---

# Wallet client

The `wallet` module is a JSON-RPC 2.0 client for the Mintlayer wallet
daemon (`wallet-rpc-daemon`). The daemon manages key storage, address
derivation, signing and broadcasting.

```rust
use mintlayer_sdk::wallet;

let c = wallet::Client::new("http://127.0.0.1:3034");

// Or with options:
let c = wallet::Client::builder("http://127.0.0.1:3034")
    .basic_auth("user", "pass")                  // optional
    .timeout(std::time::Duration::from_secs(30)) // optional, default 30s
    .build()?;
```

**Default ports:** 3034 (mainnet), 13034 (testnet).

Errors are returned as `wallet::Error` —
`Error::Rpc { code, message }` for daemon errors, plus `Http`, `Json`,
`IdMismatch` and `ResponseTooLarge` transport variants. Basic-auth
credentials are redacted from `Debug` output; response bodies are capped
at 64 MiB.

---


> **Transport security:** loopback `http://` is fine. For remote daemons use
> an `https://` URL or an authenticated tunnel — basic-auth credentials and
> daemon-generated mnemonics otherwise transit in cleartext.

## Wallet lifecycle

| Method | RPC method | Notes |
|--------|-----------|-------|
| `create_wallet(params: CreateWalletParams) -> Result<CreateWalletResult, Error>` | `wallet_create` | Returns the mnemonic when the daemon generated one |
| `recover_wallet(params: RecoverWalletParams) -> Result<(), Error>` | `wallet_recover` | Rescans to recover balances |
| `open_wallet(path: &str, password: Option<&str>) -> Result<(), Error>` | `wallet_open` | `None` password for unencrypted wallets |
| `close_wallet() -> Result<(), Error>` | `wallet_close` | |
| `wallet_info() -> Result<WalletInfo, Error>` | `wallet_info` | Id, account names, wallet kind |
| `sync_wallet() -> Result<(), Error>` | `wallet_sync` | Sync to the tip |
| `rescan_wallet() -> Result<(), Error>` | `wallet_rescan` | Full rescan from genesis |
| `best_block() -> Result<BestBlock, Error>` | `wallet_best_block` | |
| `encrypt_private_keys(password: &str) -> Result<(), Error>` | `wallet_encrypt_private_keys` | |
| `unlock_private_keys(password: &str) -> Result<(), Error>` | `wallet_unlock_private_keys` | |
| `lock_private_keys() -> Result<(), Error>` | `wallet_lock_private_keys` | |

`CreateWalletParams { path, store_seed_phrase, mnemonic, passphrase,
hardware_wallet }` — set `mnemonic: None` to let the daemon generate a
phrase. Mnemonic and passphrase fields are redacted from `Debug` output.

## Accounts, addresses, balances

| Method | RPC method | Notes |
|--------|-----------|-------|
| `create_account(name: &str) -> Result<AccountInfo, Error>` | `account_create` | |
| `rename_account(account: u32, name: Option<&str>) -> Result<(), Error>` | `account_rename` | `None` clears the name |
| `balance(account: u32) -> Result<Balance, Error>` | `account_balance` | Confirmed UTXOs only |
| `new_address(account: u32) -> Result<String, Error>` | `address_new` | Fresh receive address |
| `show_receive_addresses(account: u32) -> Result<Vec<AddressWithUsage>, Error>` | `address_show` | Usage and balance per address |
| `reveal_public_key(account: u32, address: &str) -> Result<RevealPublicKey, Error>` | `address_reveal_public_key` | |

`Amount` in requests typically sets only `atoms`
(`Amount::from_atoms(n)`); daemon responses carry `atoms` and `decimal`.

## Transactions

| Method | RPC method | Notes |
|--------|-----------|-------|
| `send(params: SendParams) -> Result<SendResult, Error>` | `address_send` | Wallet selects UTXOs, computes fees |
| `send_token(params: TokenSendParams) -> Result<SendResult, Error>` | `token_send` | |
| `sweep_spendable(params: SweepParams) -> Result<SendResult, Error>` | `address_sweep_spendable` | `all: true` or explicit `from_addresses` |
| `spend_utxo(params: UtxoSpendParams) -> Result<SendResult, Error>` | `utxo_spend` | Optional `htlc_secret` |
| `deposit_data(account: u32, data_hex: &str) -> Result<SendResult, Error>` | `address_deposit_data` | `DataDeposit` output |
| `compose_transaction(params: ComposeParams) -> Result<ComposedTx, Error>` | `transaction_compose` | Unsigned hex plus estimated fees |
| `sign_raw_transaction(account: u32, raw_tx: &str) -> Result<SignedTx, Error>` | `account_sign_raw_transaction` | Cold-wallet flow |
| `inspect_transaction(tx_hex: &str) -> Result<TxInspection, Error>` | `transaction_inspect` | Signature stats and fees |
| `submit_transaction(tx_hex: &str, do_not_store: bool) -> Result<SubmitResult, Error>` | `node_submit_transaction` | See the policy quirk below |
| `list_transactions_by_address(account, address: Option<&str>, limit: u32) -> Result<Vec<WalletTx>, Error>` | `transaction_list_by_address` | Newest first |
| `list_pending_transactions(account: u32) -> Result<Vec<String>, Error>` | `transaction_list_pending` | |
| `transaction(account: u32, tx_id: &str) -> Result<serde_json::Value, Error>` | `transaction_get` | Raw JSON |
| `abandon_transaction(account: u32, tx_id: &str) -> Result<(), Error>` | `transaction_abandon` | Unconfirmed only |

**Quirk:** [`submit_transaction`](#) always sends the hard-coded
`Trusted` trust policy to the node, so the transaction must be fully valid
against the current chainstate. There is no `Untrusted` variant; broadcast
externally sourced transactions through the node client instead
(`node::Client::broadcast_transaction`).

Most send methods take `TxOptions { in_top_x_mb, broadcast_to_mempool }`:
`in_top_x_mb` targets the top X MB of the mempool for fee estimation;
`broadcast_to_mempool: Some(false)` builds and signs without broadcasting
while still returning the transaction hex.

## Staking

See [Staking](staking.md) for the full guide.

| Method | RPC method | Notes |
|--------|-----------|-------|
| `create_stake_pool(params: CreatePoolParams) -> Result<SendResult, Error>` | `staking_create_pool` | |
| `decommission_stake_pool(params: DecommissionParams) -> Result<SendResult, Error>` | `staking_decommission_pool` | |
| `list_owned_pools(account: u32) -> Result<Vec<OwnedPool>, Error>` | `staking_list_pools` | |
| `pool_balance(pool_id: &str) -> Result<Option<Amount>, Error>` | `staking_pool_balance` | |
| `start_staking(account: u32) -> Result<(), Error>` | `staking_start` | |
| `stop_staking(account: u32) -> Result<(), Error>` | `staking_stop` | |
| `staking_status(account: u32) -> Result<StakingStatus, Error>` | `staking_status` | `Staking` or `NotStaking` |
| `create_delegation(params: CreateDelegationParams) -> Result<CreateDelegationResult, Error>` | `delegation_create` | |
| `delegate_staking(params: DelegateParams) -> Result<SendResult, Error>` | `delegation_stake` | |
| `withdraw_from_delegation(params: WithdrawParams) -> Result<SendResult, Error>` | `delegation_withdraw` | |
| `list_delegations(account: u32) -> Result<Vec<DelegationInfo>, Error>` | `delegation_list_ids` | |

## Tokens and NFTs

See [Tokens and NFTs](tokens.md) for the full guide.

| Method | RPC method | Notes |
|--------|-----------|-------|
| `issue_token(params: IssueTokenParams) -> Result<IssueTokenResult, Error>` | `token_issue_new` | |
| `issue_nft(params: IssueNftParams) -> Result<IssueTokenResult, Error>` | `token_nft_issue_new` | |
| `mint_tokens(params: MintParams) -> Result<SendResult, Error>` | `token_mint` | |
| `unmint_tokens(params: UnmintParams) -> Result<SendResult, Error>` | `token_unmint` | |
| `lock_token_supply(params: LockSupplyParams) -> Result<SendResult, Error>` | `token_lock_supply` | Irreversible; note the field name below |
| `freeze_token(params: FreezeParams) -> Result<SendResult, Error>` | `token_freeze` | |
| `unfreeze_token(params: UnfreezeParams) -> Result<SendResult, Error>` | `token_unfreeze` | |
| `change_token_authority(params: ChangeAuthorityParams) -> Result<SendResult, Error>` | `token_change_authority` | |

**Quirk:** `LockSupplyParams` names its account field `account_index`,
not `account` — every other wallet params struct uses `account`.

## Orders

See [Tokens and NFTs](tokens.md) for order creation outputs via `crypto`.

| Method | RPC method | Notes |
|--------|-----------|-------|
| `create_order(params: CreateOrderParams) -> Result<OrderCreated, Error>` | `order_create` | |
| `conclude_order(params: ConcludeOrderParams) -> Result<SendResult, Error>` | `order_conclude` | |
| `fill_order(params: FillOrderParams) -> Result<SendResult, Error>` | `order_fill` | Amount is in the ask currency |
| `freeze_order(params: FreezeOrderParams) -> Result<SendResult, Error>` | `order_freeze` | |
| `list_own_orders(account: u32) -> Result<Vec<OwnOrder>, Error>` | `order_list_own` | |
| `list_all_active_orders(params: ListOrdersParams) -> Result<Vec<ActiveOrder>, Error>` | `order_list_all_active` | Optional currency filters |

---

## Example

```rust
use mintlayer_sdk::wallet::{self, Amount, SendParams, TxOptions};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let c = wallet::Client::new("http://127.0.0.1:3034");

    c.open_wallet("/path/to/wallet.dat", None).await?;
    c.sync_wallet().await?;

    let balance = c.balance(0).await?;
    println!("coins: {:?}", balance.coins.atoms());

    let result = c.send(SendParams {
        account: 0,
        address: "mtc1q...".into(),
        amount: Amount::from_atoms(100_000_000_000), // 1 ML
        selected_utxos: vec![],
        options: TxOptions::default(),
    }).await?;
    println!("tx {} broadcast: {}", result.tx_id, result.broadcasted);
    Ok(())
}
```
