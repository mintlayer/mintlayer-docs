---
title: "Issuing and Managing an NFT"
sidebar_position: 3
---

This guide covers issuing a non-fungible token (NFT) on Mintlayer and transferring it.

## Prerequisites

- A running, synced `node-daemon`
- `wallet-cli` connected to the node
- A small amount of TML to cover transaction fees
- The media file whose ownership the NFT will represent (you will need its hash)

---

## Concepts

**NFT vs fungible token**: An NFT is a unique, indivisible token. Unlike fungible tokens, there is no minting, unminting, supply locking, or freezing, the NFT is created once and transferred as a whole unit.

**Media hash**: A hash of the actual media asset (image, audio, video, etc.) that the NFT represents. This is stored on-chain and serves as the immutable link between the token and the content. You compute it off-chain before issuing.

**Token id**: A unique identifier assigned to the NFT at issuance. Use this for all subsequent operations.

---

## Part 1: Preparing the Media Hash

Before issuing, compute a hash of the media file. Mintlayer does not prescribe a specific hash algorithm, use a standard one such as SHA-256 and record which algorithm you used in your metadata.

Example using the command line:

```
shasum -a 256 my-artwork.png
```

Use the resulting hex string as the `<MEDIA_HASH>` argument.

---

## Part 2: Issuing the NFT

```
token-nft-issue-new <DESTINATION_ADDRESS> <MEDIA_HASH> <NAME> <DESCRIPTION> <TICKER> [CREATOR] [ICON_URI] [MEDIA_URI] [ADDITIONAL_METADATA_URI]
```

- **`<DESTINATION_ADDRESS>`**: The address that will receive the NFT immediately after issuance. This is typically an address in the issuer's own wallet.
- **`<MEDIA_HASH>`**: The hash computed in Part 1.
- **`<NAME>`**: A human-readable name for the NFT.
- **`<DESCRIPTION>`**: A short description.
- **`<TICKER>`**: A short symbol (e.g. `ART1`).
- **`[CREATOR]`**: *(Optional)* The creator's public key as a hex string. Use `address-reveal-public-key-as-hex` to obtain it.
- **`[ICON_URI]`**: *(Optional)* A URI pointing to a thumbnail or icon for the NFT.
- **`[MEDIA_URI]`**: *(Optional)* A URI pointing to the full media asset.
- **`[ADDITIONAL_METADATA_URI]`**: *(Optional)* A URI for any additional metadata (e.g. a JSON file with extended attributes).

### Example

```
token-nft-issue-new <my_address> a3f1e2...d9c4 "Sunset #1" "A photograph of a sunset" SUNST <creator_pubkey_hex> https://example.com/icon.png https://example.com/sunset.png https://example.com/metadata.json
```

After the transaction is confirmed, the output will include the **token id**. Record it, you will need it to transfer the NFT.

---

## Part 3: Transferring the NFT

Send the NFT to another address using `token-send`:

```
token-send <token_id> <destination_address> 1
```

NFTs are indivisible, always use `1` as the amount. Transaction fees are paid in TML.

---

## Part 4: Checking NFT Balance

NFT balances appear alongside fungible token balances in the account balance output. Use the standard balance or UTXOs commands to verify the NFT is in your wallet.

---

## Notes

- NFT metadata (name, description, URIs, hash) is **set at issuance and cannot be changed**. There is no equivalent of `token-change-metadata-uri` for NFTs. Plan your metadata carefully before issuing.
- The media file itself is not stored on-chain, only its hash is. Hosting the media at a stable, persistent URI is the issuer's responsibility.
- There is no supply management for NFTs. There is exactly one unit, and it cannot be minted again or burned through a wallet command.

---

## Quick Reference

| Task | Command |
|---|---|
| Issue NFT | `token-nft-issue-new <address> <hash> <name> <description> <ticker>` |
| Transfer NFT | `token-send <token_id> <address> 1` |
| Get creator public key | `address-reveal-public-key-as-hex <address>` |

---

## Related Pages

- [`token-nft-issue-new`](../../wallet/cli/commands/tokens/token-nft-issue-new-command-guide.md)
- [`token-send`](../../wallet/cli/commands/tokens/token-send-command-guide.md)
- [`address-reveal-public-key-as-hex`](../../wallet/cli/commands/accounts-addresses/address-reveal-public-key-as-hex-command-guide.md)
- [Issuing and Managing a Token](issue-new-token.md), fungible token guide
