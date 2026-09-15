---
title: "Mintlayer Binaries"
sidebar_position: 5
---

Binaries for Mintlayer can be downloaded from the following location:

[https://www.mintlayer.org/download/](https://www.mintlayer.org/download/)

## Choosing the Right Architecture

Before downloading, it's essential to choose the correct options for your system. Use the filters on the download page to narrow your selection:

### **Operating System**
- **Linux**: For Linux-based systems.
- **Darwin (Mac)**: For macOS systems.
- **Windows**: For Windows-based systems.

### **Interface**
- **GUI**: Graphical User Interface for most users.
- **CLI**: Command Line Interface for developers or advanced users.

### **Architecture**
- **aarch64**: For 64-bit ARM systems (e.g., ARM-based Linux, Apple M1 and newer).
- **x86_64**: For 64-bit Intel/AMD systems (e.g., Linux, Windows, Intel-based Mac).

### **Package Type**
- **TAR.GZ**: Archive format for Linux systems.
- **DEB**: Debian package for Linux systems.
- **RPM**: Red Hat package for Linux systems.
- **DMG**: Disk image format for macOS systems.
- **ZIP**: Archive format for macOS and Windows systems.
- **EXE**: Executable format for Windows systems.

## Downloading the Binaries

1. Navigate to the [download page](https://www.mintlayer.org/download/).
2. Use the filters to select your **Operating System**, **GUI or CLI**, and **Package Type**.
3. Locate the appropriate architecture and click on the "Download" link.
4. Copy the SHA256 hash provided for the file to verify integrity.

## Verifying the Checksum (Optional but recommended)

Verifying the checksum ensures that the downloaded file is intact, unaltered, and free of corruption or tampering, confirming both its authenticity and integrity for safe and accurate usage.

### On Mac/Linux:

1. Open a terminal.
2. Navigate to the directory where you downloaded the binary.
3. Use the `shasum` command to generate a checksum:

   ```bash
   shasum -a 256 [downloaded_file_name]
   ```

4. Compare the output with the provided SHA256 checksum displayed on the download page. They should match.

### On Windows:

1. Open PowerShell.
2. Navigate to the directory where you downloaded the binary.
3. Use the `Get-FileHash` command to generate a checksum:

   ```powershell
   Get-FileHash -Algorithm SHA256 [downloaded_file_name]
   ```

4. Compare the output with the provided SHA256 checksum displayed on the download page. They should match.

---

By verifying the checksum, you ensure the integrity and authenticity of the downloaded binary.
