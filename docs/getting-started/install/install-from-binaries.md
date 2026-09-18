---
title: "Install from Binaries"
description: "Download pre-built Mintlayer binaries for Linux, macOS, and Windows, including native deb/rpm packages with systemd integration (v1.4.1+)."
sidebar_position: 3
---

# Install from Binaries

Pre-built Mintlayer binaries are available on the official download page:

[https://www.mintlayer.org/download/](https://www.mintlayer.org/download/)

On Linux, from version **1.4.1** the `deb` and `rpm` artifacts are proper native packages with systemd integration; see [Native Linux packages (deb/rpm)](#native-linux-packages-debrpm) below. The `tar.gz` archives remain plain, unstripped binaries for manual installs.

## Choosing the right artifact

Before downloading, choose the correct options for your system using the filters on the download page:

| Filter | Options | |
| ------ | ------- | - |
| **Operating system** | Linux | Linux-based systems |
| | Darwin (Mac) | macOS systems |
| | Windows | Windows systems |
| **Interface** | GUI | Graphical user interface for most users |
| | CLI | Command line only, for developers or servers |
| **Architecture** | aarch64 | 64-bit ARM (e.g. ARM-based Linux, Apple M1 and newer) |
| | x86_64 | 64-bit Intel/AMD (e.g. Linux, Windows, Intel-based Mac) |
| **Package type** | TAR.GZ | Archive for manual installs on any Linux distribution |
| | DEB | Debian package for Debian/Ubuntu and derivatives |
| | RPM | Red Hat package for Fedora/RHEL/openSUSE and derivatives |
| | DMG | Disk image for macOS |
| | ZIP | Archive for macOS and Windows |
| | EXE | Executable installer for Windows |

## Downloading the binaries

1. Navigate to the [download page](https://www.mintlayer.org/download/).
2. Use the filters to select your **operating system**, **GUI or CLI**, and **package type**.
3. Locate the appropriate architecture and click the **Download** link.
4. Copy the SHA256 hash provided for the file to verify its integrity.

## Verifying the checksum (optional but recommended)

Verifying the checksum ensures that the downloaded file is intact and unaltered, confirming both its authenticity and integrity.

### On macOS/Linux

1. Open a terminal.
2. Navigate to the directory where you downloaded the binary.
3. Use the `shasum` command to generate a checksum:

   ```bash
   shasum -a 256 [downloaded_file_name]
   ```

4. Compare the output with the SHA256 checksum displayed on the download page. They should match.

### On Windows

1. Open PowerShell.
2. Navigate to the directory where you downloaded the binary.
3. Use the `Get-FileHash` command to generate a checksum:

   ```powershell
   Get-FileHash -Algorithm SHA256 [downloaded_file_name]
   ```

4. Compare the output with the SHA256 checksum displayed on the download page. They should match.

---

## Native Linux packages (deb/rpm)

:::note[Version requirement]

Native packages with the layout described here are available **from Mintlayer v1.4.1**. Earlier versions shipped bare binaries inside the `deb`/`rpm` artifacts: no systemd units, no system user, and no configuration files.

:::

From v1.4.1, the Linux `deb` and `rpm` artifacts are proper distribution packages. Two packages are produced:

| Package | Contents |
| ------- | -------- |
| `mintlayer-node` | `node-daemon`, `wallet-rpc-daemon`, `api-web-server`, `api-blockchain-scanner-daemon`, `dns-server`, `wallet-cli`, `wallet-address-generator`, plus systemd units, a `mintlayer` system user, Ledger/Trezor udev rules, man pages, and config files under `/etc/mintlayer` |
| `mintlayer-node-gui` | The GUI binary with hicolor icons, a desktop entry, and a man page |

### What gets installed

Executables are installed under `/usr/bin` with a `mintlayer-` prefix so they never clash with other software:

| Executable | Purpose |
| ---------- | ------- |
| `/usr/bin/mintlayer-node-daemon` | Node daemon |
| `/usr/bin/mintlayer-wallet-rpc-daemon` | Headless wallet with a JSON-RPC interface |
| `/usr/bin/mintlayer-wallet-cli` | Interactive wallet CLI |
| `/usr/bin/mintlayer-wallet-address-generator` | Address generator utility |
| `/usr/bin/mintlayer-api-web-server` | Indexer REST API server |
| `/usr/bin/mintlayer-api-blockchain-scanner-daemon` | Indexer scanner daemon |
| `/usr/bin/mintlayer-dns-server` | DNS seed server |
| `/usr/bin/mintlayer-node-gui` | GUI application (separate `mintlayer-node-gui` package) |

Note the prefix: to run the wallet CLI manually, use `mintlayer-wallet-cli` instead of `wallet-cli`. The package binaries are stripped; the `tar.gz` archives keep the original, unstripped binary names.

The packages also set up:

- **System user**: a dedicated `mintlayer` system user (via `sysusers.d`). Its home directory `/var/lib/mintlayer` holds chain state and wallet files.
- **Configuration files**: environment templates under `/etc/mintlayer/<chain>/` (`node.env`, `wallet-rpc.env`, `api-web-server.env`, `api-blockchain-scanner.env`, `dns-server.env`), flagged as `conffiles` so your edits are preserved on upgrade.
- **Hardware-wallet udev rules**: `51-mintlayer.rules` grants Ledger and Trezor devices hidraw access via `uaccess`, used by `wallet-cli` (and the GUI).
- **Man pages**: for every installed executable (`man mintlayer-node-daemon`, etc.).
- **Declared dependencies**: shared-library dependencies are computed at build time (deb via `dpkg-shlibdeps`, rpm via soname autorequires), so clean installs get everything they need.

### systemd services

Each daemon ships as a hardened systemd **template unit**, one instance per chain, and logs to the journal:

| Unit | Driven by |
| ---- | --------- |
| `mintlayer-node@<chain>.service` | Runs `mintlayer-node-daemon --datadir /var/lib/mintlayer/<chain> <chain>` as the `mintlayer` user; optional env file `/etc/mintlayer/<chain>/node.env` |
| `mintlayer-wallet-rpc@<chain>.service` | `ARGS` from `/etc/mintlayer/<chain>/wallet-rpc.env` |
| `mintlayer-api-web-server@<chain>.service` | `ARGS` from `/etc/mintlayer/<chain>/api-web-server.env` |
| `mintlayer-api-blockchain-scanner@<chain>.service` | `ARGS` from `/etc/mintlayer/<chain>/api-blockchain-scanner.env` |
| `mintlayer-dns-server@<chain>.service` | `ARGS` from `/etc/mintlayer/<chain>/dns-server.env` |

All units run as the `mintlayer` system user with hardening enabled (`ProtectSystem=strict`, `NoNewPrivileges`, and friends). The `wallet-rpc` unit needs at least the path to a wallet file in its `ARGS`; `/var/lib/mintlayer/<chain>` is the recommended location, so the `mintlayer` user can read it.

**Preset policy**: only `mintlayer-node@mainnet.service` is enabled automatically on install. Everything else is opt-in and must be enabled explicitly by the administrator.

### Installing

Download the package for your distribution and architecture (both `x86_64`/amd64 and `aarch64`/arm64 are available for `deb` and `rpm`), then install it with the package manager:

**Debian / Ubuntu**

```bash
sudo apt install ./Mintlayer_Node_linux_<version>_<arch>.deb
```

**Fedora / RHEL**

```bash
sudo dnf install ./Mintlayer_Node_linux_<version>_<arch>.rpm
```

Installing `mintlayer-node` creates the system user, enables `mintlayer-node@mainnet.service`, and starts the mainnet node. Watch it sync with:

```bash
systemctl status mintlayer-node@mainnet.service
journalctl -u mintlayer-node@mainnet.service -f
```

To run a daemon on **testnet** instead (or in addition), instantiate the template unit with the chain name:

```bash
sudo systemctl enable --now mintlayer-node@testnet.service
```

### Managing services

| Task | Command |
| ---- | ------- |
| Check node status | `systemctl status mintlayer-node@mainnet.service` |
| Follow node logs | `journalctl -u mintlayer-node@mainnet.service -f` |
| Enable a daemon at boot | `sudo systemctl enable mintlayer-node@mainnet.service` |
| Start a daemon now | `sudo systemctl start mintlayer-node@mainnet.service` |
| Stop a daemon | `sudo systemctl stop mintlayer-node@mainnet.service` |
| Restart after config change | `sudo systemctl restart mintlayer-node@mainnet.service` |

Daemon-specific command-line options go into the corresponding env file under `/etc/mintlayer/<chain>/` (for the node, as documented in the file itself; for the other daemons, via the `ARGS` variable). Apply changes with `systemctl restart`.

### Filesystem layout

| Path | Contents |
| ---- | -------- |
| `/usr/bin/mintlayer-*` | Executables |
| `/etc/mintlayer/<chain>/` | Per-chain configuration files (preserved on upgrade) |
| `/var/lib/mintlayer/<chain>/` | Chain state: blockchain storage, P2P state, wallet files |
| `/usr/lib/systemd/system/mintlayer-*.service` | systemd template units |
| `/usr/lib/sysusers.d/`, `/usr/lib/udev/rules.d/` | System user and hardware-wallet rules |

### Upgrading and removal

Upgrades are handled by the package manager (`sudo apt install ./…` or `sudo dnf install ./…`): configuration under `/etc/mintlayer` is preserved, and the running services are restarted.

To remove the packages:

```bash
sudo apt remove mintlayer-node mintlayer-node-gui   # Debian/Ubuntu
sudo dnf remove mintlayer-node mintlayer-node-gui   # Fedora/RHEL
```

Removing the package does not delete chain state; remove `/var/lib/mintlayer` manually if you no longer need it.
