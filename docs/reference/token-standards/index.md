---
title: "Token Metadata Standards"
description: "The Mintlayer token metadata standards: JSON schemas for MLS-01 fungible tokens and MLS-03 NFTs, published at a token's metadata URI."
sidebar_position: 1
---

# Token Metadata Standards

Mintlayer tokens carry their identity off-chain: an issuance transaction stores a **metadata URI**, and the JSON document served at that URI describes the token to wallets, explorers, and marketplaces. The [token-standards](https://github.com/mintlayer/token-standards) repository defines the recommended schemas for those documents:

- **MLS-01** — fungible tokens ([mls01.md](mls01.md))
- **MLS-03** — non-fungible tokens, NFTs ([mls03.md](mls03.md))

The repository is the canonical reference: it contains the full schema descriptions plus ready-made example files for every token type (e.g. [mls01/utility.json](https://github.com/mintlayer/token-standards/blob/main/mls01/utility.json), [mls03/art.json](https://github.com/mintlayer/token-standards/blob/main/mls03/art.json)).

:::note[Off-chain by design]

Metadata is not validated by consensus. The chain enforces what is on-chain (ticker, decimals, supply, authority, the metadata URI itself); the JSON standard below exists so that issuers publish consistent, machine-readable metadata that every client can render the same way.

:::

## Where the URI is set

| Token kind | Set at issuance | Changeable |
| ---------- | --------------- | ---------- |
| MLS-01 fungible | `metadata_uri` field of the issuance transaction | Yes, via the token authority — see [Update the metadata URI](../../wallet/guides/issue-new-token.md#update-the-metadata-uri) |
| MLS-03 NFT | `metadata_uri` / additional metadata URI at issuance | **No** — NFT metadata is immutable once issued |

## Common top-level fields

All token metadata (both MLS-01 and MLS-03) shares these base fields:

| Field | Type | Description |
| ----- | ---- | ----------- |
| `schema_version` | string | Schema version, e.g. `"1.0"` |
| `token_type` | string | Discriminator — drives the shape of `type_metadata` |
| `name` | string | Human-readable token name |
| `symbol` | string | Ticker symbol |
| `description` | string | Short description |
| `logo_uri` | string | Image URI for the token logo |
| `website` | string | Official website |
| `social` | object | Social/community links (twitter, discord, telegram, github, whitepaper) |
| `type_metadata` | object | Type-specific fields — shape varies by `token_type` |
| `cross_chain` | array | Bridge/cross-chain contract addresses |
| `market` | object | Exchange listings, launch price, data feed IDs |
| `certifications` | array | Third-party certifications |

## Shared blocks

### `cross_chain`

Lists representations of the token on other chains, with the bridge that produced them:

```json
"cross_chain": [
  {
    "chain": "ethereum",
    "chain_id": 1,
    "address": "0x...",
    "standard": "ERC20",
    "bridge_protocol": "Mintlayer Bridge",
    "bridge_type": "canonical",
    "verified": true
  }
]
```

`bridge_type` values: `canonical` (official deployment controlled by the token team), `bridged` (third-party bridge, not controlled by the issuer), `wrapped` (wrapped version with a different custodian).

### `market`

Exchange listings, launch data, and aggregator IDs:

```json
"market": {
  "launch_date": "2024-01-15",
  "launch_price_usd": 0.05,
  "exchanges": [
    { "name": "Binance", "type": "cex", "pairs": ["MTK/USDT"], "url": "https://...", "listed_date": "2024-02-01" },
    { "name": "Uniswap V3", "type": "dex", "chain": "ethereum", "pairs": ["MTK/USDC"] }
  ],
  "coingecko_id": "mytoken",
  "coinmarketcap_id": "12345"
}
```

### `certifications`

A general array for any third-party certification; the `type` field drives optional detail blocks (e.g. `shariah_details`). Supported types include `shariah`, `esg`, `halal`, `carbon_neutral`, and `other`:

```json
"certifications": [
  {
    "type": "shariah",
    "label": "Shariah Compliant",
    "standard": "AAOIFI",
    "certifying_body": { "name": "Amanie Advisors", "jurisdiction": "MY", "website": "https://..." },
    "reference": "FATWA-2024-007",
    "issued_date": "2024-03-01",
    "expiry_date": "2025-03-01",
    "status": "active",
    "document_url": "https://...",
    "document_hash": "sha256:..."
  }
]
```

## Example

A minimal MLS-01 utility token ([mls01/utility.json](https://github.com/mintlayer/token-standards/blob/main/mls01/utility.json)):

```json
{
  "schema_version": "1.0",
  "token_type": "utility",
  "name": "Example Utility Token",
  "symbol": "EXT",
  "decimals": 8,
  "description": "A general-purpose utility token used for network fees and access to protocol services.",
  "logo_uri": "https://example.com/logo.png",
  "website": "https://example.com",
  "social": { "twitter": "https://twitter.com/exampletoken" },
  "type_metadata": {},
  "cross_chain": [],
  "market": {},
  "certifications": []
}
```
