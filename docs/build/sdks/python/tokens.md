---
title: "Tokens and NFTs"
description: "Tokens reference for the Mintlayer Python SDK: fungible token and NFT lifecycle, and manual encoders."
sidebar_position: 9
---

# Tokens and NFTs

Mintlayer supports on-chain fungible tokens and NFTs. The wallet daemon manages
the full lifecycle. The `mintlayer.wasm` module provides low-level encoding for
manual transaction flows.

---

## Fungible tokens (wallet daemon)

### Supply policies

When issuing a token you choose one of three supply policies
(`TokenSupply` dataclass, wire field `type`):

| Policy | `TokenSupply.type` | Description |
|--------|--------------------|-------------|
| Lockable | `"Lockable"` | Unlimited minting until `lock_token_supply` is called, after which the supply is frozen permanently |
| Unlimited | `"Unlimited"` | Minting is always allowed with no cap |
| Fixed | `"Fixed"` | A cap is set at issuance; supply cannot exceed it |

For a `Fixed` cap, set the `content` field to an `Amount`:

```python
TokenSupply(type="Fixed", content=Amount(atoms="1000000"))  # hard cap
```

`content` is omitted from the wire for the other two policies.

### Issuing a token

```python
from mintlayer.wallet import (
    Amount,
    Client,
    IssueTokenParams,
    TokenMetadata,
    TokenSupply,
)

wc = Client("http://127.0.0.1:3034")

authority_addr = wc.new_address(0)

result = wc.issue_token(
    IssueTokenParams(
        account=0,
        destination_address=authority_addr,
        metadata=TokenMetadata(
            token_ticker="MYTOKEN",
            number_of_decimals=2,
            metadata_uri="https://example.com/token-metadata.json",
            token_supply=TokenSupply(type="Lockable"),
            is_freezable=True,
        ),
    )
)
print(f"token id: {result.token_id}\ntx id:    {result.tx_id}")
```

The `destination_address` becomes the **authority address**: the key that
controls future token operations (minting, freezing, authority transfer). Keep
it secure.

### Minting

Wait for the issuance transaction to confirm before minting.

```python
from mintlayer.wallet import MintParams

mint_result = wc.mint_tokens(
    MintParams(
        account=0,
        token_id=result.token_id,
        address=recipient_addr,
        amount=Amount(atoms="100000"),  # in smallest token units
    )
)
print(f"minted tx id: {mint_result.tx_id}")
```

### Unminting

Returns tokens to an unminted state (removes them from circulation without
burning).

```python
from mintlayer.wallet import UnmintParams

unmint_result = wc.unmint_tokens(
    UnmintParams(
        account=0,
        token_id="ttml1...",
        amount=Amount(atoms="50000"),
    )
)
```

### Locking supply

After locking, the supply policy becomes `Fixed` at the current circulating
supply. This operation is irreversible.

```python
from mintlayer.wallet import LockSupplyParams

lock_result = wc.lock_token_supply(
    LockSupplyParams(
        account_index=0,
        token_id="ttml1...",
    )
)
```

Quirk: the field is `account_index`, not `account` — the daemon route expects
the wire key `account_index` (every other token method uses `account`).

### Freezing and unfreezing

Freezing prevents all transfers. If `is_unfreezable` is `True`, the authority
can unfreeze later.

```python
from mintlayer.wallet import FreezeParams, UnfreezeParams

freeze_result = wc.freeze_token(
    FreezeParams(
        account=0,
        token_id="ttml1...",
        is_unfreezable=True,
    )
)

unfreeze_result = wc.unfreeze_token(
    UnfreezeParams(
        account=0,
        token_id="ttml1...",
    )
)
```

### Transferring authority

```python
from mintlayer.wallet import ChangeAuthorityParams

change_result = wc.change_token_authority(
    ChangeAuthorityParams(
        account=0,
        token_id="ttml1...",
        address=new_authority_addr,
    )
)
```

### Sending tokens

```python
from mintlayer.wallet import TokenSendParams

send_result = wc.send_token(
    TokenSendParams(
        account=0,
        token_id="ttml1...",
        address=recipient_addr,
        amount=Amount(atoms="10000"),
    )
)
```

`send_token` is an alias of `token_send` on the transactions mixin — both call
the daemon's `token_send` route.

---

## NFTs (wallet daemon)

NFTs are non-fungible tokens. Each has unique on-chain metadata.

### Issuing an NFT

```python
from mintlayer.wallet import IssueNFTParams, NFTMetadata

owner_addr = wc.new_address(0)

result = wc.issue_nft(
    IssueNFTParams(
        account=0,
        destination_address=owner_addr,
        metadata=NFTMetadata(
            name="My NFT",
            description="A unique digital collectible",
            ticker="MYNFT",
            media_hash="sha256hexhash...",
            media_uri="https://example.com/media.png",
            icon_uri="https://example.com/icon.png",
            # creator and additional_metadata_uri default to None
        ),
    )
)
print(f"nft id: {result.token_id}")
```

