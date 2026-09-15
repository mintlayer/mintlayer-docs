---
title: "token-nft-issue-new"
sidebar_position: 105
---

Issue a new non-fungible token (NFT).

## Usage

```
token-nft-issue-new <DESTINATION_ADDRESS> <MEDIA_HASH> <NAME> <DESCRIPTION> <TICKER> [CREATOR] [ICON_URI] [MEDIA_URI] [ADDITIONAL_METADATA_URI]
```

## Arguments

- **`<DESTINATION_ADDRESS>`**: The address that will receive the NFT.

- **`<MEDIA_HASH>`**: The hash of the media whose ownership is represented by the NFT.

- **`<NAME>`**: Name of the NFT.

- **`<DESCRIPTION>`**: Description of the NFT.

- **`<TICKER>`**: Ticker symbol of the NFT.

- **`[CREATOR]`**: *(Optional)* The creator's public key, hex encoded.

- **`[ICON_URI]`**: *(Optional)* URI for the NFT's icon.

- **`[MEDIA_URI]`**: *(Optional)* URI of the media asset.

- **`[ADDITIONAL_METADATA_URI]`**: *(Optional)* URI for additional metadata.

## Related

- [`token-issue-new`](token-issue-new-command-guide.md): Issue a fungible token.
