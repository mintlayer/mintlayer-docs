# Trezor Firmware

:::info  No GUI (yet)

This firmware and build process is fully CLI-based.  
There is currently **no graphical interface** for managing the Mintlayer Trezor firmware.

A GUI is in development, but **not yet available**.

:::

:::warning ️ Risk of Device Damage

The steps below are intended for advanced users. Flashing unofficial firmware **may permanently damage your Trezor device** or void its warranty.

Only proceed if you fully understand each step and accept the risks. Do **not** run these commands on a production or primary hardware wallet unless you are absolutely sure of what you are doing.

:::

## Building Mintlayer Trezor Firmware

Ubuntu 24.04 is the recommended environment for building the Mintlayer Trezor firmware. The following steps will guide you through the process of setting up your environment and building the firmware.

```bash
sudo apt update  # Update package lists to get the latest available versions

sudo apt install git  # Install Git for cloning repositories

git clone --recurse-submodules https://github.com/mintlayer/mintlayer-trezor-firmware.git  # Clone the firmware repo including its submodules

cd mintlayer-trezor-firmware  # Change directory to the cloned firmware project

git checkout mintlayer-master  # Switch to the Mintlayer-specific firmware branch

curl -sSL https://install.python-poetry.org | python3 -  # Install Poetry, a dependency manager for Python

poetry install  # Install Python dependencies listed in pyproject.toml

curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh  # Install Rust toolchain via rustup

rustup default nightly  # Set the nightly version of Rust as the default toolchain

rustup component add rust-src --toolchain nightly-x86_64-unknown-linux-gnu  # Add Rust toolchain

sudo apt install -y build-essential  # Install essential tools for building software (e.g., gcc, make)

sudo apt install -y python3.12-dev libffi-dev  # Install Python 3.12 development headers and foreign function interface libraries

sudo apt install -y gcc-arm-none-eabi binutils-arm-none-eabi libnewlib-arm-none-eabi  # Install cross-compilation toolchain for ARM (used by Trezor)

sudo apt install -y protobuf-compiler  # Install the Protocol Buffers compiler (used in serialization)

sudo apt install -y clang llvm-dev libclang-dev  # Install LLVM/Clang compiler and development libraries

cd core  # Move into the `core` directory of the firmware source

source $(poetry env info --path)/bin/activate  # Activate the virtual environment created by Poetry

TREZOR_MODEL=T3T1 make vendor build_firmware  # Set the target Trezor model and build the firmware with required vendor files
```

## Pre-requisites

Device bootloader must be unlocked to allow unofficial firmware installation. This can be done by following the instructions in the [Trezor documentation](https://trezor.io/learn/security-privacy/unlocking-the-bootloader-on-trezor-safe-devices).
