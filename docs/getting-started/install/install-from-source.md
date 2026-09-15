---
title: "Install from source"
sidebar_position: 3
---

Installing Mintlayer from source allows you to access the latest features and updates directly from the repository. Follow the steps below to compile and install Mintlayer from source.

## Prerequisites

- Ensure you have `git` installed on your system.
- Ensure you have `Rust` and `Cargo` installed. If not, you can install them via [Rustup](https://rustup.rs/).

## Steps for Linux/Osx

1. **Setup the Repository**

   First, clone the Mintlayer repository to your local machine:

   ```bash
   git clone https://github.com/mintlayer/mintlayer-core.git
   ```

   **Navigate to the Directory**

   Change your current directory to the cloned repository:

   ```bash
   cd mintlayer-core
   ```

   **Prepare your system (for ubuntu/debian)**

   Ensure some required packages are properly installed in your system:

   ```bash
   sudo apt install build-essential libglib2.0-dev libatk1.0-dev
   ```

   **Checkout the latest tag (optional)**

   We use tags to mark stable releases. If you prefer to encounter fewer issues, consider checking out the most recent tag. 
   To view the list of tags, use:

   ```
   git show-ref --tags
   ```

   This command will display all the tags, for example:

   ```
   9ecfeff0101bb37410d01f709107a08e4c32db93 refs/tags/v0.1.0
   f7c7d310d3d3b7f8ab33cc062ba56f76b05d81c0 refs/tags/v0.1.1   
   ```

   To switch to the latest one, use:

   ```
   git checkout tags/v0.1.3
   ```


2. **Compile the Source**

   Use Cargo to compile the source files, specify the `node-daemon` and the `wallet-cli` binaries:

   ```bash
   cargo build --bin node-daemon --bin wallet-cli
   ```

   NOTE: in order to optimize the process for production release you can add the `--release` option.


3. **Run Mintlayer Node**

   After successful compilation, you can run Mintlayer:

   ```bash
   ./target/release/node-daemon
   ```

4. **Open a new terminal and run the Wallet**

   ```bash
    cd mintlayer-core
   ./target/release/wallet-cli
   ```


NOTES: The `node-daemon` is not particularly verbose. If you wish to see more detailed logs of what the node is doing, you can increase the log level. Use the `RUST_LOG=info` environment variable for this purpose.

NOTES: When building from sources, the most recent version on Git requires Rust 1.72. If you installed Rust via rustup, running `rustup update` is sufficient to address this.

## Conclusion

You've now successfully installed Mintlayer from source. For more configurations and advanced usage, refer to the official Mintlayer documentation.
