---
title: "Upgrading from v1.4.4 to v1.4.5"
description: "Wallet-cli nested command grammar, confirmation gates, one-shot exec mode, read-only wallet MCP server, and per-peer fork download budget."
sidebar_position: 8
---

This page covers upgrading from Mintlayer v1.4.4 to v1.4.5. There are no consensus forks, no storage version changes, and no resync required. The main change to be aware of is the **wallet-cli command grammar rework**.

## Wallet CLI: nested command grammar

Wallet-cli commands were reorganized into a nested grammar. A group word comes first, followed by the action:

| Legacy flat spelling | New nested spelling |
| -------------------- | ------------------- |
| `wallet-create` | `wallet create` |
| `wallet-recover` | `wallet recover` |
| `wallet-open` | `wallet open` |
| `address-new` | `address new` |
| `address-show` | `address list` |
| `address-qrcode` | `address qr` |
| `address-send` | `send` |
| `address-sweep-spendable` | `address sweep` |
| `address-deposit-data` | `data deposit` |
| `account-extended-public-key-as-hex` | `account show-xpub` |
| `account-sign-raw-transaction` | `transaction sign` |
| `standalone-add-watch-only-address` | `address standalone add` |
| `standalone-add-private-key-from-hex` | `address standalone add-private-key` |
| `standalone-add-multisig` | `address standalone add-multisig` |
| `standalone-address-show` | `address standalone list` |
| `standalone-address-details` | `address standalone details` |
| `standalone-address-label-rename` | `address standalone rename-label` |
| `standalone-multisig-utxos` | `address standalone utxos` |
| `address-reveal-public-key-as-hex` | `address reveal-public-key --format hex` |
| `address-reveal-public-key-as-address` | `address reveal-public-key` |
| `staking-create-pool` | `staking create-pool` |
| `staking-decommission-pool` | `staking decommission-pool` |
| `staking-decommission-pool-request` | `staking decommission-pool-request` |
| `staking-list-created-block-ids` | `staking list-created-blocks` |
| `staking-new-vrf-public-key` | `staking new-vrf-public-key` |
| `staking-show-vrf-public-keys` | `staking show-vrf-public-keys` |
| `staking-show-legacy-vrf-key` | `staking show-legacy-vrf-key` |
| `staking-pool-balance` | `staking pool-balance` |
| `staking-sweep-delegation` | `delegation sweep` |
| `token-issue-new` | `token issue` |
| `token-nft-issue-new` | `token nft issue` |
| `htlc-create-transaction` | `htlc create` |
| `wallet-encrypt-private-keys` | `wallet encrypt` |
| `wallet-disable-private-keys-encryption` | `wallet decrypt` |
| `wallet-unlock-private-keys` | `wallet unlock` |
| `wallet-lock-private-keys` | `wallet lock` |
| `challenge-sign-plain` | `challenge sign` |
| `challenge-verify-plain` | `challenge verify` |
| `node-enable-p2p-networking` | `node p2p` |
| `node-connect-to-peer` | `peer connect` |
| `node-disconnect-peer` | `peer disconnect` |
| `node-peer-count` | `peer count` |
| `node-list-connected-peers` | `peer list` |
| `node-list-banned-peers` | `peer banned` |
| `node-list-discouraged-peers` | `peer discouraged` |
| `node-ban-peer-address` | `peer ban` |
| `node-unban-peer-address` | `peer unban` |
| `node-undiscourage-peer-address` | `peer undiscourage` |
| `node-add-reserved-peer` | `peer reserved add` |
| `node-remove-reserved-peer` | `peer reserved remove` |
| `node-list-reserved-peers` | `peer reserved list` |
| `node-best-block-id` | `node best-block --id` |
| `node-best-block-height` | `node best-block --height` |
| `node-best-block-timestamp` | `node best-block --timestamp` |
| `node-get-block` | `node block` |
| `history-print` | `history print` |
| `history-clear` | `history clear` |
| `config-broadcast` | `config broadcast` |
| `screen-clear` | `clear` |

The complete mapping is also available inside the wallet with the `legacy` command, which lists every flat name and its nested equivalent.

**Backward compatibility.** Every legacy flat name keeps working, so existing scripts and `--commands-file` batches do not break. The flat names are no longer shown in `help` output or tab completion, so new documentation, examples, and helper scripts should use the nested spellings. Flat names without a nested equivalent also keep working: `wallet-rescan`, `wallet-sync`, `utxo-spend`, `node-generate-blocks`, `rpc-shutdown-and-exit`, plus the built-ins `version`, `exit`, and `help`.

### Interactive wizards

Complex commands can be built interactively with the new `wizard` command (interactive terminals only):

- `wizard token-issue`: builds a `token issue` command line
- `wizard nft-issue`: builds a `token nft issue` command line
- `wizard pool-create`: builds a `staking create-pool` command line
- `wizard order-create`: builds an `order create` command line
- `wizard htlc-create`: builds an `htlc create` command line

The wizard asks for each argument, shows a summary, and prints the resulting command line; in non-interactive runs it is rejected with an error.

### Confirmation gates

State-changing commands now ask for confirmation before running (for example, `send` recaps the amount, destination, and spent UTXOs; `node generate-block` asks before generating). In non-interactive runs (`--exec`, `--commands-file`), a gated command aborts unless the new `--yes` flag is passed. Read-only commands are unaffected.

### One-shot execution and machine-readable output

A new `--exec "<command>"` option runs a single wallet command and exits (exit status 0 on success, 1 on failure). The new `--output` option selects the format for `--exec` runs: `text` (default, human-readable) or `json` (a single JSON object on stdout; startup reports go to stderr, so stdout stays machine-parseable). Command results now carry a machine-readable payload alongside the human-readable text, and the JSON output reflects that payload. A new `completions --shell <shell>` verb emits shell completion scripts. See [One-shot Commands, Wizards, and Completions](../../wallet/cli/exec-and-wizards.md).

### Seed phrase storage is now a flag

For `wallet create software` and `wallet recover software`, the choice between storing the seed phrase and only displaying it is now the optional flag `--store-seed-phrase=true|false` (default: `true`). The old positional spelling (`store-seed-phrase` / `do-not-store-seed-phrase` before the mnemonic) still works; when passing the mnemonic positionally, that legacy slot must still precede it, or use the new `--mnemonic` flag instead.

## Wallet: read-only MCP server

A new `wallet-mcp-server` binary exposes a read-only Model Context Protocol (stdio) interface to a running `wallet-rpc-daemon`, letting MCP clients (AI assistants) inspect wallets without being able to move funds. See [MCP](../../build/mcp.md). This does not affect existing setups; the server is opt-in and must be started explicitly.

## Node: per-peer fork download budget

After the initial sync, each peer is limited in how many header lists it can make the node download per refill interval (defaults: 2000 downloads per 600 seconds), which bounds the cost of adversarial fork announcements. This is transparent for honest peers; no configuration is needed.

## Security notes

Wallet password file handling was hardened: the file size cap is enforced before reads, the size race between stat and read is closed, and unverifiable password sources fail closed instead of falling back silently.

## Changelogs

- [Core v1.4.5](https://github.com/mintlayer/mintlayer-core/blob/master/CHANGELOG.md#145---2026-11-10)
