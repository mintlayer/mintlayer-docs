---
title: Getting Started
sidebar_label: Introduction
---

# Getting Started with `window.mojito`

The Mojito Wallet browser extension injects a global object `window.mojito` into every page. This object acts as a lightweight interface between your decentralized app (dApp) and the Mojito wallet, allowing you to request access, send transactions, and react to wallet state changes.

## Version Support

Mojito inject API is available in extension versions 1.4.0 and above.

```ts
const version = await window.mojito.version;
console.log('Mojito version:', version);
// should be 1.4.0 or higher
```

Check for a proper version
```ts
if (!window.mojito) {
  alert("Please install or update Mojito Wallet to version 1.4.0 or higher.");
}
```

## Features

- Connect to the user's Mojito wallet with approval
- Restore existing sessions automatically
- Sign transactions via user approval
- Check if a wallet is connected
- Subscribe to wallet events

## Installation

No additional installation is required. If the user has the Mojito browser extension installed and enabled, the `window.mojito` object will be available on page load.

You can check for the presence of the wallet with:

```ts
if (window.mojito?.isExtension) {
  console.log("Mojito wallet is available.");
}
```

## API Reference

### mojito.isExtension

`mojito.isExtension: boolean`

Indicates whether the Mojito wallet extension is installed and enabled.

```ts
if (window.mojito?.isExtension) {
  console.log("Mojito wallet is available.");
} else {
  console.log("Please install Mojito Wallet.");
}
```

### mojito.version

`mojito.version: string`

Returns the version of the Mojito wallet extension.

```ts
const version = await window.mojito.version;
console.log("Mojito version:", version);
// should be 1.4.0 or higher
```

### mojito.connectedAddresses
`mojito.connectedAddresses: Addresses | null`

Returns the currently connected addresses. If no session is active, it returns `null`.

```ts
const addresses = window.mojito.connectedAddresses;
if (addresses) {
  console.log("Connected addresses:", addresses.testnet.receiving);
} else {
  console.log("No active session.");
}
```

### mojito.connect()
`mojito.connect(): Promise<Addresses>`

Prompts the user to approve wallet connection.

```ts
const addresses = await window.mojito.connect();
console.log("Connected addresses:", addresses.testnet.receiving);
```

### mojito.restore()
`mojito.restore(): Promise<Addresses | null>`

Attempts to restore a previously approved session without user interaction.

```ts
const restored = await window.mojito.restore();
if (restored) {
  console.log("Session restored", restored);
}
```

You can skip restore by passing a flag to your SDK client if you want manual connection only.

### mojito.disconnect()
`mojito.disconnect(): void`

Clears the current session and notifies your dApp via an event.

```ts
window.mojito.disconnect();
```

### mojito.request()
`mojito.request(method: string, params?: object): Promise;`

Low-level method to send custom requests to the wallet (e.g., for signing or advanced features).

```ts
const result = await window.mojito.request("signTransaction", {
  txData: { /* your transaction here */ }
});
```

### mojito.on()
`mojito.on(event: string, callback: (data: any) => void): void`

Subscribe to wallet events.

Available events:
•	accountsChanged: fired when the connected account changes
•	disconnect: fired when the user disconnects or session is cleared

```ts
window.mojito.on("disconnect", () => {
  console.log("Wallet was disconnected");
});
```

## Example integration

```ts
async function setup() {
  if (!window.mojito?.isExtension) {
    alert("Mojito Wallet is not installed");
    return;
  }

  const restored = await window.mojito.restore();
  if (!restored) {
    await window.mojito.connect();
  }

  // Now the app can use connected addresses
  const addresses = window.mojito.connectedAddresses;
  console.log("Using addresses:", addresses);
}
```

## Security

- Private keys never leave the wallet extension.
- dApps must explicitly request permission to connect.
- Signing requests must be manually approved by the user.
- The window.mojito object only exposes public information and events.

Happy building! 🚀
