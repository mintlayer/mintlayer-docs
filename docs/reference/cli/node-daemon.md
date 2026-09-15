---
title: "node-daemon"
sidebar_position: 3
---

The `node-daemon` command runs the Mintlayer node. It uses a subcommand to select the network, followed by network-specific options.

## Usage

```bash
node-daemon [GLOBAL OPTIONS] <COMMAND> [OPTIONS]
```

## Commands

| Command   | Description              |
|-----------|--------------------------|
| `mainnet` | Run the mainnet node     |
| `testnet` | Run the testnet node     |
| `regtest` | Run the regtest node     |

Example:
```bash
node-daemon mainnet
node-daemon testnet --p2p-bind-addresses 0.0.0.0:13031
```

## Global Options

These options apply before the network subcommand.

- **`-d, --datadir <DATA_DIR>`**: Path to the data directory.
  - Env: `ML_NODE_DATADIR`

- **`--create-datadir-if-missing <VAL>`**: Create the data directory if missing. Defaults to `true` for the default directory, `false` for a custom one.
  - Env: `ML_NODE_CREATE_DATADIR_IF_MISSING`
  - Possible values: `true`, `false`

- **`--log-to-file <LOG_TO_FILE>`**: Also write logs to a file in the `logs/` subdirectory of the data directory. Log level is always `INFO` when writing to file, regardless of `RUST_LOG`. Enabled by default for `node-gui`, disabled for `node-daemon`.
  - Env: `ML_NODE_LOG_TO_FILE`
  - Possible values: `true`, `false`

- **`-c, --clean-data`**: Clean the data directory and exit immediately.
  - Env: `ML_NODE_CLEAN_DATA`

- **`--import-bootstrap-file <FILE>`**: Start with networking disabled, import blocks from the specified file, then exit.
  - Env: `ML_NODE_IMPORT_BOOTSTRAP_FILE`

- **`-h, --help`**: Print help.

- **`-V, --version`**: Print version.

## Network Subcommand Options

All network subcommands (`mainnet`, `testnet`, `regtest`) share the same set of options. Environment variable prefixes differ by network (e.g. `ML_MAINNET_NODE_*`, `ML_TESTNET_NODE_*`).

### Block Production

- **`--blockprod-min-peers-to-produce-blocks <COUNT>`**: Minimum number of connected peers required to enable block production.

- **`--blockprod-skip-ibd-check`**: Skip the initial block download (IBD) check before producing blocks. Only use this when starting a node from Genesis; using it on an existing node may result in producing past blocks and getting banned by the network.

### Storage

- **`--storage-backend <STORAGE_BACKEND>`**: Storage backend to use.

- **`--max-db-commit-attempts <COUNT>`**: Maximum number of attempts to process a block.

- **`--enable-db-reckless-mode-in-ibd`**: Switch to "reckless" mode during initial block download (IBD) or bootstrapping. In this mode, the chainstate database is not synced to disk on each commit, which improves performance at the cost of potential data corruption on a system crash. The node automatically returns to normal mode after IBD. If a crash occurs during reckless mode, delete the chainstate database and re-sync.

- **`--max-orphan-blocks <COUNT>`**: Maximum capacity of the orphan blocks pool.

- **`--enable-chainstate-heavy-checks <VAL>`**: Enable additional computationally-expensive consistency checks. Defaults to `true` for regtest, `false` otherwise.
  - Possible values: `true`, `false`

### P2P Networking

- **`--p2p-networking-enabled <VAL>`**: Enable or disable P2P networking.
  - Possible values: `true`, `false`

- **`--p2p-bind-addresses <ADDR>`**: Addresses to bind P2P to. Can be specified multiple times or as a comma-separated list.

- **`--p2p-socks5-proxy <PROXY>`**: Connect through a SOCKS5 proxy.

- **`--p2p-boot-nodes <ADDR>`**: Boot node addresses to connect to on startup. Can be specified multiple times or as a comma-separated list.

- **`--p2p-reserved-nodes <ADDR>`**: Reserved node addresses to always stay connected to. Can be specified multiple times or as a comma-separated list.

- **`--p2p-whitelist-addr <ADDR>`**: Whitelisted addresses. Can be specified multiple times or as a comma-separated list.

- **`--p2p-max-inbound-connections <COUNT>`**: Maximum allowed number of inbound connections.

- **`--p2p-discouragement-threshold <THRESHOLD>`**: Peer score threshold after which a peer is discouraged.

- **`--p2p-discouragement-duration <DURATION>`**: Duration (in seconds) for which a peer remains discouraged.

- **`--p2p-outbound-connection-timeout <TIMEOUT>`**: Timeout (in seconds) for outbound connections.

- **`--p2p-ping-check-period <PERIOD>`**: How often to send ping requests to peers (in seconds). Set to `0` to disable.

- **`--p2p-ping-timeout <TIMEOUT>`**: Time (in seconds) after which an unresponsive peer is considered dead and disconnected.

- **`--p2p-sync-stalling-timeout <TIMEOUT>`**: Timeout (in seconds) after which a stalling peer is disconnected.

- **`--p2p-max-clock-diff <DIFF>`**: Maximum acceptable time difference (in seconds) between this node and a remote peer. Peers exceeding this are disconnected.

- **`--max-tip-age <AGE>`**: Maximum tip age in seconds. IBD is considered complete when the difference between the current time and the tip timestamp is below this value.

### RPC

- **`--rpc-bind-address <ADDR>`**: Address to bind the RPC server to.

- **`--rpc-enabled <VAL>`**: Enable or disable HTTP RPC.
  - Possible values: `true`, `false`

- **`--rpc-username <USERNAME>`**: Username for RPC basic authorization. If not set, a cookie file is created automatically.

- **`--rpc-password <PASSWORD>`**: Password for RPC basic authorization. If not set, a cookie file is created automatically.

- **`--rpc-cookie-file <PATH>`**: Custom path for the RPC cookie file. Defaults to the data directory.

### Mempool

- **`--min-tx-relay-fee-rate <VAL>`**: Minimum transaction relay fee rate (in atoms per 1000 bytes).

### Security

- **`--force-allow-run-as-root`**: Allow the node to run as root. **Not recommended.** Running as root is unnecessary and dangerous.

### Node Type

- **`--node-type <NODE_TYPE>`**: The type of node to run.
