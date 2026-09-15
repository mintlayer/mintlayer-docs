---
title: "Wallet RPC Daemon"
sidebar_position: 1
---

The `wallet-rpc-daemon` is a headless wallet service that exposes an RPC interface. It is designed for server environments where the wallet needs to run continuously (e.g. for staking), while the `wallet-cli`, or any other RPC client, is used to control it remotely.

## Usage

```bash
wallet-rpc-daemon <COMMAND> [OPTIONS]
```

## Commands

| Command   | Description                     |
|-----------|---------------------------------|
| `mainnet` | Run the mainnet wallet RPC daemon |
| `testnet` | Run the testnet wallet RPC daemon |
| `regtest` | Run the regtest wallet RPC daemon |

## Options

The following options apply to each network subcommand. Environment variable prefixes differ by network (e.g. `ML_MAINNET_WALLET_RPC_DAEMON_*`).

### Wallet File

- **`--wallet-file <PATH>`**: The wallet file to operate on.
  - Env: `ML_MAINNET_WALLET_RPC_DAEMON_WALLET_FILE`

- **`--force-change-wallet-type`**: Force-change the wallet type between hot and cold.
  - Env: `ML_MAINNET_WALLET_RPC_DAEMON_FORCE_CHANGE_WALLET_TYPE`

- **`--hardware-wallet <HARDWARE_WALLET>`**: Specify that the wallet file is associated with a hardware wallet.
  - Env: `ML_MAINNET_WALLET_RPC_DAEMON_HARDWARE_WALLET`
  - Possible values: `trezor`

- **`--start-staking-for-account <ACC_NUMBER>`**: Start staking for the specified account after startup.
  - Env: `ML_MAINNET_WALLET_RPC_DAEMON_START_STAKING_FOR_ACCOUNT`

- **`--cold-wallet`**: Run without connecting to a node (cold/offline mode).
  - Env: `ML_MAINNET_WALLET_RPC_DAEMON_COLD_WALLET`

### Node RPC Connection

- **`--node-rpc-address <ADDR>`**: RPC address of the node to connect to.
  - Env: `ML_MAINNET_WALLET_RPC_DAEMON_NODE_RPC_ADDRESS`

- **`--node-rpc-cookie-file <PATH>`**: Node RPC cookie file path.
  - Env: `ML_MAINNET_WALLET_RPC_DAEMON_NODE_RPC_COOKIE_FILE`

- **`--node-rpc-username <NAME>`**: Node RPC username.
  - Env: `ML_MAINNET_WALLET_RPC_DAEMON_NODE_RPC_USERNAME`

- **`--node-rpc-password <PASS>`**: Node RPC password.
  - Env: `ML_MAINNET_WALLET_RPC_DAEMON_NODE_RPC_PASSWORD`

### Wallet RPC Server

Authentication is required. Provide either a username/password pair, a cookie file, or use `--rpc-no-authentication`.

- **`--rpc-bind-address <ADDR>`**: Address to bind the wallet RPC server to.
  - Env: `ML_MAINNET_WALLET_RPC_DAEMON_RPC_BIND_ADDRESS`

- **`--rpc-cookie-file <PATH>`**: Custom path for the wallet RPC cookie file. Defaults to the data directory.
  - Env: `ML_MAINNET_WALLET_RPC_DAEMON_RPC_COOKIE_FILE`

- **`--rpc-username <USER>`**: Username for wallet RPC basic authorization. If not set, a cookie file is created automatically.
  - Env: `ML_MAINNET_WALLET_RPC_DAEMON_RPC_USERNAME`

- **`--rpc-password <PASS>`**: Password for wallet RPC basic authorization.
  - Env: `ML_MAINNET_WALLET_RPC_DAEMON_RPC_PASSWORD`

- **`--rpc-no-authentication`**: Run the wallet RPC server without authentication. Use with caution.
  - Env: `ML_MAINNET_WALLET_RPC_DAEMON_RPC_NO_AUTHENTICATION`

### Security

- **`--force-allow-run-as-root`**: Allow running as root. **Not recommended.**
  - Env: `ML_MAINNET_WALLET_RPC_DAEMON_FORCE_ALLOW_RUN_AS_ROOT`

## Connecting with wallet-cli

To control a running `wallet-rpc-daemon` from the CLI, use `--remote-rpc-wallet-address`:

```bash
wallet-rpc-daemon mainnet \
  --wallet-file ~/staking-wallet.dat \
  --start-staking-for-account 0 \
  --rpc-cookie-file ~/.mintlayer/mainnet/wallet-rpc-cookie

# In a separate terminal:
wallet-cli mainnet \
  --remote-rpc-wallet-address 127.0.0.1:3034 \
  --remote-rpc-wallet-cookie-file ~/.mintlayer/mainnet/wallet-rpc-cookie
```
