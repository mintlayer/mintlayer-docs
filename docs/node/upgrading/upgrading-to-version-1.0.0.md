---
title: "Upgrading to v1.0.0"
sidebar_position: 2
---

Welcome to the upgrade guide for Mintlayer Version 1.0.0. This release brings significant improvements, new features, and some breaking changes. Please follow the instructions below to ensure a smooth transition.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step-by-Step Upgrade Instructions](#step-by-step-upgrade-instructions)
   - [1. Download the New Release](#1-download-the-new-release)
   - [2. Stop the Old Node](#2-stop-the-old-node)
   - [3. Replace the Binary](#3-replace-the-binary)
   - [4. Restart the Node](#4-restart-the-node)
3. [Breaking Changes in Version 1](#breaking-changes-in-version-1)
   - [Distribution Packages](#distribution-packages)
   - [Binary Naming Convention](#binary-naming-convention)
   - [RPC Changes](#rpc-changes)
4. [Additional Notes](#additional-notes)

---

## Prerequisites

- **Backup Data**: Before proceeding, ensure you have backed up the wallet and you have stored the mnemonic phrase is a safe location.
- **Administrator Access**: You may need administrator or root access to perform some of these steps.

---

## Step-by-Step Upgrade Instructions

### 1. Download the New Release

Visit the [Mintlayer Download Page](https://mintlayer.org/download) and download the appropriate package for your platform.

- **Node-GUI Users**:
  - **Windows**: Download the Windows installer (`.exe`).
  - **macOS**: Download the macOS installer (`.dmg`).
  - **Linux**: Download the `tar.gz` or `zip` archive.

- **CLI Users**:
  - Available as `tar.gz`/`zip` archives.
  - Linux users can also download:
    - **Debian-based distributions**: `.deb` packages.
    - **Red Hat-based distributions**: `.rpm` packages.

### 2. Stop the Old Node

Before installing the new version, you must stop your running Mintlayer node.

#### For Linux/macOS:

```bash
# If running as a service
sudo systemctl stop mintlayer

# If running manually
pkill node-daemon
```

#### For Windows:

1. Open the Task Manager.
2. Find the `node-daemon` process.
3. Right-click and select **End Task**.

### 3. Replace the Binary

#### For GUI Users:

- **Windows/macOS**: Run the installer you downloaded and follow the on-screen instructions.

#### For CLI Users:

1. **Extract the Package**:

   ```bash
   tar -xzf Mintlayer_Node_linux_1.0.0_aarch64.tar.gz
   ```

2. **Move Binaries to the Desired Location**:

   ```bash
   sudo mv mintlayer_* /usr/local/bin/
   ```

   - **Note**: Binaries are now prefixed with `mintlayer_`. For example, `node-daemon` is now `mintlayer_node-daemon`.

### 4. Restart the Node

#### For Linux/macOS:

```bash
mintlayer_node-daemon
```

#### For Windows:

- Launch the Mintlayer application from the Start Menu or desktop shortcut.

---

## Breaking Changes in Version 1

Version 1 introduces several breaking changes that may affect your existing setup.

### Distribution Packages

- **Node-GUI**:
  - Now available with platform-specific installers:
    - **Windows Installer** (`.exe`)
    - **macOS Installer** (`.dmg`)
  - Also available as `tar.gz`/`zip` archives for all platforms.

- **CLI Packages**:
  - Contain all binaries in a single package.
  - Available as:
    - `tar.gz`/`zip` archives
    - `.deb` packages for Debian-based Linux distributions
    - `.rpm` packages for Red Hat-based Linux distributions

### Binary Naming Convention

- All binaries are now prefixed with `mintlayer_`.
  - **Example**:
    - Previous: `node-daemon`
    - Now: `mintlayer_node-daemon`
- **Action Required**: Update any scripts, shortcuts, or service files to reflect the new binary names.

### RPC Changes

#### Wallet RPC Updates

1. **`account_balance` Function Extended**:

   - **New Argument**: `utxo_states`
   - **Usage**:

     ```json
     "utxo_states": ["Confirmed", "Conflicted", "Inactive", "Abandoned", "InMempool"]
     ```

   - **Default Behavior**: Previously, only the "Confirmed" state was considered.
   - **Note**:
     - `utxo_states` accepts an array of strings.
     - Strings are **case-sensitive**.

2. **Bech32 Encoded Token IDs**:

   - The following functions now return Bech32 encoded token IDs instead of hex-encoded:

     - `account_balance`
     - `transaction_create_from_cold_input`
     - `transaction_inspect`
     - `transaction_compose`
     - `standalone_address_details`

   - **Impact**:
     - Bech32 encoded token IDs can be directly passed to `token_*` functions without conversion.
     - Update any client applications or scripts that parse these return values.

---



For users who prefer using Docker Compose, you can refer to our [Docker Compose Wizard (Beta)](https://docs.mintlayer.org/docker-compose.html). Please note that this feature is still in **beta** and is currently **untested**, so use it with caution.

1. **Pull the Latest Docker Image**:

   ```bash
   docker pull mintlayer/mintlayer:v1.0.0
   ```

   - Alternatively, you can use the `latest` tag:

   ```bash
   docker pull mintlayer/mintlayer:latest
   ```

2. **Stop and Remove the Existing Container**:

   ```bash
   docker stop mintlayer_node
   docker rm mintlayer_node
   ```

3. **Start a New Container with the Updated Image**:

   ```bash
   docker run -d --name mintlayer_node -p 3030:3030 mintlayer/mintlayer:v1.0.0
   ```

   - Adjust any additional flags or environment variables as needed for your setup.

---

## Additional Notes

- **Update Scripts and Integrations**: Ensure all your custom scripts and third-party integrations are updated to accommodate the changes in binary names and RPC outputs.
- **Test Thoroughly**: After upgrading, perform thorough testing to confirm that all functionalities are working as expected.
- **Case Sensitivity**: Remember that the `utxo_states` strings are case-sensitive. Incorrect casing may lead to unexpected results.
