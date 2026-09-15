---
title: "Install from docker"
sidebar_position: 4
---

This guide will cover how to use Docker to deploy and run the Mintlayer `node-daemon` and `wallet-cli`.

## Prerequisites

You need to have Docker installed on your system. For a Docker installation guide, please visit [the official Docker documentation](https://docs.docker.com/get-docker/).

## Mintlayer Deployment Using Docker Compose

Below is a simplified `docker-compose.yml` configuration to deploy the `node-daemon` and `wallet-cli` services:

```yaml
x-common: &common
  volumes:
    - "./mintlayer-data:/home/mintlayer"

x-common-env: &common-env
  ML_USER_ID: "1000"
  ML_GROUP_ID: "1000"

services:
  node-daemon:
    <<: *common
    image: "mintlayer/node-daemon:latest"
    command: "node-daemon mainnet"
    environment:
      <<: *common-env
      RUST_LOG: "info"
      ML_MAINNET_NODE_RPC_BIND_ADDRESS: "0.0.0.0:3030"

  wallet-cli:
    <<: *common
    image: "mintlayer/wallet-cli:latest"
    command: "wallet-cli mainnet"
    depends_on:
      - "node-daemon"
    environment:
      <<: *common-env
      ML_MAINNET_WALLET_NODE_RPC_ADDRESS: node-daemon:3030
    profiles:
      - "wallet_cli"
```

### Running the node

1. Save the above content as `docker-compose.yml` in your working directory.
2. To start the node run:
   ```bash
   docker compose up -d
   ```

### Note

The `./mintlayer-data` directory will store persistent data for all services.

It's also the place where you will put your wallet file, so that it can be opened by the wallet executable.
E.g. assuming that `./mintlayer-data/my_wallet` is the path to your wallet on the host filesystem, you can refer
to it as `/home/mintlayer/my_wallet` inside the Docker containers.

Ensure the directory exists and is writable by Docker.

### Accessing the Wallet-CLI

To enter the Wallet-CLI container and interact with it in an interactive session, run:

```bash
docker compose run --rm wallet-cli
```

If you want a wallet file to be opened immediately upon Wallet-CLI's start, you can invoke it like this:

```bash
docker compose run --rm wallet-cli wallet-cli mainnet --wallet-file /home/mintlayer/my_wallet
```
Note that `wallet-cli` is repeated twice here, the first occurrence is the name of the docker-compose service and the second one is the name of the executable inside the container.

Alternatively, you can modify `docker-compose.yml` changing
```
command: "wallet-cli mainnet"
```
to
```
command: "wallet-cli mainnet --wallet-file /home/mintlayer/my_wallet"
```

### Staking

Staking is performed by the wallet executable, so in the above scenario, where the wallet is managed by the Wallet-CLI, you'll have to either keep the terminal always open or use a terminal multiplexer, like tmux.

The alternative approach is to manage the wallet via the Wallet RPC Daemon and use the Wallet-CLI only as a client for the daemon.

Below is a `docker-compose.yml` configuration to deploy the `node-daemon`, `wallet-rpc-daemon` and `wallet-cli` services in such a manner:

```yaml
x-common: &common
  volumes:
    - "./mintlayer-data:/home/mintlayer"

x-common-env: &common-env
  ML_USER_ID: "1000"
  ML_GROUP_ID: "1000"

services:
  node-daemon:
    <<: *common
    image: "mintlayer/node-daemon:latest"
    command: "node-daemon mainnet"
    environment:
      <<: *common-env
      RUST_LOG: "info"
      ML_MAINNET_NODE_RPC_BIND_ADDRESS: "0.0.0.0:3030"

  wallet-rpc-daemon:
    <<: *common
    image: "mintlayer/wallet-rpc-daemon:latest"
    command: "wallet-rpc-daemon mainnet --wallet-file /home/mintlayer/my_wallet"
    depends_on:
      - "node-daemon"
    environment:
      <<: *common-env
      RUST_LOG: "info"
      ML_MAINNET_WALLET_RPC_DAEMON_NODE_RPC_ADDRESS: "node-daemon:3030"
      ML_MAINNET_WALLET_RPC_DAEMON_RPC_BIND_ADDRESS: "0.0.0.0:3034"
      ML_MAINNET_WALLET_RPC_DAEMON_RPC_USERNAME: "wallet_rpc_user"
      ML_MAINNET_WALLET_RPC_DAEMON_RPC_PASSWORD: "wallet_rpc_password"
    # Note: this port mapping is only needed it you want to access the Wallet RPC Daemon from the host machine,
    # e.g. to query its status (like in the `curl` example below). If you don't need this, the port mapping will
    # be redundant and it's better to remove it.
    ports:
      - "3034:3034"

  wallet-cli:
    <<: *common
    image: "mintlayer/wallet-cli:latest"
    command: "wallet-cli"
    depends_on:
      - "wallet-rpc-daemon"
    environment:
      <<: *common-env
      ML_WALLET_REMOTE_RPC_WALLET_ADDRESS: "wallet-rpc-daemon:3034"
      ML_WALLET_REMOTE_RPC_WALLET_USERNAME: "wallet_rpc_user"
      ML_WALLET_REMOTE_RPC_WALLET_PASSWORD: "wallet_rpc_password"
    profiles:
      - "wallet_cli"
```

Note that in this example we already pass `--wallet-file /home/mintlayer/my_wallet` to the Wallet RPC Daemon, so the wallet will be opened automatically on start.

Like in the previous section, run
```
docker compose up -d
```
to start the services and
```bash
docker compose run --rm wallet-cli
```
to open an interactive shell for the Wallet-CLI. This time though you can initiate staking in the Wallet-CLI, exit it and the wallet will still be staking in the background.

You can also configure the Wallet RPC Daemon to begin staking automatically upon start by using the `--start-staking-for-account` option. For this, modify `docker-compose.yml` changing
```
command: "wallet-rpc-daemon mainnet --wallet-file /home/mintlayer/my_wallet"
```
to
```
command: "wallet-rpc-daemon mainnet --wallet-file /home/mintlayer/my_wallet --start-staking-for-account 0"
```
This will start staking for the wallet account #0.

Note however that staking requires the node and the wallet to be in sync. **If `--start-staking-for-account` is specified and the node is not in sync with the wallet when the Wallet RPC Daemon starts, it will fail and exit immediately.** In particular, this may happen if you are re-syncing the node from scratch. So, it's better to check that staking has actually began when starting the services this way.

You can check whether the Wallet RPC Daemon is currently staking by running:
```
curl \
    -H 'Content-Type: application/json' \
    -H "Authorization: Basic $(echo -n wallet_rpc_user:wallet_rpc_password | base64)" \
    -d '{"jsonrpc": "2.0", "id": 1, "method": "staking_status", "params": {"account": 0}}' localhost:3034
```
If staking is in progress, it will respond with something like `{"jsonrpc":"2.0","result":"Staking","id":1}`.\
If the Wallet RPC Daemon is running but not staking at the moment, it will respond with `{"jsonrpc":"2.0","result":"NotStaking","id":1}`.\
If the Wallet RPC Daemon is not running, the command will fail with an error.

**Reminder**: "wallet_rpc_user" and "wallet_rpc_password" are just example values; while the username doesn't matter much, you should definitely replace "wallet_rpc_password" with a stronger password.

**Note**: Docker will not pull an image from the repository automatically if it already exists locally. So, for example, if you pulled `mintlayer/node-daemon:latest` manually in the past, you may end up using an older version of `node-daemon` with a newer version of `wallet-cli`, which will not work correctly. In such a case run `docker compose pull` to make sure that the images tagged as `latest` actually refer to the latest version.

## Running the API Server Stack

If you want to query blockchain data locally, you can run the [API web server](../../reference/cli/api-web-server.md) together with the [blockchain scanner](../../reference/cli/api-blockchain-scanner-daemon.md) and a PostgreSQL database. A full node must be running and in sync, since the scanner indexes the chain through its RPC interface.

Below is a `docker-compose.yml` configuration for the complete stack:

```yaml
x-common: &common
  volumes:
    - "./mintlayer-data:/home/mintlayer"

services:
  node-daemon:
    <<: *common
    image: "mintlayer/node-daemon:latest"
    command: "node-daemon mainnet"
    environment:
      RUST_LOG: "info"
      ML_USER_ID: "1000"
      ML_GROUP_ID: "1000"
      ML_MAINNET_NODE_RPC_BIND_ADDRESS: "0.0.0.0:3030"
      ML_MAINNET_NODE_RPC_USERNAME: "node_rpc_user"
      ML_MAINNET_NODE_RPC_PASSWORD: "node_rpc_password"

  api-postgres-db:
    image: "postgres:16"
    restart: "always"
    environment:
      POSTGRES_USER: "api_user"
      POSTGRES_PASSWORD: "api_password"
      POSTGRES_DB: "mintlayer_api"
    ports:
      # Only needed to inspect the database from the host machine (e.g. via PgAdmin).
      - "127.0.0.1:5432:5432"
    volumes:
      - "api_postgres_db:/var/lib/postgresql/data"

  api-blockchain-scanner-daemon:
    <<: *common
    image: "mintlayer/api-blockchain-scanner-daemon:latest"
    command: "api-blockchain-scanner-daemon"
    depends_on:
      - "api-postgres-db"
      - "node-daemon"
    environment:
      RUST_LOG: "info"
      ML_USER_ID: "1000"
      ML_GROUP_ID: "1000"
      ML_API_SCANNER_DAEMON_NETWORK: "mainnet"
      ML_API_SCANNER_DAEMON_POSTGRES_HOST: "api-postgres-db"
      ML_API_SCANNER_DAEMON_POSTGRES_USER: "api_user"
      ML_API_SCANNER_DAEMON_POSTGRES_PASSWORD: "api_password"
      ML_API_SCANNER_DAEMON_POSTGRES_DATABASE: "mintlayer_api"
      ML_API_SCANNER_DAEMON_NODE_RPC_ADDRESS: "node-daemon:3030"
      ML_API_SCANNER_DAEMON_NODE_RPC_USERNAME: "node_rpc_user"
      ML_API_SCANNER_DAEMON_NODE_RPC_PASSWORD: "node_rpc_password"

  api-web-server:
    <<: *common
    image: "mintlayer/api-web-server:latest"
    command: "api-web-server"
    depends_on:
      - "api-postgres-db"
      - "api-blockchain-scanner-daemon"
      - "node-daemon"
    environment:
      RUST_LOG: "info"
      ML_USER_ID: "1000"
      ML_GROUP_ID: "1000"
      ML_API_WEB_SRV_NETWORK: "mainnet"
      ML_API_WEB_SRV_BIND_ADDRESS: "0.0.0.0:3000"
      ML_API_WEB_SRV_POSTGRES_HOST: "api-postgres-db"
      ML_API_WEB_SRV_POSTGRES_USER: "api_user"
      ML_API_WEB_SRV_POSTGRES_PASSWORD: "api_password"
      ML_API_WEB_SRV_POSTGRES_DATABASE: "mintlayer_api"
      ML_API_WEB_SRV_NODE_RPC_ADDRESS: "node-daemon:3030"
      ML_API_WEB_SRV_NODE_RPC_USERNAME: "node_rpc_user"
      ML_API_WEB_SRV_NODE_RPC_PASSWORD: "node_rpc_password"
    ports:
      - "3000:3000"

volumes:
  api_postgres_db:
```

Start the stack with `docker compose up -d`. The API web server then answers on `http://localhost:3000`, e.g.:

```bash
curl http://localhost:3000/api/v2/chain/tip
```

As always, replace the example usernames and passwords with your own values. A more elaborate version of this configuration (including environment variable indirection and DNS server services) is available in the [mintlayer-core repository](https://github.com/mintlayer/mintlayer-core/tree/master/build-tools/docker/example-mainnet).

## Running on Testnet

All examples above target mainnet. To run against **testnet** instead, change the `command` of each service from `mainnet` to `testnet` and rename every `ML_MAINNET_*` environment variable to `ML_TESTNET_*`. For example, for the node:

```yaml
services:
  node-daemon:
    image: "mintlayer/node-daemon:latest"
    command: "node-daemon testnet"
    environment:
      ML_TESTNET_NODE_RPC_BIND_ADDRESS: "0.0.0.0:3030"
```

Note that testnet uses different default ports for the node's P2P interface, so adjust any port mappings accordingly. Testnet also requires far less disk space than mainnet.
