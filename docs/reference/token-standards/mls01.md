---
title: "MLS-01: Fungible Tokens"
description: "MLS-01 fungible token metadata: token types and type-specific fields for the Mintlayer token metadata standard."
sidebar_position: 2
---

# MLS-01: Fungible Token Metadata

MLS-01 is Mintlayer's fungible token standard. Its metadata documents extend the [common top-level fields](index.md#common-top-level-fields) with a `token_type` discriminator and a `type_metadata` object whose shape depends on that type.

Full schemas and example files: [mintlayer/token-standards/mls01](https://github.com/mintlayer/token-standards/tree/main/mls01).

## Token types

| `token_type` | Description |
| ------------ | ----------- |
| `utility` | General-purpose utility or payment token |
| `stablecoin` | Pegged to fiat, commodity, or crypto |
| `wrapped` | Wrapped representation of an asset from another chain |
| `governance` | Token conferring voting rights over a protocol |
| `lp` | Liquidity provider token from a DEX pool |
| `rwa` | Real-world asset token (bond, real estate, fund, stock, contract, …) |
| `memecoin` | Community meme token: no utility, fair launch, renounced ownership |
| `commodity` | Tokenized physical commodity: gold, silver, oil; redeemable for delivery |
| `carbon_credit` | Fungible verified carbon offset batch: vintage, methodology, retirement flag |
| `synthetic` | Tracks an external asset price via oracle; no ownership of the underlying |
| `yield_bearing` | Lending/staking receipt token that accrues interest |
| `index` | Market-cap-weighted basket of tokens with monthly rebalancing |
| `fan_token` | Sports club or creator token with fan-vote decisions and perks |
| `voucher` | Merchant gift card / coupon redeemable for goods or services |
| `insurance` | DeFi coverage token against exploits, oracle failures, etc. |

## `type_metadata` by type

Only the highlights are listed here; the repository contains the complete field documentation and a filled example per type.

### `stablecoin`

| Field | Description |
| ----- | ----------- |
| `peg.currency` | Pegged asset (USD, EUR, XAU, BTC) |
| `peg.mechanism` | `fiat_backed` \| `crypto_overcollateralized` \| `commodity_backed` \| `algorithmic` \| `hybrid` |
| `peg.collateral_ratio` | e.g. `1.0` for fully backed |
| `peg.issuer` | Legal entity responsible for reserves |
| `peg.reserve_audit_url` | Link to reserve proof/attestation |

### `wrapped`

| Field | Description |
| ----- | ----------- |
| `underlying.chain` / `underlying.symbol` | Source chain and original asset |
| `wrapping_protocol` | Protocol managing the wrap/unwrap |
| `wrapping_ratio` | e.g. `"1:1"` |

### `governance`

| Field | Description |
| ----- | ----------- |
| `governance.voting_mechanism` | `token_weighted` \| `quadratic` \| `1_token_1_vote` |
| `governance.quorum_threshold` | Minimum participation to pass a vote |
| `governance.proposal_threshold` | Minimum tokens to submit a proposal |
| `governance.timelock_days` | Delay before execution |
| `governance.dao_name` / `dao_url` | DAO identity |

### `lp`

| Field | Description |
| ----- | ----------- |
| `pool.dex` / `pool.address` | DEX name and on-chain pool address |
| `pool.fee_tier` | e.g. `0.003` for 0.3% |
| `pool.tokens` | The two assets in the pair |

### `commodity`

| Field | Description |
| ----- | ----------- |
| `commodity.type` | `precious_metal` \| `base_metal` \| `energy` \| `agricultural` |
| `commodity.asset` / `commodity.unit` / `units_per_token` | e.g. `gold`, `troy_ounce`, `barrel` |
| `commodity.grade` / `purity` | Quality attributes |
| `storage` | Custodian, locations, insurance, audit frequency |
| `redemption` | Minimum quantity, delivery fee, destination countries |
| `price_feed` | Oracle provider and URI |

### `carbon_credit`

| Field | Description |
| ----- | ----------- |
| `credit.unit` | e.g. `tonne_co2e` |
| `credit.vintage_year` / `credit_type` / `category` | `avoidance` \| `removal`, e.g. `REDD+` |
| `project` | Name, VCS/Gold Standard ID, methodology, location, SDG goals, co-benefits |
| `registry` | Name, standard, serial range, verification body |
| `retirement` | `retired` flag, beneficiary, reason; once retired, a credit cannot be resold |
| `bridge` | Protocol used to bring the credit on-chain (e.g. Toucan) |

### `synthetic`

| Field | Description |
| ----- | ----------- |
| `tracks` | Asset name, ticker, exchange, ISIN, `tracking_type`, `dividends_reflected` |
| `price_feed` | Oracle provider, URI, update frequency, circuit-breaker deviation |
| `collateral` | Token, minimum/safe ratio, liquidation threshold and penalty |
| `risk_warnings` | Array of mandatory disclosures |
| `trading_hours` | Timezone, weekday window, weekend status |

### `yield_bearing`

| Field | Description |
| ----- | ----------- |
| `underlying` | Token symbol and address being deposited |
| `yield.apy_type` / `current_apy` / `accrual_mechanism` | `fixed` \| `variable`; `rebasing` \| `exchange_rate` |
| `yield.apy_oracle_uri` | URL of the APY feed |
| `exchange_rate` | Current redemption rate and oracle URI |
| `protocol` | Utilization rate, total supply/borrowed |
| `redemption` | Instant vs delayed, withdrawal fee |

### `index`

| Field | Description |
| ----- | ----------- |
| `index.methodology` | `market_cap_weighted` \| `equal_weighted` \| `liquidity_weighted` |
| `components[]` | Symbol, address, weight |
| `rebalancing` | Frequency, mechanism (`autonomous` \| `governed`), last/next date |
| `nav` | Oracle and current NAV in USD |
| `protocol.streaming_fee_annual` | Management fee |
| `issuance` | Mint/redeem contract |

### `fan_token`

| Field | Description |
| ----- | ----------- |
| `entity` | Type (`sports_club` \| `musician` \| `brand`), name, sport, league, country |
| `governance.voting_scope[]` | Decisions fans can vote on, plus scope disclaimer |
| `perks[]` | Named benefits with descriptions |
| `supply` | Total supply, club reserve vs public split |
| `launchpad` | Platform, initial offering price/date |

### `voucher`

| Field | Description |
| ----- | ----------- |
| `issuer` | Legal entity issuing the voucher |
| `value` | `face_value_per_token`, `currency` |
| `redeemable_for` | Description, categories, in-store/online flags |
| `acceptance.locations` / `countries` | Where it is accepted |
| `expiry.expires` | `false` for open-ended |
| `partial_redemption` / `combinable` / `refundable` | Redemption behavior |

### `insurance`

| Field | Description |
| ----- | ----------- |
| `coverage.against[]` | Risks covered with descriptions |
| `coverage.covered_protocol` | Name, version, contract address |
| `coverage.limit_per_token_usd` / `payout_token` | Coverage limit and payout asset |
| `validity` | Valid from/until, cooldown period |
| `premium` | Annual rate, token, prepaid vs streaming |
| `claims` | Contract address, assessment body, payout delay |
| `pool` | Total/available capacity, utilization, capital-provider APY |
| `exclusions[]` | What is explicitly not covered |

### `memecoin`

| Field | Description |
| ----- | ----------- |
| `meme.origin` / `archetype` | `animal` \| `person` \| `object` \| `phrase` \| `original` |
| `launch.fair_launch` / `presale` / `team_allocation_pct` / `airdrop_pct` | Launch structure |
| `contract.ownership_renounced` / `mint_disabled` / `blacklist_function` / `pausable` | Contract posture |
| `liquidity.locked` / `lock_unlock_date` / `burned_lp_pct` | Liquidity commitments |
| `tax.buy_tax_pct` / `sell_tax_pct` | Transaction taxes |

### `rwa` (real-world assets)

The `rwa` type covers several asset classes selected by `asset_class`: `real_estate`, `bond`, `equity`, `commodity`, `fund`, `receivable`, `carbon_credit`, `ip`. The repository ships one example per class ([rwa-bond](https://github.com/mintlayer/token-standards/blob/main/mls01/rwa-bond.json), [rwa-real-estate](https://github.com/mintlayer/token-standards/blob/main/mls01/rwa-real-estate.json), [rwa-fund](https://github.com/mintlayer/token-standards/blob/main/mls01/rwa-fund.json), [rwa-stock](https://github.com/mintlayer/token-standards/blob/main/mls01/rwa-stock.json), [rwa-contract](https://github.com/mintlayer/token-standards/blob/main/mls01/rwa-contract.json)). Common fields:

| Field | Description |
| ----- | ----------- |
| `asset_class` | The asset class discriminator |
| `legal` | Issuer, custodian, auditor, legal counsel (entity + jurisdiction + registration) |
| `jurisdictions[]` | `{ country, regulatory_framework, token_classification, status }` per jurisdiction |
| `transfer_restrictions` | KYC requirement, accredited-investor-only, geographic allow/blocklist, lockup |
| `rights` | Yield (fixed/variable), voting, redemption terms |
| `valuation` | Method, last value, frequency |
| `documents[]` | `{ type, label, url, hash, date }`: the hash allows integrity verification |

Class-specific highlights:

- **Fund** (`asset_class: "fund"`), `fund.type` (`private_credit`, `private_equity`, `venture_capital`, `hedge_fund`, `money_market`, `real_estate_fund`), vintage/fund life, manager (AUM, regulatory status), terms (commitments, `nav_per_token`, fees, hurdle, carried interest), liquidity (closed/open end, lock-up, distributions).
- **Stock** (`asset_class: "equity"`), company, ticker, exchange, ISIN/CUSIP, `tokens_per_share`, `rights.dividends`, `rights.voting` (typically `false` with a proxy-voting note), corporate actions, valuation price-feed URI.
- **Contract** (`asset_class: "receivable"`), `contract.type` (`royalty_stream`, `lease`, `invoice`, `forward`, `service_agreement`), counterparties (obligor, originator, SPV), cashflows (face value, payment frequency/waterfall, royalty rate), `risk_factors[]`, `valuation.method: "dcf"`.

## Issuing an MLS-01 token

The on-chain issuance flow (including setting the metadata URI) is covered in [Issue a new token](../../guides/cli/issue-new-token.md); programmatic issuance via the SDK in [JavaScript SDK: Tokens](../../build/sdks/javascript/tokens.md) and [Go SDK: Tokens](../../build/sdks/go/tokens.md).
