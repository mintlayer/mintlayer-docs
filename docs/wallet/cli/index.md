---
title: "Mintlayer Command Line Options"
sidebar_position: 1
---

The `wallet-cli` command provides an interactive wallet interface. It uses a subcommand to select the network, followed by wallet options.

## Usage

```bash
wallet-cli [OPTIONS]
wallet-cli <COMMAND> [OPTIONS]
```

## Commands

| Command   | Description                     |
|-----------|---------------------------------|
| `mainnet` | Connect to / operate on mainnet |
| `testnet` | Connect to / operate on testnet |
| `regtest` | Connect to / operate on regtest |
| `signet`  | Connect to / operate on signet  |

Example:
```bash
wallet-cli mainnet --wallet-file ~/my-wallet.dat
wallet-cli testnet --cold-wallet
```

Options can be placed before or after the network subcommand. When placed before, they apply globally; when after, they apply to the specific network. The environment variable prefix changes by network (e.g. `ML_MAINNET_WALLET_*`, `ML_TESTNET_WALLET_*`).

## Wallet File Options

- **`--wallet-file <WALLET_FILE>`**: Path to the wallet file.
  - Env: `ML_WALLET_WALLET_FILE`

- **`--wallet-password <WALLET_PASSWORD>`**: Password to unlock an encrypted wallet on startup.
  - Env: `ML_WALLET_WALLET_PASSWORD`

- **`--force-change-wallet-type`**: Force-change the wallet type between hot and cold.
  - Env: `ML_WALLET_FORCE_CHANGE_WALLET_TYPE`

- **`--hardware-wallet <HARDWARE_WALLET>`**: Specify that the wallet file is associated with a hardware wallet.
  - Env: `ML_WALLET_HARDWARE_WALLET`
  - Possible values: `trezor`

## Staking

- **`--start-staking-for-account <ACCOUNT_INDEX>`**: Start staking for the specified account index after startup.
  - Env: `ML_WALLET_START_STAKING_FOR_ACCOUNT`

- **`--start-staking`**: *(Deprecated)* Start staking for the default account. Use `--start-staking-for-account` instead.
  - Env: `ML_WALLET_START_STAKING`

## Node RPC Connection

These options configure the connection to the Mintlayer node's RPC interface.

- **`--node-rpc-address <NODE_RPC_ADDRESS>`**: RPC address of the node to connect to.
  - Env: `ML_WALLET_NODE_RPC_ADDRESS`

- **`--node-rpc-cookie-file <NODE_RPC_COOKIE_FILE>`**: Path to the node's RPC cookie file. Defaults to the standard cookie file location.
  - Env: `ML_WALLET_NODE_RPC_COOKIE_FILE`

- **`--node-rpc-username <NODE_RPC_USERNAME>`**: Node RPC username. Use either username/password or a cookie file, not both.
  - Env: `ML_WALLET_NODE_RPC_USERNAME`

- **`--node-rpc-password <NODE_RPC_PASSWORD>`**: Node RPC password. Use either username/password or a cookie file, not both.
  - Env: `ML_WALLET_NODE_RPC_PASSWORD`

- **`--cold-wallet`**: Run the wallet without connecting to a node (cold wallet / offline mode).
  - Env: `ML_WALLET_COLD_WALLET`

## Wallet RPC Server

The wallet-cli can optionally expose its own RPC interface, allowing external tools (e.g. a remote CLI) to control it.

- **`--enable-wallet-rpc-interface`**: Enable the wallet's own RPC server.
  - Env: `ML_WALLET_ENABLE_WALLET_RPC_INTERFACE`

- **`--wallet-rpc-bind-address <ADDR>`**: Address to bind the wallet RPC server to.
  - Env: `ML_WALLET_WALLET_RPC_BIND_ADDRESS`

- **`--wallet-rpc-cookie-file <WALLET_RPC_COOKIE_FILE>`**: Path to the wallet RPC cookie file. Defaults to the standard location.
  - Env: `ML_WALLET_WALLET_RPC_COOKIE_FILE`

- **`--wallet-rpc-username <WALLET_RPC_USERNAME>`**: Username for the wallet RPC server. Use username/password, a cookie file, or `--wallet-rpc-no-authentication`.
  - Env: `ML_WALLET_WALLET_RPC_USERNAME`

- **`--wallet-rpc-password <WALLET_RPC_PASSWORD>`**: Password for the wallet RPC server.
  - Env: `ML_WALLET_WALLET_RPC_PASSWORD`

- **`--wallet-rpc-no-authentication`**: Run the wallet RPC server without authentication. Use with caution.
  - Env: `ML_WALLET_WALLET_RPC_NO_AUTHENTICATION`

## Remote RPC Wallet

Instead of managing a wallet directly, the CLI can act as a thin interface to a remote `wallet-rpc-daemon`.

- **`--remote-rpc-wallet-address <REMOTE_RPC_WALLET_ADDRESS>`**: Address of the remote wallet RPC daemon.
  - Env: `ML_WALLET_REMOTE_RPC_WALLET_ADDRESS`

- **`--remote-rpc-wallet-cookie-file <REMOTE_RPC_WALLET_COOKIE_FILE>`**: Cookie file for the remote wallet RPC. Defaults to the standard location.
  - Env: `ML_WALLET_REMOTE_RPC_WALLET_COOKIE_FILE`

- **`--remote-rpc-wallet-username <REMOTE_RPC_WALLET_USERNAME>`**: Username for the remote wallet RPC. Use either username/password or a cookie file, not both.
  - Env: `ML_WALLET_REMOTE_RPC_WALLET_USERNAME`

- **`--remote-rpc-wallet-password <REMOTE_RPC_WALLET_PASSWORD>`**: Password for the remote wallet RPC.
  - Env: `ML_WALLET_REMOTE_RPC_WALLET_PASSWORD`

- **`--remote-rpc-wallet-no-authentication`**: Connect to the remote wallet RPC without authentication.
  - Env: `ML_WALLET_REMOTE_RPC_WALLET_NO_AUTHENTICATION`

## REPL Behavior

- **`--commands-file <COMMANDS_FILE>`**: Read and execute commands from a file instead of opening an interactive session.
  - Env: `ML_WALLET_COMMANDS_FILE`

- **`--history-file <HISTORY_FILE>`**: Persist the command history between sessions. **Warning:** history may contain sensitive data such as seed phrases.
  - Env: `ML_WALLET_HISTORY_FILE`

- **`--exit-on-error <EXIT_ON_ERROR>`**: Exit on error. Defaults to `true` in non-interactive mode, `false` in interactive mode.
  - Env: `ML_WALLET_EXIT_ON_ERROR`
  - Possible values: `true`, `false`

- **`--vi-mode`**: Enable vi key bindings in the interactive REPL.
  - Env: `ML_WALLET_VI_MODE`

- **`--no-qr`**: Disable QR code output for wallet commands.
  - Env: `ML_WALLET_NO_QR`

## Transaction Fee

- **`--in-top-x-mb <IN_TOP_X_MB>`**: Target mempool fee tier. The wallet will aim for transactions to be in the top N MB of the mempool (ranked by fee). Higher values mean lower fees but slower confirmation. Default: `5`.
  - Env: `ML_WALLET_IN_TOP_X_MB`

## Other

- **`-h, --help`**: Print help.
- **`-V, --version`**: Print version.
