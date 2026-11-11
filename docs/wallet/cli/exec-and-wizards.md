---
title: "Wallet CLI: One-shot Commands, Wizards, and Completions"
description: "Run wallet-cli commands non-interactively with --exec, JSON output, confirmation flags, interactive wizards, and shell completions."
sidebar_position: 3
---

Besides the interactive REPL, `wallet-cli` can run single commands non-interactively, build complex commands interactively, and generate shell completions. This page covers these workflows, introduced in v1.4.5. See the [command reference](commands.md) for the full command list and the [v1.4.5 upgrade guide](../../node/upgrading/upgrading-from-v1.4.4-to-v1.4.5.md) for the nested command grammar.

## One-shot commands with `--exec`

`--exec "<command>"` runs a single wallet command and exits. The command is spelled exactly as in the interactive wallet:

```bash
wallet-cli testnet --wallet-file ~/wallet.dat --exec "account balance"
wallet-cli testnet --cold-wallet --exec "address new"
```

The exit status is `0` when the command succeeded and `1` when it failed. Startup reports go to standard error, so standard output only contains the command result.

### JSON output

Add `--output json` to get a single JSON object on standard output, suitable for scripts:

```bash
wallet-cli testnet --wallet-file ~/wallet.dat --exec "account balance" --output json
```

Command results carry a machine-readable payload alongside the human-readable text; the JSON output reflects that payload. If a command only produces text, the object has a single `output` field. Combined with the `0`/`1` exit status, this makes `wallet-cli --exec` usable from cron jobs, CI, and other automation.

## Confirmation gates and `--yes`

State-changing commands ask for confirmation before running. For example, `send` recaps the amount, the destination, and the UTXOs being spent; `node generate-block` asks before generating a block; destructive wallet operations (disabling private key encryption, purging the seed phrase, ...) ask as well. Read-only commands are unaffected.

In interactive sessions, confirm the prompt as usual. In non-interactive runs (`--exec` and `--commands-file`), there is no terminal to answer on, so a gated command **aborts** unless you pass `--yes`:

```bash
wallet-cli testnet --wallet-file ~/wallet.dat --yes --exec "send tmt1q... 10"
```

`--yes` answers "yes" to every confirmation prompt. Use it deliberately: it skips all safety prompts for the run.

## Interactive wizards

Complex commands with many arguments can be built with the `wizard` command inside the interactive REPL:

| Wizard | Builds the command line for |
| ------ | --------------------------- |
| `wizard token-issue` | `token issue` |
| `wizard nft-issue` | `token nft issue` |
| `wizard pool-create` | `staking create-pool` |
| `wizard order-create` | `order create` |
| `wizard htlc-create` | `htlc create` |

The wizard prompts for each argument, shows a summary, and prints the resulting command line, which you can then run or copy elsewhere. Wizards require an interactive terminal; in `--exec` or `--commands-file` runs they are rejected with an error.

## Shell completions

The `wallet-cli` binary can emit completion scripts for your shell:

```bash
wallet-cli completions --shell bash > ~/.local/share/bash-completion/completions/wallet-cli
wallet-cli completions --shell zsh > "${fpath[1]}/_wallet-cli"
```

Supported shells follow the `clap_complete` set: `bash`, `zsh`, `fish`, `elvish`, and `powershell`. The generated scripts complete the `wallet-cli` binary itself: the network subcommands (`mainnet`, `testnet`, `regtest`, `signet`) and its command-line options. The interactive session's own tab completion is separate: inside the REPL it offers the nested command spellings (legacy flat names still work but are not offered).
