# Token Generation Documentation

## Prerequisites

To generate a new token using the `token-issue-new` command, ensure the following prerequisites are met:

1. **Running Wallet**: You must have the `wallet-cli` tool installed and configured. Ensure your wallet is active and funded with at least **100 Coins** for the issuance fee, plus additional transaction fees.
2. **Running Node**: You need a synchronized blockchain node running via the `node-daemon`. This node must be operational and connected to the network.

## Overview

The `token-issue-new` command is used to generate a new token on a blockchain network. This command requires several arguments to define the token's properties and metadata.

## Command Syntax

```bash
token-issue-new <TOKEN_TICKER> <NUMBER_OF_DECIMALS> <METADATA_URI> <DESTINATION_ADDRESS> <TOKEN_SUPPLY> <IS_FREEZABLE>
```

### Required Arguments

The following arguments are mandatory for the `token-issue-new` command:

| Argument              | Description                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| `<TOKEN_TICKER>`      | The unique ticker symbol for the token (e.g., `XYZ`).                      |
| `<NUMBER_OF_DECIMALS>`| The number of decimal places the token supports (e.g., `18`).              |
| `<METADATA_URI>`      | A URI pointing to an IPFS-hosted JSON file containing token metadata (see below for details). |
| `<DESTINATION_ADDRESS>` | The authority address that can control the token (e.g., `tmt1qyj...dulgmxyx`). |
| `<TOKEN_SUPPLY>`      | The token supply type. Can be `unlimited`, `lockable`, or `fixed(Amount)` where `Amount` is a numeric supply (e.g., `fixed(1000000)`). |
| `<IS_FREEZABLE>`      | Indicates if the token can be frozen. Must be `freezable` or `not-freezable`. |

### Error Example

If any required arguments are missing, the following error will be displayed:

```
error: the following required arguments were not provided:
  <TOKEN_TICKER>
  <NUMBER_OF_DECIMALS>
  <METADATA_URI>
  <DESTINATION_ADDRESS>
  <TOKEN_SUPPLY>
  <IS_FREEZABLE>
```

### Success Response

Upon successful execution, you will receive a response like this:

```
A new token has been issued with ID: tmltk1jzgup9....ah0pjffwhpqgsvmuq in tx: f51ddbe5354557....2f1d21a51e
```

- `<TOKEN_ID>`: The unique identifier for the newly issued token (e.g., `tmltk1jzgup9....ah0pjffwhpqgsvmuq`).
- `<tx>`: The transaction hash (e.g., `f51ddbe5354557....2f1d21a51e`).

### Token Issuance Fee

The current fee for issuing a new token is **100 Coins**. Ensure your wallet has sufficient funds to cover this fee.

## Metadata URI

The `<METADATA_URI>` argument must point to a JSON file uploaded to IPFS (InterPlanetary File System). This JSON file contains detailed metadata about the token. Below is the structure and description of the fields in this file:

### JSON Metadata Structure

```json
{
  "name": "Token Name",
  "symbol": "TOKEN_TICKER",
  "description": "A brief description of the token and its purpose.",
  "websiteUrl": "https://example.com",
  "twitter": "https://twitter.com/example",
  "telegram": "https://t.me/example",
  "discord": "https://discord.gg/example",
  "totalSupply": "1000000",
  "initialSupply": "500000",
  "tokenDistribution": "Details about how tokens are distributed.",
  "whitepaper": "https://example.com/whitepaper.pdf",
  "tags": ["defi", "utility", "blockchain"],
  "roadmap": "A brief roadmap or link to roadmap details.",
  "decimals": 18,
  "isFixedSupply": true,
  "isFreezable": "freezable",
  "facebook": "https://facebook.com/example",
  "instagram": "https://instagram.com/example",
  "youtube": "https://youtube.com/example",
  "linkedin": "https://linkedin.com/company/example",
  "twitch": "https://twitch.tv/example",
  "tokenIcon": "ipfs://<hash>/token-icon.png",
  "bannerImage": "ipfs://<hash>/banner-image.png",
  "thumbnailImage": "ipfs://<hash>/thumbnail-image.png",
  "projectLogo": "ipfs://<hash>/project-logo.png"
}
```

### Field Descriptions

