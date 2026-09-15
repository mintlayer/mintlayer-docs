---
title: "Mintlayer Wallet CLI Guide"
sidebar_position: 2
---

This page lists all commands available in the interactive `wallet-cli` REPL. Type `help` inside the wallet to see the list at any time, or `help <command>` for details on a specific command.

Commands are grouped by function. Commands marked with *(cold)* are available without a node connection (using `--cold-wallet`).

## Table of Contents
- [Wallet Management](#wallet-management)
- [Accounts](#accounts)
- [Addresses](#addresses)
- [Standalone Addresses](#standalone-addresses)
- [Staking and Pools](#staking-and-pools)
- [Delegations](#delegations)
- [Tokens and NFTs](#tokens-and-nfts)
- [Orders](#orders)
- [Transactions](#transactions)
- [HTLC](#htlc)
- [Challenge Signing](#challenge-signing)
- [Node](#node)
- [REPL and Miscellaneous](#repl-and-miscellaneous)

---

## Wallet Management

| Command | Description |
|---------|-------------|
| [wallet-create](commands/wallet-management/wallet-create-command-guide.md) | *(cold)* Create a new wallet. This will create a new file without scanning the blockchain. |
| [wallet-recover](commands/wallet-management/wallet-recover-command-guide.md) | *(cold)* Recover a wallet. This will create a new wallet file and scan the blockchain for associated transactions. |
| [wallet-open](commands/wallet-management/wallet-open-command-guide.md) | *(cold)* Open an existing wallet file. |
| [wallet-close](commands/wallet-management/wallet-close-command-guide.md) | *(cold)* Close the currently opened wallet file. |
| [wallet-info](commands/wallet-management/wallet-info-command-guide.md) | *(cold)* Obtain certain information about the wallet, such as the number of accounts and their names. |
| [wallet-encrypt-private-keys](commands/wallet-management/wallet-encrypt-private-keys-command-guide.md) | *(cold)* Encrypts the private keys with a new password, expects the wallet to be unlocked. |
| [wallet-disable-private-keys-encryption](commands/wallet-management/wallet-disable-private-keys-encryption-command-guide.md) | *(cold)* Completely and totally remove any existing encryption, expects the wallet to be unlocked. **Warning:** After this, your wallet file will be USABLE BY ANYONE without a password. |
| [wallet-unlock-private-keys](commands/wallet-management/wallet-unlock-private-keys-command-guide.md) | *(cold)* Unlocks the private keys for usage. |
| [wallet-lock-private-keys](commands/wallet-management/wallet-lock-private-keys-command-guide.md) | *(cold)* Locks the private keys so they can't be used until they are unlocked again. |
| [wallet-show-seed-phrase](commands/wallet-management/wallet-show-seed-phrase-command-guide.md) | *(cold)* Show the seed phrase for the loaded wallet if it has been stored. |
| [wallet-purge-seed-phrase](commands/wallet-management/wallet-purge-seed-phrase-command-guide.md) | *(cold)* Delete the seed phrase from the loaded wallet's database, if it has been stored. |
| [wallet-set-lookahead-size](commands/wallet-management/wallet-set-lookahead-size-command-guide.md) | *(cold)* Set the lookahead size for key generation. |
| [wallet-rescan](commands/wallet-management/wallet-rescan-command-guide.md) | Rescan the blockchain and re-detect all operations related to the selected account in this wallet. |
| [wallet-sync](commands/wallet-management/wallet-sync-command-guide.md) | Force the wallet to scan the remaining blocks from node until the tip is reached. |

---

## Accounts

| Command | Description |
|---------|-------------|
| [account-create](commands/accounts-addresses/account-create-command-guide.md) | Creates a new account with an optional name. |
| [account-rename](commands/accounts-addresses/account-rename-command-guide.md) | Renames the selected account with an optional name. If the name is not specified, it will remove any existing name for the account. |
| [account-select](commands/accounts-addresses/account-select-command-guide.md) | Switch to a given wallet account. |
| [account-balance](commands/accounts-addresses/account-balance-command-guide.md) | Get the total balance in the selected account in this wallet. See available options to include more categories, like locked coins. |
| [account-utxos](commands/accounts-addresses/account-utxos-command-guide.md) | Lists all the utxos owned by this account. |
| [account-extended-public-key-as-hex](commands/accounts-addresses/account-extended-public-key-as-hex-command-guide.md) | *(cold)* Shows the account's extended public key. |
| [account-sign-raw-transaction](commands/accounts-addresses/account-sign-raw-transaction-command-guide.md) | *(cold)* Signs transaction inputs that are not yet signed. |

---

## Addresses

| Command | Description |
|---------|-------------|
| [address-new](commands/accounts-addresses/address-new-command-guide.md) | *(cold)* Generate a new unused address. |
| [address-show](commands/accounts-addresses/address-show-command-guide.md) | *(cold)* Show receive-addresses with their usage state. |
| [address-qrcode](commands/accounts-addresses/address-qrcode-command-guide.md) | *(cold)* Creates a QR code of the provided address. |
| [address-reveal-public-key-as-hex](commands/accounts-addresses/address-reveal-public-key-as-hex-command-guide.md) | *(cold)* Reveal the public key behind the specified "public key hash" address as a hex encoded string. |
| [address-reveal-public-key-as-address](commands/accounts-addresses/address-reveal-public-key-as-address-command-guide.md) | *(cold)* Reveal the public key behind the specified "public key hash" address in address encoding. |
| [address-send](commands/accounts-addresses/address-send-command-guide.md) | Send a given coin amount to a given address. The wallet will automatically calculate the required fees. |
| [address-sweep-spendable](commands/accounts-addresses/address-sweep-spendable-command-guide.md) | Sweep all spendable coins or tokens from the specified (or all) addresses to the given destination address. |
| [address-deposit-data](commands/accounts-addresses/address-deposit-data-command-guide.md) | Store data on the blockchain. |

---

## Standalone Addresses

Standalone addresses are watch-only or independently-managed addresses added to the wallet without deriving them from the wallet's seed.

| Command | Description |
|---------|-------------|
| [standalone-address-show](commands/standalone/standalone-address-show-command-guide.md) | *(cold)* Show added standalone addresses with their labels. |
| [standalone-address-details](commands/standalone/standalone-address-details-command-guide.md) | *(cold)* Show standalone address details. |
| [standalone-address-label-rename](commands/standalone/standalone-address-label-rename-command-guide.md) | *(cold)* Add, rename or delete a label to an already added standalone address. |
| [standalone-add-watch-only-address](commands/standalone/standalone-add-watch-only-address-command-guide.md) | *(cold)* Add a new standalone watch-only address not derived from the selected account's key chain. |
| [standalone-add-private-key-from-hex](commands/standalone/standalone-add-private-key-from-hex-command-guide.md) | *(cold)* Add a new standalone private key not derived from the selected account's key chain. |
| [standalone-add-multisig](commands/standalone/standalone-add-multisig-command-guide.md) | *(cold)* Add a new standalone multi-signature address. |
| [standalone-multisig-utxos](commands/standalone/standalone-multisig-utxos-command-guide.md) | Lists all the utxos owned by multisig addresses watched by this account. |

---

## Staking and Pools

A minimum pledge of **40,000 TML** is required to create a staking pool.

| Command | Description |
|---------|-------------|
| [staking-start](commands/staking/staking-start-command-guide.md) | Start staking, assuming there are staking pools in the selected account in this wallet. |
| [staking-stop](commands/staking/staking-stop-command-guide.md) | Stop staking, assuming there are staking pools staking currently in the selected account in this wallet. |
| [staking-status](commands/staking/staking-status-command-guide.md) | Show the staking status for the currently selected account in this wallet. |
| [staking-pool-balance](commands/staking/staking-pool-balance-command-guide.md) | Obtain the balance of a staking pool. |
| [staking-list-pools](commands/staking/staking-list-pools-command-guide.md) | List ids of pools that are controlled by the selected account in this wallet. |
| [staking-list-owned-pools-for-decommission](commands/staking/staking-list-owned-pools-for-decommission-command-guide.md) | List pools that can be decommissioned by the selected account in this wallet. |
| [staking-list-created-block-ids](commands/staking/staking-list-created-block-ids-command-guide.md) | List the blocks created by the selected account in this wallet through staking/mining/etc. |
| [staking-create-pool](commands/staking/staking-create-pool-command-guide.md) | Create a staking pool. The pool will be capable of creating blocks and gaining rewards, as well as taking delegations from other users. |
| [staking-decommission-pool](commands/staking/staking-decommission-pool-command-guide.md) | Decommission a staking pool, given its id. This assumes that the decommission key is owned by the selected account in this wallet. |
| [staking-decommission-pool-request](commands/staking/staking-decommission-pool-request-command-guide.md) | Create a request to decommission a pool. This assumes that the decommission key is owned by another wallet. |
| [staking-new-vrf-public-key](commands/staking/staking-new-vrf-public-key-command-guide.md) | *(cold)* Issue a new staking VRF (Verifiable Random Function) key for this account. |
| [staking-show-vrf-public-keys](commands/staking/staking-show-vrf-public-keys-command-guide.md) | *(cold)* Show the issued staking VRF (Verifiable Random Function) keys for this account. |
| [staking-show-legacy-vrf-key](commands/staking/staking-show-legacy-vrf-key-command-guide.md) | *(cold)* Shows the legacy VRF key that uses an abandoned derivation mechanism. |
| [staking-sweep-delegation](commands/staking/staking-sweep-delegation-command-guide.md) | Sweep all the coins from a delegation to a given address. The wallet will automatically calculate the required fees. |

---

## Delegations

| Command | Description |
|---------|-------------|
| [delegation-create](commands/staking/delegation-create-command-guide.md) | Create a delegation to a given pool id and the owner address/destination. |
| [delegation-list-ids](commands/staking/delegation-list-ids-command-guide.md) | List delegation ids controlled by the selected account in this wallet, with their balances. |
| [delegation-stake](commands/staking/delegation-stake-command-guide.md) | Send coins to a delegation id to be staked. |
| [delegation-withdraw](commands/staking/delegation-withdraw-command-guide.md) | Send coins from a delegation id (that you own) to stop staking them. Note that stopping the delegation requires a lock period. |

---

## Tokens and NFTs

| Command | Description |
|---------|-------------|
| [token-issue-new](commands/tokens/token-issue-new-command-guide.md) | Issue a new fungible token. |
| [token-nft-issue-new](commands/tokens/token-nft-issue-new-command-guide.md) | Issue a new non-fungible token (NFT). |
| [token-change-authority](commands/tokens/token-change-authority-command-guide.md) | Change the authority address of a token. |
| [token-change-metadata-uri](commands/tokens/token-change-metadata-uri-command-guide.md) | Change the metadata URI of a token. |
| [token-mint](commands/tokens/token-mint-command-guide.md) | Given a token that is already issued, mint new tokens and increase the circulating supply. |
| [token-unmint](commands/tokens/token-unmint-command-guide.md) | Unmint existing tokens and reduce the circulating supply. |
| [token-lock-supply](commands/tokens/token-lock-supply-command-guide.md) | Lock the circulating supply for the token. **THIS IS IRREVERSIBLE.** |
| [token-freeze](commands/tokens/token-freeze-command-guide.md) | Freeze the token, which forbids any operations with it (except for the optional unfreeze). |
| [token-unfreeze](commands/tokens/token-unfreeze-command-guide.md) | Unfreeze the token, making all operations available for it again. |
| [token-send](commands/tokens/token-send-command-guide.md) | Send the given token amount to the given address. |

---

## Orders

| Command | Description |
|---------|-------------|
| [order-create](commands/orders/order-create-command-guide.md) | Create an order for exchanging one currency for another. |
| [order-fill](commands/orders/order-fill-command-guide.md) | Fill an order (partially or fully) with the asked currency. |
| [order-freeze](commands/orders/order-freeze-command-guide.md) | Freeze an order to prevent further fills. |
| [order-conclude](commands/orders/order-conclude-command-guide.md) | Conclude an order and withdraw accumulated funds. |
| [order-list-own](commands/orders/order-list-own-command-guide.md) | List orders whose conclude key is owned by the selected account. |
| [order-list-all-active](commands/orders/order-list-all-active-command-guide.md) | List all active (non-concluded, non-frozen) orders, with optional currency filters. |

---

## Transactions

| Command | Description |
|---------|-------------|
| [utxo-spend](commands/transactions/utxo-spend-command-guide.md) | Spend a specific UTXO, moving its funds to a given address. |
| [transaction-compose](commands/transactions/transaction-compose-command-guide.md) | Compose a new transaction from the specified outputs and selected utxos. |
| [transaction-abandon](commands/transactions/transaction-abandon-command-guide.md) | Abandon an unconfirmed transaction in the wallet database, and make the consumed inputs available to be used again. |
| [transaction-list-pending](commands/transactions/transaction-list-pending-command-guide.md) | List the pending transactions that can be abandoned. |
| [transaction-list-by-address](commands/transactions/transaction-list-by-address-command-guide.md) | List transactions owned by this account that have already been included in a block, with an optional address filter. |
| [transaction-get](commands/transactions/transaction-get-command-guide.md) | Get a transaction from the wallet, if present. |
| [transaction-get-raw](commands/transactions/transaction-get-raw-command-guide.md) | Get a transaction from the wallet, if present, as hex encoded raw transaction. |
| [transaction-get-signed-raw](commands/transactions/transaction-get-signed-raw-command-guide.md) | Get a signed transaction from the wallet, if present, as hex encoded raw transaction. |
| [transaction-create-from-cold-input](commands/transactions/transaction-create-from-cold-input-command-guide.md) | Creates a transaction that spends from a specific address, and returns the change to the same address (unless one is specified), without signature. |
| [transaction-inspect](commands/transactions/transaction-inspect-command-guide.md) | Print the summary of a transaction. |

---

## HTLC

| Command | Description |
|---------|-------------|
| [htlc-create-transaction](commands/htlc/htlc-create-transaction-command-guide.md) | Create a transaction with an HTLC output (without broadcasting). |
| [htlc-generate-secret](commands/htlc/htlc-generate-secret-command-guide.md) | Generate a random HTLC secret. |
| [htlc-calc-secret-hash](commands/htlc/htlc-calc-secret-hash-command-guide.md) | Compute the hash of an HTLC secret. |

---

## Challenge Signing

| Command | Description |
|---------|-------------|
| [challenge-sign-plain](commands/accounts-addresses/challenge-sign-plain-command-guide.md) | *(cold)* Signs a challenge with a private key corresponding to the provided address. |
| [challenge-verify-plain](commands/accounts-addresses/challenge-verify-plain-command-guide.md) | *(cold)* Verifies a signed challenge against an address. |

---

## Node

These commands interact with the connected Mintlayer node.

### Info and Control

| Command | Description |
|---------|-------------|
| [node-version](commands/node-control/node-version-command-guide.md) | Obtain the node version. |
| [node-shutdown](commands/node-control/node-shutdown-command-guide.md) | Shutdown the node. |
| [node-enable-p2p-networking](commands/node-control/node-enable-p2p-networking-command-guide.md) | Enable or disable p2p networking in the node. |
| [node-chainstate-info](commands/node-control/node-chainstate-info-command-guide.md) | Returns the current node's chainstate information (block height and more). |
| [node-best-block-id](commands/node-control/node-best-block-id-command-guide.md) | Returns the current best block id. |
| [node-best-block-height](commands/node-control/node-best-block-height-command-guide.md) | Returns the current best block height. |
| [node-best-block-timestamp](commands/node-control/node-best-block-timestamp-command-guide.md) | Returns the current best block timestamp. |
| [node-block-id](commands/node-control/node-block-id-command-guide.md) | Get the block id of the block at a given height. |
| [node-get-block](commands/node-control/node-get-block-command-guide.md) | Get a block by its id, represented as hex encoded bytes. |
| [node-submit-block](commands/node-control/node-submit-block-command-guide.md) | Submit a block to be included in the chain. |
| [node-submit-transaction](commands/node-control/node-submit-transaction-command-guide.md) | Submits a transaction to mempool, and if it is valid, broadcasts it to the network. |
| [node-generate-block](commands/node-control/node-generate-block-command-guide.md) | Generate a block with the given transactions to the specified reward destination. |

### Peers

| Command | Description |
|---------|-------------|
| [node-peer-count](commands/node-control/node-peer-count-command-guide.md) | Get the number of connected peers in the node. |
| [node-list-connected-peers](commands/node-control/node-list-connected-peers-command-guide.md) | List connected peers in the node. |
| [node-list-reserved-peers](commands/node-control/node-list-reserved-peers-command-guide.md) | List reserved peers in the node. |
| [node-add-reserved-peer](commands/node-control/node-add-reserved-peer-command-guide.md) | Add a reserved peer in the node. |
| [node-remove-reserved-peer](commands/node-control/node-remove-reserved-peer-command-guide.md) | Remove a reserved peer in the node. |
| [node-connect-to-peer](commands/node-control/node-connect-to-peer-command-guide.md) | Connect to a remote peer in the node. |
| [node-disconnect-peer](commands/node-control/node-disconnect-peer-command-guide.md) | Disconnect a remote peer in the node. |
| [node-list-banned-peers](commands/node-control/node-list-banned-peers-command-guide.md) | List banned peers in the node. |
| [node-ban-peer-address](commands/node-control/node-ban-peer-address-command-guide.md) | Ban an address in the node for the specified duration. |
| [node-unban-peer-address](commands/node-control/node-unban-peer-address-command-guide.md) | Unban an address in the node. |
| [node-list-discouraged-peers](commands/node-control/node-list-discouraged-peers-command-guide.md) | List discouraged peers in the node. |
| [node-undiscourage-peer-address](commands/node-control/node-undiscourage-peer-address-command-guide.md) | Undiscourage an address in the node. |

---

## REPL and Miscellaneous

| Command | Description |
|---------|-------------|
| [config-broadcast](commands/wallet-management/config-broadcast-command-guide.md) | Configure broadcasting to Mempool to yes or no. When set to no, transactions are returned as hex instead of being submitted automatically; use `node-submit-transaction` to broadcast manually. |
| [version](commands/wallet-management/version-command-guide.md) | *(cold)* Print the version of the wallet software and possibly the git commit hash, if found. |
| [exit](commands/wallet-management/exit-command-guide.md) | *(cold)* Exit the wallet. |
| [rpc-shutdown-and-exit](commands/node-control/rpc-shutdown-and-exit-command-guide.md) | Shutdown the RPC interface or the remote wallet it is connected to and exit the wallet. |
| [history-print](commands/wallet-management/history-print-command-guide.md) | *(cold)* Print command history in the wallet for this execution. |
| [history-clear](commands/wallet-management/history-clear-command-guide.md) | *(cold)* Clear command history for this execution. |
| [screen-clear](commands/wallet-management/screen-clear-command-guide.md) | *(cold)* Clear screen. |
| `help` | *(cold)* Print this message or the help of the given subcommand(s). |
