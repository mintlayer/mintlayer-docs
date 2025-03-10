# Mojito Wallet JavaScript API

Mojito Wallet provides a JavaScript API for web applications to interact with users' Mojito Wallet accounts. This API allows websites to request wallet access, retrieve account information, and obtain the latest addresses dynamically.

## Injected Object: `window.mintlayer`
Mojito Wallet injects a global object, `window.mintlayer`, into web pages. This object provides methods for securely interacting with the wallet.

### Checking Connection Status
Websites can check if Mojito Wallet is connected by calling:
```js
const connected = await window.mintlayer.isConnected();
console.log("Wallet connected?", connected);
```
Returns `true` if the wallet is connected, otherwise `false`.

### Requesting Account Information
To get the currently connected account ID:
```js
const account = await window.mintlayer.getAccount();
console.log("Connected account:", account);
```
Returns a string representing the account ID.

### Retrieving Addresses
Since Mojito Wallet supports multiple addresses per account, websites can obtain the list of currently active addresses:
```js
const addresses = await window.mintlayer.getAddresses();
console.log("Account addresses:", addresses);
```
Returns an array of strings representing Bitcoin-style addresses associated with the active account.

## Handling Connection Requests
Web applications should request wallet connection before attempting transactions:
```js
const response = await window.mintlayer.request({ method: "connectWallet" });
if (response.status === "success") {
  console.log("Wallet connected successfully!");
}
```

## Transaction Handling
Mojito Wallet enables web applications to submit transaction inputs and outputs for signing and broadcasting.

### Submitting a Transaction for Signing
Web applications must provide transaction inputs and outputs before signing:
```js
const transaction = {
    inputs: [
        { txid: "abc123", vout: 0, scriptSig: "" }
    ],
    outputs: [
        { address: "mojito1xyz", value: 100000 }
    ]
};

const signedTx = await window.mintlayer.request({ method: "signTransaction", params: transaction });
console.log("Signed Transaction:", signedTx);
```
Returns a signed transaction object, ready for broadcasting.

### Broadcasting a Signed Transaction
Once signed, a transaction can be broadcasted to the network:
```js
const txHash = await window.mintlayer.request({ method: "sendTransaction", params: signedTx });
console.log("Transaction Broadcasted, Hash:", txHash);
```
Returns the transaction hash upon successful broadcast.

## Security Considerations
- Web applications **do not store addresses locally**; they must request them dynamically.
- Address rotation is handled by the wallet to ensure user privacy.
- Only trusted applications should request wallet access.

## Future Extensions
Mojito Wallet plans to extend this API with:
- Event listeners (`onAccountChanged`, `onNewAddress`)
- Network selection (`getNetwork` method)

For further details, refer to the Mojito Wallet developer documentation.

