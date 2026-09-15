---
title: "MLS-03: NFTs"
description: "MLS-03 NFT metadata: token types, media fields, and type-specific metadata for the Mintlayer token metadata standard."
sidebar_position: 3
---

# MLS-03: NFT Metadata

MLS-03 is Mintlayer's non-fungible token standard. Its metadata documents extend the [common top-level fields](index.md#common-top-level-fields) plus a set of NFT-only base fields, and use `type_metadata` to describe the kind of asset, from artwork to event tickets to on-chain legal notices.

Full schemas and example files: [mintlayer/token-standards/mls03](https://github.com/mintlayer/token-standards/tree/main/mls03).

## Additional base fields (MLS-03 only)

| Field | Type | Description |
| ----- | ---- | ----------- |
| `image` | string | Primary media URI |
| `image_mime_type` | string | e.g. `image/png`, `image/svg+xml` |
| `animation_url` | string | Secondary media for video/audio/interactive |
| `animation_mime_type` | string | e.g. `video/mp4`, `audio/mp3` |
| `external_url` | string | Link to the asset's page on the issuer's site |
| `attributes` | array | Traits: `[{ trait_type, value, display_type? }]` |
| `collection` | object | `{ name, description, symbol, image, total_supply }` |
| `creator` | object | `{ address, royalty_percentage, royalty_address }` |

## Token types

| `token_type` | Description |
| ------------ | ----------- |
| `art` | Digital artwork, 1/1 or limited edition |
| `collection` | Container NFT grouping other NFTs into an ordered series, gallery, album, season, or portfolio |
| `collectible` | Generative or curated collection (PFP, series) |
| `gaming` | In-game item, character, or land |
| `rwa` | Tokenized unique real-world asset |
| `loyalty_points` | Loyalty program points batch with expiry and redemption terms |
| `club_card` | Membership card with tier, benefits, and access rules |
| `video` | Video NFT with production metadata and licensing rights |
| `notification_legal` | On-chain legal notice, court summons, regulatory service of process |
| `ticket` | Event access with seat, validity window, and resale rules |
| `music` | Audio NFT with master rights, royalty share, and physical companion |
| `credential` | Soulbound academic or professional qualification |
| `domain` | On-chain domain name with multi-chain resolution records |
| `supply_chain` | Physical product provenance record with stage-by-stage audit trail |
| `pet_passport` | Animal health and travel document, vaccinations, microchip, vet records |
| `shariah_certificate` | On-chain Shariah compliance certificate, institutional, product, fund, or transaction scope |

## `type_metadata` highlights

Only the key fields are listed here; the repository contains the complete field documentation and a filled example per type.

### `art`

`edition` (number/total), `medium` (`digital` | `physical_backed`), `ai_generated`, `license` (CC0/commercial/personal/custom).

### `collection`

`collection_type` (`art_series` | `gallery` | `comic_strip` | `photography_series` | `anthology` | `curated`), `concept`, `curator` (name, role, note), `complete`, `series_order_significant`, `date_range`, `exhibitions[]`, `press[]`, `items[]` (ordered member list: `order`, `token_id`, `name`, `image`, `description`), `bundle_policy` (individual vs bundle pricing), `provenance.mixed_custody`.

### `loyalty_points`

`program`, `points`, `points_unit`, `expiry_date`, `redeemable_for`, `transfer_policy`, `soulbound`, `rollover_policy`.

### `club_card`

`membership.program_name`, `tier`, `tier_hierarchy`, `member_since`, `valid_until`, `benefits[]`, `transfer_policy`, `soulbound`, `kyc_required`.

### `video`

`media` (duration, resolution, codec, audio tracks), `production` (director, ISRC, festival selections), `edition`, `license` (broadcast/streaming/theatrical rights, sublicensable).

### `notification_legal`

`notice_type`, `sender` (court/regulator + jurisdiction), `recipient`, `case` (reference, type, subject), `legal_basis` (framework, article, on-chain recognition), `timeline` (served_at, response_deadline), `acknowledgement_required`.

### `ticket`

`event` (venue + coordinates, performance datetime), `ticket` (id, category, zone, seat, perks), `validity` (valid_from/until, used), `resale` (allowed, deadline, max price).

### `music`

`track` (ISRC, ISWC, BPM, key), `audio` (master format, sample rate, bit depth), `rights` (master royalty share, sync licensing, streaming revenue share), `physical_companion` (e.g. acetate, claim deadline).

### `credential`

`credential_type`, `issuer` (type, accreditation), `holder`, `degree` (title, field, ECTS, grade, thesis), `verification` (W3C VC standard, revocation registry), `soulbound`.

### `domain`

`domain` (full_name, tld, punycode), `registration` (expiry, auto_renew), `resolution.records[]` (ML/BTC/ETH/email/content/url), `subdomains_enabled`.

### `supply_chain`

`product` (sku, certifications), `provenance_chain[]` (stage, actor, location, coordinates, date, document_hash), `current_custodian`, `redeemable`, `redemption` (delivers_physical, shipping_destinations).

### `pet_passport`

`animal` (species, breed, microchip_id), `owner`, `passport` (number, regulatory_framework, issuing_vet), `vaccinations[]`, `parasite_treatments[]`, `health_certificates[]`, `travel_history[]`, `transfer_requires_vet_update`.

### `shariah_certificate`

`certificate_id` (e.g. `FDQ-2026-000412`), `scope` (`institutional` | `product` | `fund` | `transaction`), `methodology_version`, `standard` (`AAOIFI` | `IFSB` | `OIC_FIQH` | `custom`), `certifying_body` (name, website, registry_address, jurisdiction), `subject` (type, name, registration_number, jurisdiction), `certification_scope` (areas, product categories, geographic coverage), `screening` (prohibited activities, financial ratios, purification), `review_process` (due diligence, scholars count, approval mechanism, evidence hash, audit trail), `scholars[]`, `multisig_approval` (signatories required, council size, approval transaction), `validity` (issued/expiry dates, renewal frequency, status), `predecessor_certificate` / `predecessor_token_id` (renewal chain), `documents[]` (`certificate` | `fatwa` | `due_diligence_report`), `soulbound: true`.

### `rwa` (unique real-world assets)

Property and other unique assets: legal ownership records, jurisdiction and regulatory classification, transfer restrictions, valuation method, and `documents[]` with integrity hashes, see the [rwa-property example](https://github.com/mintlayer/token-standards/blob/main/mls03/rwa-property.json).

## Issuing an MLS-03 NFT

On-chain issuance (metadata URI, media hash) is covered in [Issue an NFT (SDK)](../../build/guides/issue-nft.md) and the [wallet-cli NFT guide](../../wallet/guides/issuing-and-managing-an-nft.md). Remember: MLS-03 metadata is immutable once issued; plan the document before you mint.
