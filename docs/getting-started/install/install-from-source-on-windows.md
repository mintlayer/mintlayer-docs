---
title: "Install from source on Windows"
sidebar_position: 6
---

Installing Mintlayer from source allows you to access the latest features and updates directly from the repository. Follow the steps below to compile and install Mintlayer from source on Windows.

## Prerequisites

- Ensure you have `git` installed on your system. You can download it from [Git for Windows](https://gitforwindows.org/).
- Ensure you have `Rust` and `Cargo` installed. If not, you can install them via [Rustup](https://rustup.rs/).

## Steps for Windows

1. **Clone the Repository**

   First, open the Command Prompt or PowerShell and clone the Mintlayer repository to your local machine:

   ```bash
   git clone http://git.mintlayer.org/mintlayer/mintlayer-core.git
   ```

2. **Navigate to the Directory**

   Change your current directory to the cloned repository:

   ```bash
   cd mintlayer-core
   ```

3. **Compile the Source**

   Use Cargo to compile the source files:

   ```bash
   cargo build --release
   ```

   NOTE: By using the `--release` flag, you are building the binaries optimized for production 
   release. Alternatively, you can omit this flag for a faster build.

4. **Run Mintlayer Node**

   After successful compilation, you can run Mintlayer:

   ```bash
   .\target\release\node-daemon.exe
   ```

5. **Open a new Command Prompt or PowerShell window and run the Wallet**

   Navigate to the repository directory and run:

   ```bash
   cd mintlayer-core
   .\target\release\wallet-cli.exe
   ```

## Conclusion

You've now successfully installed Mintlayer from source on Windows. For more configurations and advanced usage, refer to the official Mintlayer documentation.
