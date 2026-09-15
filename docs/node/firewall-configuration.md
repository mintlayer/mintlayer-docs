---
title: "Firewall Configuration"
sidebar_position: 3
---

This page describes which ports the Mintlayer node uses and how to configure your firewall accordingly.

---

## Ports by Network

| Network | P2P Port (TCP) | RPC Port (TCP) |
|---------|---------------|---------------|
| Mainnet | **3031** | 3030 |
| Testnet | **13031** | 13030 |
| Regtest | 23031 | 23030 |
| Signet | 33031 | 33030 |

---

## P2P Port

The P2P port is used for communication with other nodes on the network (block propagation, peer discovery, mempool sync).

**Inbound:** Opening the P2P port to inbound connections is optional but strongly recommended. Nodes that accept inbound connections contribute to network health and improve connectivity for the whole network.

**Outbound:** The node always initiates outbound connections to peers. Outbound P2P traffic must be allowed.

---

## RPC Port

The RPC port is used by local tools (`wallet-cli`, `wallet-rpc-daemon`, `api-blockchain-scanner-daemon`, etc.) to communicate with the node.

**The RPC port should NOT be exposed to the internet.** By default, the RPC server only binds to `127.0.0.1` (localhost). Keep it that way unless you have a specific reason to expose it, and ensure it is protected with authentication (username/password or cookie file).

---

## Recommended Firewall Rules

### Linux (ufw)

For a mainnet node:

```bash
# Allow inbound P2P
sudo ufw allow 3031/tcp

# (Optional) Allow outbound P2P: usually allowed by default
sudo ufw allow out 3031/tcp

# Block inbound RPC from external sources
sudo ufw deny 3030/tcp
```

For a testnet node:

```bash
sudo ufw allow 13031/tcp
sudo ufw deny 13030/tcp
```

### Linux (iptables)

```bash
# Allow inbound P2P (mainnet)
iptables -A INPUT -p tcp --dport 3031 -j ACCEPT

# Block inbound RPC from non-localhost
iptables -A INPUT -p tcp --dport 3030 ! -s 127.0.0.1 -j DROP
```

### macOS (pf)

Add to `/etc/pf.conf`:

```
# Allow inbound P2P (mainnet)
pass in proto tcp from any to any port 3031

# Block inbound RPC
block in proto tcp from any to any port 3030
```

Then reload: `sudo pfctl -f /etc/pf.conf`

---

## Binding Options

You can control which addresses the node listens on via the `--p2p-bind-addresses` and `--rpc-bind-address` options.

**P2P, listen on all interfaces (default for most setups):**
```bash
node-daemon mainnet --p2p-bind-addresses 0.0.0.0:3031
```

**RPC, restrict to localhost only (default and recommended):**
```bash
node-daemon mainnet --rpc-bind-address 127.0.0.1:3030
```

**RPC, disable entirely (if no local tools need it):**
```bash
node-daemon mainnet --rpc-enabled false
```

See the [node-daemon CLI reference](../reference/cli/node-daemon.md) for the full list of options.

---

## Notes

- If you run multiple nodes on the same machine (e.g. mainnet + testnet), make sure each uses a different port or bind address.
- If your node is behind NAT, configure port forwarding for the P2P port so that inbound connections can reach it.
- The RPC port uses cookie-file authentication by default. Never expose it without authentication.
