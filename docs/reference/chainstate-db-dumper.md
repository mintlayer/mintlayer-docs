---
title: "Chainstate DB Dumper"
sidebar_position: 1
---

The `chainstate-db-dumper` reads the Mintlayer chainstate LMDB database and exports block information to a CSV file. It is a developer/diagnostic tool.

## Usage

```bash
chainstate-db-dumper --chain-type <CHAIN_TYPE> --output-file <OUTPUT_FILE> [OPTIONS]
```

## Required Options

- **`-c, --chain-type <CHAIN_TYPE>`**: The chain type of the database to read.
  - Possible values: `mainnet`, `testnet`, `regtest`, `signet`

- **`-o, --output-file <OUTPUT_FILE>`**: Path to the output CSV file.

## Optional Options

- **`-d, --db-dir <DB_DIR>`**: Path to the `chainstate-lmdb` directory. Defaults to the standard location for the specified chain type.

- **`--mainchain-only <MAINCHAIN_ONLY>`**: Only dump mainchain blocks (skip orphans).
  - Default: `true`
  - Possible values: `true`, `false`

- **`--from-height <FROM_HEIGHT>`**: Block height to start dumping from.
  - Default: `0`

- **`--fields <FIELDS>`**: Comma-separated list of fields to include in the CSV output.
  - Default (when `--mainchain-only true`): `height,id,timestamp,pool_id,target`
  - Default (when `--mainchain-only false`): `height,is_mainchain,id,timestamp,pool_id,target,parent_id`
  - All possible fields: `height`, `is_mainchain`, `id`, `timestamp`, `pool_id`, `target`, `chain_trust`, `status`, `parent_id`

## Example

```bash
chainstate-db-dumper \
  --chain-type mainnet \
  --output-file /tmp/chainstate.csv \
  --from-height 500000 \
  --fields height,id,timestamp
```