NFTs cannot be minted after issuance: each issuance transaction creates exactly
one NFT.

---

## Reading token state from the indexer

```python
from mintlayer.indexer import Client, PageOpts

idx = Client("http://127.0.0.1:3000")

# Find by ticker
ids = idx.find_tokens_by_ticker("MYTOKEN", PageOpts(items=10))

# Full token info
token = idx.get_token("ttml1...")
print(f"ticker:    {token.token_ticker}")
print(f"supply:    {token.circulating_supply.decimal}")
print(f"locked:    {token.is_locked}")
print(f"frozen:    {token.frozen}")

# Transaction history
txs = idx.get_token_transactions("ttml1...", PageOpts(items=20))

# NFT
nft = idx.get_nft("nftid1...")
print(f"owner: {nft.owner}")
print(f"name:  {nft.metadata.name}")

# Tokens where address is authority
token_ids = idx.get_token_authority("mtc1qauthority...")
```

---

## Building token transactions manually

Use the `mintlayer.wasm` module for full control over token transactions.

### Issue a token

```python
from mintlayer.wasm import Amount, Client, FreezableToken, Network, TotalSupply

c = Client()
try:
    tip = idx.get_tip()

    issuance_fee = c.fungible_token_issuance_fee(tip.block_height, Network.MAINNET)

    # Predict the token ID
    token_id_str = c.get_token_id(encoded_inputs, tip.block_height, Network.MAINNET)

    issue_output = c.encode_output_issue_fungible_token(
        authority_addr,
        "MYTOKEN",
        "https://example.com/metadata.json",
        2,  # decimals
        TotalSupply.LOCKABLE,
        None,  # supply_amount: only required for TotalSupply.FIXED
        FreezableToken.YES,
        tip.block_height,
        Network.MAINNET,
    )
finally:
    c.close()
```

For a capped supply, pass the cap as the `supply_amount`:

```python
issue_output = c.encode_output_issue_fungible_token(
    authority_addr,
    "MYTOKEN",
    "https://example.com/metadata.json",
    2,
    TotalSupply.FIXED,
    Amount.from_atoms("1000000"),  # required exactly for TotalSupply.FIXED
    FreezableToken.NO,
    tip.block_height,
    Network.MAINNET,
)
```

Include the issuance fee as a separate output or subtract it from an input
UTXO.

### Issue an NFT

```python
issue_nft_output = c.encode_output_issue_nft(
    token_id=token_id_str,  # derived with get_token_id (same scheme as FTs)
    authority=owner_addr,
    name="My NFT",
    ticker="MYNFT",
    description="A unique digital collectible",
    media_hash=bytes.fromhex("..."),  # 32-byte sha256 of the media
    creator=bytes.fromhex("..."),  # or None
    media_uri="https://example.com/media.png",
    icon_uri=None,
    additional_metadata_uri=None,
    current_block_height=tip.block_height,
    network=Network.MAINNET,
)
```

### Mint tokens

```python
# Get the current nonce from the indexer
token_info = idx.get_token(token_id_str)

mint_input = c.encode_input_for_mint_tokens(
    token_id_str,
    Amount.from_atoms("100000"),
    token_info.next_nonce,
    Network.MAINNET,
)

mint_output = c.encode_output_token_transfer(
    Amount.from_atoms("100000"),
    recipient_addr,
    token_id_str,
    Network.MAINNET,
)
```

### Freeze a token

```python
from mintlayer.wasm import TokenUnfreezable

freeze_input = c.encode_input_for_freeze_token(
    token_id_str,
    TokenUnfreezable.YES,  # can be unfrozen later
    token_info.next_nonce,
    Network.MAINNET,
)
```

Assemble, sign, and submit manual token transactions exactly as in
[transactions.md](transactions.md).

---

## Token fees

Protocol fees apply to many token operations. Query them from the WASM client
before building transactions:

```python
tip = idx.get_tip()

issuance_fee = c.fungible_token_issuance_fee(tip.block_height, Network.MAINNET)
nft_fee = c.nft_issuance_fee(tip.block_height, Network.MAINNET)
mint_fee = c.token_supply_change_fee(tip.block_height, Network.MAINNET)
freeze_fee = c.token_freeze_fee(tip.block_height, Network.MAINNET)
authority_fee = c.token_change_authority_fee(tip.block_height, Network.MAINNET)
```

These fees must be included as coin inputs in the transaction (or deducted
from change). The `data_deposit_fee` applies to `DataDeposit` outputs.

---

## Related

- [wallet.md](wallet.md) — wallet client reference
- [indexer.md](indexer.md) — token read queries
- [wasm.md](wasm.md) — WASM encoding reference
- [transactions.md](transactions.md) — assembling and signing manual transactions
