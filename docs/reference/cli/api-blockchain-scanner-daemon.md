---
title: "api-blockchain-scanner-daemon"
sidebar_position: 2
---

The `api-blockchain-scanner-daemon` connects to a Mintlayer node and continuously scans the blockchain, indexing data into a PostgreSQL database. This database is then served by the [API Web Server](api-web-server.md).

## Usage

```bash
api-blockchain-scanner-daemon [OPTIONS]
```

## Options

### Network

- **`--network <NETWORK>`**: The network to scan.
  - Env: `ML_API_SCANNER_DAEMON_NETWORK`
  - Default: `mainnet`
  - Possible values: `mainnet`, `testnet`, `regtest`, `signet`

### Node RPC Connection

- **`--node-rpc-address <NODE_RPC_ADDRESS>`**: RPC address of the Mintlayer node to connect to.
  - Env: `ML_API_SCANNER_DAEMON_NODE_RPC_ADDRESS`

- **`--node-rpc-cookie-file <NODE_RPC_COOKIE_FILE>`**: Node RPC cookie file. Defaults to the standard location.
  - Env: `ML_API_SCANNER_DAEMON_NODE_RPC_COOKIE_FILE`

- **`--node-rpc-username <NODE_RPC_USERNAME>`**: Node RPC username. Use either username/password or a cookie file, not both.
  - Env: `ML_API_SCANNER_DAEMON_NODE_RPC_USERNAME`

- **`--node-rpc-password <NODE_RPC_PASSWORD>`**: Node RPC password.
  - Env: `ML_API_SCANNER_DAEMON_NODE_RPC_PASSWORD`

### PostgreSQL Database

- **`--postgres-host <POSTGRES_HOST>`**: PostgreSQL host.
  - Env: `ML_API_SCANNER_DAEMON_POSTGRES_HOST`
  - Default: `localhost`

- **`--postgres-port <POSTGRES_PORT>`**: PostgreSQL port.
  - Env: `ML_API_SCANNER_DAEMON_POSTGRES_PORT`
  - Default: `5432`

- **`--postgres-user <POSTGRES_USER>`**: PostgreSQL user.
  - Env: `ML_API_SCANNER_DAEMON_POSTGRES_USER`
  - Default: `postgres`

- **`--postgres-password <POSTGRES_PASSWORD>`**: PostgreSQL password.
  - Env: `ML_API_SCANNER_DAEMON_POSTGRES_PASSWORD`

- **`--postgres-database <POSTGRES_DATABASE>`**: PostgreSQL database name.
  - Env: `ML_API_SCANNER_DAEMON_POSTGRES_DATABASE`

- **`--postgres-max-connections <POSTGRES_MAX_CONNECTIONS>`**: Maximum number of connections in the connection pool.
  - Env: `ML_API_SCANNER_DAEMON_POSTGRES_MAX_CONNECTIONS`
  - Default: `10`

## Related

- [API Web Server](api-web-server.md), serves HTTP API requests using the data indexed by this scanner.
