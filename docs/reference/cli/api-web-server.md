---
title: "api-web-server"
sidebar_position: 1
---

The `api-web-server` provides an HTTP REST API for querying blockchain data. It reads from a PostgreSQL database populated by the [API Blockchain Scanner](api-blockchain-scanner-daemon.md).

## Usage

```bash
api-web-server [OPTIONS]
```

## Options

### Network

- **`--network <NETWORK>`**: The network to serve.
  - Env: `ML_API_WEB_SRV_NETWORK`
  - Default: `mainnet`
  - Possible values: `mainnet`, `testnet`, `regtest`, `signet`

### HTTP Server

- **`--bind-address <BIND_ADDRESS>`**: Address and port to listen on for HTTP API requests.
  - Env: `ML_API_WEB_SRV_BIND_ADDRESS`
  - Format: `<ip>:<port>`
  - Default: `127.0.0.1:3000`

- **`--enable-post-routes`**: Enable POST routes (disabled by default).
  - Env: `ML_API_WEB_SRV_ENABLE_POST_ROUTES`

### PostgreSQL Database

The `api-web-server` reads blockchain data from a PostgreSQL database. Use the same database that the `api-blockchain-scanner-daemon` writes to.

- **`--postgres-host <POSTGRES_HOST>`**: PostgreSQL host.
  - Env: `ML_API_WEB_SRV_POSTGRES_HOST`
  - Default: `localhost`

- **`--postgres-port <POSTGRES_PORT>`**: PostgreSQL port.
  - Env: `ML_API_WEB_SRV_POSTGRES_PORT`
  - Default: `5432`

- **`--postgres-user <POSTGRES_USER>`**: PostgreSQL user.
  - Env: `ML_API_WEB_SRV_POSTGRES_USER`
  - Default: `postgres`

- **`--postgres-password <POSTGRES_PASSWORD>`**: PostgreSQL password.
  - Env: `ML_API_WEB_SRV_POSTGRES_PASSWORD`

- **`--postgres-database <POSTGRES_DATABASE>`**: PostgreSQL database name.
  - Env: `ML_API_WEB_SRV_POSTGRES_DATABASE`

- **`--postgres-max-connections <POSTGRES_MAX_CONNECTIONS>`**: Maximum number of connections in the connection pool.
  - Env: `ML_API_WEB_SRV_POSTGRES_MAX_CONNECTIONS`
  - Default: `10`

### Node RPC Connection

- **`--node-rpc-address <NODE_RPC_ADDRESS>`**: RPC address of the Mintlayer node.
  - Env: `ML_API_WEB_SRV_NODE_RPC_ADDRESS`

- **`--node-rpc-cookie-file <NODE_RPC_COOKIE_FILE>`**: Node RPC cookie file. Defaults to the standard location.
  - Env: `ML_API_WEB_SRV_NODE_RPC_COOKIE_FILE`

- **`--node-rpc-username <NODE_RPC_USERNAME>`**: Node RPC username. Use either username/password or a cookie file, not both.
  - Env: `ML_API_WEB_SRV_NODE_RPC_USERNAME`

- **`--node-rpc-password <NODE_RPC_PASSWORD>`**: Node RPC password.
  - Env: `ML_API_WEB_SRV_NODE_RPC_PASSWORD`

## Related

- [API Blockchain Scanner](api-blockchain-scanner-daemon.md), populates the PostgreSQL database read by this server.