| Field              | Type       | Description                                                                 |
|--------------------|------------|-----------------------------------------------------------------------------|
| `name`            | String     | The full name of the token (e.g., "Example Token").                        |
| `symbol`          | String     | The token ticker symbol (e.g., "XYZ"). Must match `<TOKEN_TICKER>`.         |
| `description`     | String     | A short description of the token's purpose or project.                     |
| `websiteUrl`      | String     | URL to the project's official website.                                     |
| `twitter`         | String     | URL to the project's Twitter page.                                         |
| `telegram`        | String     | URL to the project's Telegram group/channel.                               |
| `discord`         | String     | URL to the project's Discord server.                                       |
| `totalSupply`     | String     | The total supply of tokens (e.g., "1000000").                              |
| `initialSupply`   | String     | The initial supply of tokens issued (e.g., "500000").                      |
| `tokenDistribution` | String   | Details about token distribution (e.g., team, public sale, etc.).          |
| `whitepaper`      | String     | URL to the project's whitepaper document.                                  |
| `tags`            | Array      | A list of tags or keywords related to the token (e.g., ["defi", "utility"]). |
| `roadmap`         | String     | A brief roadmap or link to a detailed roadmap.                             |
| `decimals`        | Integer    | Number of decimal places (must match `<NUMBER_OF_DECIMALS>`).              |
| `isFixedSupply`   | Boolean    | Indicates if the token supply is fixed (`true`) or mutable (`false`).      |
| `isFreezable`     | String     | Indicates if the token can be frozen. Must be `"freezable"` or `"not-freezable"`. Must match `<IS_FREEZABLE>`. |
| `facebook`        | String     | URL to the project's Facebook page.                                        |
| `instagram`       | String     | URL to the project's Instagram page.                                       |
| `youtube`         | String     | URL to the project's YouTube channel.                                      |
| `linkedin`        | String     | URL to the project's LinkedIn page.                                        |
| `twitch`          | String     | URL to the project's Twitch channel.                                       |
| `tokenIcon`       | String     | IPFS URI to the token's icon image.                                        |
| `bannerImage`     | String     | IPFS URI to the token's banner image.                                      |
| `thumbnailImage`  | String     | IPFS URI to the token's thumbnail image.                                   |
| `projectLogo`     | String     | IPFS URI to the project's logo image.                                      |

### Notes on Metadata
- Fields like `twitter`, `telegram`, `discord`, etc., are optional and can be omitted if not applicable.
- Image fields (`tokenIcon`, `bannerImage`, etc.) should point to valid IPFS resources.
- Ensure that `symbol`, `decimals`, and `isFreezable` in the JSON match the values provided in the command arguments.

## Example Usage

To issue a new token with the ticker "XYZ", 18 decimals, a fixed supply of 1 million, and freezable capability:

```bash
token-issue-new XYZ 18 ipfs://QmExampleHash123 tmt1qyj...dulgmxyx fixed(1000000) freezable
```

In this example:
- The metadata JSON is hosted at `ipfs://QmExampleHash123`.
- The authority address is `tmt1qyj...dulgmxyx`.
- The supply is fixed at 1,000,000 tokens.

Alternatively, for an unlimited supply and not freezable:

```bash
token-issue-new XYZ 18 ipfs://QmExampleHash123 tmt1qyj...dulgmxyx unlimited not-freezable
```

## Troubleshooting

- **Missing Arguments**: Double-check that all required arguments are provided in the correct order.
- **Invalid METADATA_URI**: Verify that the IPFS URI is accessible and points to a valid JSON file.
- **Invalid TOKEN_SUPPLY**: Ensure the supply is specified as `unlimited`, `lockable`, or `fixed(Amount)` with a valid numeric `Amount`.
- **Invalid IS_FREEZABLE**: Use `freezable` or `not-freezable` only.
- **Insufficient Funds**: Confirm your wallet has enough funds for the **100 Coins** fee plus gas.
- **Node/Wallet Issues**: Ensure `node-daemon` is running and `wallet-cli` is properly configured and synced.

## Minting Tokens

Issuing a token with `token-issue-new` does not automatically distribute tokens to a specific address. To receive tokens at a desired address, you must mint them using the `token-mint` command.

### Mint Command Syntax

```bash
token-mint <TOKEN_ID> <ADDRESS> <AMOUNT>
```

#### Required Arguments

| Argument     | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| `<TOKEN_ID>` | The token ID received from `token-issue-new` (e.g., `tmltk1jzgup9....ah0pjffwhpqgsvmuq`). |
| `<ADDRESS>`  | The address to receive the minted tokens (e.g., `tmt1qyj...dulgmxyx`).     |
| `<AMOUNT>`   | The amount of tokens to mint (e.g., `500000`).                              |

#### Error Example

If any required arguments are missing:

```
error: the following required arguments were not provided:
  <TOKEN_ID>
  <ADDRESS>
  <AMOUNT>
```

#### Example Mint Command

To mint 500,000 tokens to an address:

```bash
token-mint tmltk1jzgup9....ah0pjffwhpqgsvmuq tmt1qyj...dulgmxyx 500000
```

## Sending Tokens

Once tokens are minted, you may want to send them to another address. Note that the `address-send` command is **not suitable** for sending tokens. Instead, use the `token-send` command specifically designed for this purpose.

### Send Command Syntax

```bash
token-send <TOKEN_ID> <ADDRESS> <AMOUNT>
```

#### Required Arguments

| Argument     | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| `<TOKEN_ID>` | The token ID of the tokens to be sent (e.g., `tmltk1jzgup9....ah0pjffwhpqgsvmuq`). |
| `<ADDRESS>`  | The destination address receiving the tokens (e.g., `tmt1qyj...dulgmxyx`). |
| `<AMOUNT>`   | The amount of tokens to be sent (e.g., `500`).                              |

#### Example Send Command

To send 500 tokens to an address:

```bash
token-send tmltk1jzgup9....ah0pjffwhpqgsvmuq tmt1qyj...dulgmxyx 500
```
