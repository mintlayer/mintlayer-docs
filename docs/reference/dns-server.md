---
title: "DNS Server"
sidebar_position: 2
---

The `dns-server` is a DNS seed server that helps new nodes discover peers on the Mintlayer network. It crawls the network and publishes reachable node addresses via DNS.

This tool is intended for infrastructure operators running DNS seed nodes, not for regular users.

## Usage

```bash
dns-server --host <HOST> [OPTIONS]
```

## Options

- **`--host <HOST>`** *(required)*: Hostname of the DNS seed (e.g. `seed.mintlayer.org`).
  - Env: `ML_DNS_SRV_HOST`

- **`--network <NETWORK>`**: The network to crawl.
  - Env: `ML_DNS_SRV_NETWORK`
  - Default: `mainnet`
  - Possible values: `mainnet`, `testnet`

- **`--bind-addr <BIND_ADDR>`**: UDP socket addresses to listen on. Can be specified multiple times or as a comma-separated list.
  - Env: `ML_DNS_SRV_BIND_ADDR`
  - Default: `[::]:53`

- **`--datadir <DATADIR>`**: Path to the data directory.
  - Env: `ML_DNS_SRV_DATADIR`

- **`--reserved-nodes <RESERVED_NODES>`**: Node addresses to always connect to. Can be specified multiple times or as a comma-separated list.
  - Env: `ML_DNS_SRV_RESERVED_NODES`

- **`--nameserver <NAMESERVER>`**: Hostname of the nameserver. If set, an NS record is added to DNS responses.
  - Env: `ML_DNS_SRV_NAMESERVER`

- **`--mbox <MBOX>`**: Email address reported in SOA records. Replace `@` with `.` (e.g. `admin.example.com`). If set, a SOA record is added.
  - Env: `ML_DNS_SRV_MBOX`

- **`--min-same-software-version-nodes-ratio <PER_THOUSAND>`**: Minimum ratio (in per-thousand) of published addresses that must be running the same software version as the DNS server. Helps prioritize up-to-date nodes.
  - Env: `ML_DNS_SRV_MIN_SAME_SOFTWARE_VERSION_NODES_RATIO`
  - Default: `95%`

- **`--force-allow-run-as-root`**: Allow running as root. **Not recommended.** Running as root is unnecessary and dangerous.
  - Env: `ML_DNS_SRV_FORCE_ALLOW_RUN_AS_ROOT`
