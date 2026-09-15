---
title: "Mintlayer block and transaction serialization"
sidebar_position: 1
---

Byte-level reference for the consensus encoding of blocks and transactions.

**Source of truth.** Everything here is derived from the type definitions in `common/src/chain/`
and `crypto/src/`, and the worked examples are real encoder output, not hand-computed. If this
document and the code disagree, the code wins, in particular the `#[codec(index = N)]`
attributes, which are the enum discriminants.

The encoding is [SCALE](https://docs.substrate.io/reference/scale-codec/)
(`parity-scale-codec`, re-exported through the `serialization` crate). SCALE is not
self-describing: there are no field names, no type tags, and no terminators. Decoding requires
knowing the type in advance.

---

## 1. SCALE primer

### Fixed-width integers

Little-endian, no prefix.

| Type   | Bytes | Example (value 3)          |
|--------|-------|----------------------------|
| `u8`   | 1     | `03`                       |
| `u32`  | 4     | `03000000`                 |
| `u64`  | 8     | `0300000000000000`         |
| `u128` | 16    | `03000000...00` (16 bytes) |

### Compact integers

A variable-length encoding used for lengths, amounts, heights and timestamps. The low two bits
of the first byte select the mode:

```
mode 00 : single byte      value = byte >> 2                       0 ..= 63
mode 01 : two bytes  (LE)  value = u16 >> 2                       64 ..= 16_383
mode 10 : four bytes (LE)  value = u32 >> 2                   16_384 ..= 2^30 - 1
mode 11 : big integer      first byte >> 2 = (length - 4),
                           then `length` bytes, little-endian      2^30 ..= 2^536
```

Examples:

| Value         | Encoding      | Mode                                    |
|---------------|---------------|-----------------------------------------|
| `0`           | `00`          | single byte, `0 << 2`                   |
| `1`           | `04`          | single byte, `1 << 2`                   |
| `63`          | `fc`          | single byte, largest                    |
| `1_000_000`   | `02093d00`    | four-byte, `0xF4240 << 2 \| 0b10`       |
| `1_600_000_000` | `0300105e5f` | big-integer, 4 payload bytes LE         |

### Composites

| Construct    | Encoding                                                          |
|--------------|-------------------------------------------------------------------|
| `struct`     | fields concatenated in **declaration order**, no padding, no header |
| `enum`       | 1 byte discriminant, then the variant's payload                   |
| `Vec<T>`     | compact length (item count), then the items back to back           |
| `Option<T>`  | `00` = `None`; `01` followed by the payload = `Some`               |
| `[u8; N]`    | N raw bytes, no length prefix                                      |
| `Box<T>`     | encoded exactly as `T`, the box is invisible on the wire          |

Two repo-specific wrappers matter:

- **`VersionTag<N>`** encodes as the single byte `N`. It is a real field, occupying one byte.
- **`DirectEncode`/`DirectDecode`** (from `serialization/tagged`) generate an enum encoding with
  **no discriminant byte**, the inner variant is written directly. `Block` and `Transaction` both
  use this, which is why a `Block` is byte-identical to its `BlockV1`, and versioning is carried by
  the inner struct's own `VersionTag` instead.

### Primitive types

| Type                | Encoding                                         | Bytes    |
|---------------------|--------------------------------------------------|----------|
| `H256`, `Id<T>`     | raw hash                                         | 32       |
| `PoolId`, `DelegationId`, `TokenId`, `OrderId` | `Id<T>` newtypes  | 32       |
| `Amount`            | compact `u128` (atoms)                           | 1–17     |
| `BlockHeight`       | compact `u64`                                    | 1–9      |
| `BlockTimestamp`    | compact `u64` (seconds since Unix epoch)         | 1–9      |
| `AccountNonce`      | compact `u64`                                    | 1–9      |
| `Compact` (target)  | `u32` little-endian, **not** a SCALE compact    | 4        |
| `PublicKeyHash`     | raw                                              | 20       |
| `PublicKey`         | `00` (Secp256k1Schnorr) + 33-byte compressed key | 34       |
| `Signature`         | `00` (Secp256k1Schnorr) + 64-byte Schnorr sig    | 65       |
| `HtlcSecretHash`    | raw                                              | 20       |

Note the trap in `Compact`: the difficulty-target type is named `Compact` but is a plain
little-endian `u32`, unrelated to SCALE compact integers.

---

## 2. Block

### Top level

```
Block ──(DirectEncode, no tag)──> BlockV1
```

```
BlockV1
├── header : SignedBlockHeader
└── body   : BlockBody
```

### SignedBlockHeader

```
 offset  size  field
┌───────────────────────────────────────────────────────────────────────┐
│  0      var  block_header    : BlockHeader     (see below)            │
│  var      1  signature tag   : 00 = None, 01 = HeaderSignature        │
│  var     65  signature       : present only when tag = 01             │
└───────────────────────────────────────────────────────────────────────┘
```

The signature comes **after** the header, because `SignedBlockHeader` declares
`block_header` before `signature_data`. Only PoS blocks carry a header signature.

### BlockHeader

```
 offset  size  field
┌───────────────────────────────────────────────────────────────────────┐
│   0      1   version          VersionTag<1>, always 0x01              │
│   1     32   prev_block_id    Id<GenBlock>                            │
│  33     32   tx_merkle_root   H256                                    │
│  65     32   witness_merkle_root  H256                                │
│  97    1-9   timestamp        compact u64, seconds since epoch        │
│  var   var   consensus_data   ConsensusData (see below)               │
└───────────────────────────────────────────────────────────────────────┘
```

Everything up to and including the merkle roots is at a fixed offset; from the timestamp on,
offsets depend on the compact encoding.

### ConsensusData

```
 tag  variant   payload
┌──────────────────────────────────────────────────────────────────────┐
│ 00   None     (empty)                                                │
│ 01   PoW      PoWData                                                │
│ 02   PoS      PoSData                                                │
└──────────────────────────────────────────────────────────────────────┘
```

`PoWData`, fixed 20 bytes:

```
 offset  size  field
┌──────────────────────────────────────────────────────────────────────┐
│   0      4   bits      Compact target, u32 LE                        │
│   4     16   nonce     u128 LE                                       │
└──────────────────────────────────────────────────────────────────────┘
```

`PoSData`, variable:

```
 size  field
┌──────────────────────────────────────────────────────────────────────┐
│  var  kernel_inputs    Vec<TxInput>                                  │
│  var  kernel_witness   Vec<InputWitness>                             │
│   32  stake_pool_id    PoolId                                        │
│  var  vrf_data         VRFReturn (enum: 00 = Schnorrkel, + payload)  │
│    4  compact_target   Compact, u32 LE                               │
└──────────────────────────────────────────────────────────────────────┘
```

Field order is worth noting: `compact_target` is written **last**, after the VRF data, even
though `PoWData` puts its target first.

### BlockBody

```
BlockBody
├── reward       : BlockReward  = Vec<TxOutput>   (compact count, then outputs)
└── transactions : Vec<SignedTransaction>
```

`BlockReward` is a newtype over `Vec<TxOutput>`, so an empty reward is the single byte `00`.

### Worked example

A PoW block with no transactions and an empty reward, `prev_block_id = 0x2222…22`,
`timestamp = 1_600_000_000`, `bits = 0x1d00ffff`, `nonce = 42`, 126 bytes:

```
01                                                                version = 1
2222222222222222222222222222222222222222222222222222222222222222  prev_block_id
2fa3f686df876995167e7c2e5d74c4c7b6e48f8068fe0e44208344d480f7904c  tx_merkle_root
2fa3f686df876995167e7c2e5d74c4c7b6e48f8068fe0e44208344d480f7904c  witness_merkle_root
0300105e5f                                                        timestamp, compact 1600000000
01                                                                ConsensusData::PoW
  ffff001d                                                        bits, u32 LE = 0x1d00ffff
  2a000000000000000000000000000000                                nonce, u128 LE = 42
00                                                                header signature: None
00                                                                reward: 0 outputs
00                                                                transactions: 0 items
```

Bytes 0–123 are the `SignedBlockHeader`; the last two bytes are the whole `BlockBody`.
The block id is the hash of the *header*, not of the full block.

---

## 3. Transaction

### Top level

```
SignedTransaction
├── transaction : Transaction ──(DirectEncode, no tag)──> TransactionV1
└── signatures  : Vec<InputWitness>
```

The witnesses live in `SignedTransaction`, outside the signed body, one witness per input,
positionally matched. The transaction id is computed over `Transaction` only, so it does not
commit to the signatures.

### TransactionV1

```
 offset  size  field
┌──────────────────────────────────────────────────────────────────────┐
│   0      1   version    VersionTag<1>, always 0x01                   │
│   1    1-17  flags      compact u128 (currently always 0)            │
│  var   var   inputs     Vec<TxInput>                                 │
│  var   var   outputs    Vec<TxOutput>                                │
└──────────────────────────────────────────────────────────────────────┘
```

The smallest possible transaction is therefore 4 bytes: `01 00 00 00`.

### TxInput

```
 tag  variant              payload
┌──────────────────────────────────────────────────────────────────────┐
│ 00   Utxo                UtxoOutPoint                                │
│ 01   Account             AccountOutPoint                             │
│ 02   AccountCommand      AccountNonce + AccountCommand               │
│ 03   OrderAccountCommand OrderAccountCommand                         │
└──────────────────────────────────────────────────────────────────────┘
```

`UtxoOutPoint`, fixed 37 bytes after the `TxInput` tag:

```
 offset  size  field
┌──────────────────────────────────────────────────────────────────────┐
│   0      1   source tag   00 = Transaction, 01 = BlockReward         │
│   1     32   id           Id<Transaction> or Id<GenBlock>            │
│  33      4   index        u32 LE, output index                       │
└──────────────────────────────────────────────────────────────────────┘
```

The output index is a plain little-endian `u32`, not a compact, so it always costs 4 bytes.

`AccountOutPoint` = `AccountNonce` (compact u64) + `AccountSpending`:

| Tag  | `AccountSpending`   | Payload                    |
|------|---------------------|----------------------------|
| `00` | `DelegationBalance` | `DelegationId` + `Amount`  |

`AccountCommand` (preceded by an `AccountNonce`):

| Tag  | Variant                  | Payload                          |
|------|--------------------------|----------------------------------|
| `00` | `MintTokens`             | `TokenId` + `Amount`             |
| `01` | `UnmintTokens`           | `TokenId`                        |
| `02` | `LockTokenSupply`        | `TokenId`                        |
| `03` | `FreezeToken`            | `TokenId` + `IsTokenUnfreezable` |
| `04` | `UnfreezeToken`          | `TokenId`                        |
| `05` | `ChangeTokenAuthority`   | `TokenId` + `Destination`        |
| `06` | `ConcludeOrder`          | `OrderId`                        |
| `07` | `FillOrder`              | `OrderId` + `Amount` + `Destination` |
| `08` | `ChangeTokenMetadataUri` | `TokenId` + `Vec<u8>`            |

`OrderAccountCommand` (no nonce, these are the V1 order commands):

| Tag  | Variant         | Payload              |
|------|-----------------|----------------------|
| `00` | `FillOrder`     | `OrderId` + `Amount` |
| `01` | `FreezeOrder`   | `OrderId`            |
| `02` | `ConcludeOrder` | `OrderId`            |

### TxOutput

```
 tag  variant                payload
┌──────────────────────────────────────────────────────────────────────┐
│ 00   Transfer              OutputValue + Destination                 │
│ 01   LockThenTransfer      OutputValue + Destination + OutputTimeLock│
│ 02   Burn                  OutputValue                               │
│ 03   CreateStakePool       PoolId + StakePoolData                    │
│ 04   ProduceBlockFromStake Destination + PoolId                      │
│ 05   CreateDelegationId    Destination + PoolId                      │
│ 06   DelegateStaking       Amount + DelegationId                     │
│ 07   IssueFungibleToken    TokenIssuance                             │
│ 08   IssueNft              TokenId + NftIssuance + Destination       │
│ 09   DataDeposit           Vec<u8>                                   │
│ 0a   Htlc                  OutputValue + HashedTimelockContract      │
│ 0b   CreateOrder           OrderData                                 │
└──────────────────────────────────────────────────────────────────────┘
```

Watch the argument order: `ProduceBlockFromStake` and `CreateDelegationId` are
`(Destination, PoolId)`, while `CreateStakePool` is `(PoolId, StakePoolData)` and
`DelegateStaking` is `(Amount, DelegationId)`.

### OutputValue

| Tag  | Variant   | Payload              |
|------|-----------|----------------------|
| `00` | `Coin`    | `Amount`             |
| `01` | `TokenV0` | `TokenData` (legacy) |
| `02` | `TokenV1` | `TokenId` + `Amount` |

### Destination

| Tag  | Variant           | Payload                | Bytes |
|------|-------------------|------------------------|-------|
| `00` | `AnyoneCanSpend`  | n/a | 1     |
| `01` | `PublicKeyHash`   | `PublicKeyHash`        | 21    |
| `02` | `PublicKey`       | `PublicKey`            | 35    |
| `03` | `ScriptHash`      | `Id<Script>`           | 33    |
| `04` | `ClassicMultisig` | `PublicKeyHash`        | 21    |

`ScriptHash` is encodable but is not spendable: no validation path handles it.

### OutputTimeLock

| Tag  | Variant         | Payload             |
|------|-----------------|---------------------|
| `00` | `UntilHeight`   | compact `u64`       |
| `01` | `UntilTime`     | compact `u64` (s)   |
| `02` | `ForBlockCount` | compact `u64`       |
| `03` | `ForSeconds`    | compact `u64`       |

### InputWitness

```
 tag  variant       payload
┌──────────────────────────────────────────────────────────────────────┐
│ 00   NoSignature   Option<Vec<u8>>                                   │
│ 01   Standard      StandardInputSignature                            │
└──────────────────────────────────────────────────────────────────────┘
```

`StandardInputSignature`:

```
 offset  size  field
┌──────────────────────────────────────────────────────────────────────┐
│   0      1   sighash_type   u8 bitfield                              │
│   1    var   raw_signature  Vec<u8> (compact length, then bytes)     │
└──────────────────────────────────────────────────────────────────────┘
```

Sighash flags: `0x01` ALL, `0x02` NONE, `0x03` SINGLE, `0x80` ANYONECANPAY (OR-ed in).

`raw_signature` is an opaque byte string whose interpretation depends on the `Destination`
being spent, a bare signature for `PublicKey`/`PublicKeyHash`, an
`AuthorizedClassicalMultisigSpend` for `ClassicMultisig`, an
`AuthorizedHashedTimelockContractSpend` for HTLC outputs.

### Compound output payloads

```
StakePoolData                       HashedTimelockContract
├── pledge                : Amount  ├── secret_hash     : 20 bytes
├── staker                : Dest    ├── spend_key       : Destination
├── vrf_public_key        : VRFPub  ├── refund_timelock : OutputTimeLock
├── decommission_key      : Dest    └── refund_key      : Destination
├── margin_ratio_per_thousand
└── cost_per_block        : Amount  OrderData
                                    ├── conclude_key : Destination
                                    ├── ask          : OutputValue
                                    └── give         : OutputValue
```

`TokenIssuance` and `NftIssuance` are themselves versioned enums; see
`common/src/chain/tokens/`.

### Worked examples

**Empty transaction** (no inputs, no outputs), 4 bytes as `Transaction`, 5 as `SignedTransaction`:

```
01        version = 1
00        flags = 0        (compact)
00        inputs: 0 items
00        outputs: 0 items
00        signatures: 0 items      <- SignedTransaction only
```

**One UTXO input, one coin transfer to a P2PKH destination, unsigned witness**, 72 bytes:

```
01                                                                version = 1
00                                                                flags = 0
04                                                                inputs: 1 item
  00                                                              TxInput::Utxo
    00                                                            source: Transaction
    1111111111111111111111111111111111111111111111111111111111111111  tx id
    03000000                                                      output index = 3 (u32 LE)
04                                                                outputs: 1 item
  00                                                              TxOutput::Transfer
    00                                                            OutputValue::Coin
      02093d00                                                    amount = 1_000_000 atoms
    01                                                            Destination::PublicKeyHash
      75eeddc44a29ef682f407bce482eeb878ab863f9                    20-byte hash
04                                                                signatures: 1 item
  00                                                              InputWitness::NoSignature
    00                                                            Option::None
```

The `Transaction` alone is the first 69 bytes; the trailing three are the witness vector.

---

## 4. Discriminant quick reference

| Enum                  | Discriminants                                                                                 |
|-----------------------|-----------------------------------------------------------------------------------------------|
| `ConsensusData`       | 0 None, 1 PoW, 2 PoS                                                                          |
| `BlockHeaderSignature`| 0 None, 1 HeaderSignature                                                                     |
| `TxInput`             | 0 Utxo, 1 Account, 2 AccountCommand, 3 OrderAccountCommand                                    |
| `OutPointSourceId`    | 0 Transaction, 1 BlockReward                                                                  |
| `TxOutput`            | 0 Transfer, 1 LockThenTransfer, 2 Burn, 3 CreateStakePool, 4 ProduceBlockFromStake, 5 CreateDelegationId, 6 DelegateStaking, 7 IssueFungibleToken, 8 IssueNft, 9 DataDeposit, 10 Htlc, 11 CreateOrder |
| `OutputValue`         | 0 Coin, 1 TokenV0, 2 TokenV1                                                                  |
| `Destination`         | 0 AnyoneCanSpend, 1 PublicKeyHash, 2 PublicKey, 3 ScriptHash, 4 ClassicMultisig               |
| `OutputTimeLock`      | 0 UntilHeight, 1 UntilTime, 2 ForBlockCount, 3 ForSeconds                                     |
| `InputWitness`        | 0 NoSignature, 1 Standard                                                                     |
| `AccountSpending`     | 0 DelegationBalance                                                                           |
| `AccountCommand`      | 0 MintTokens, 1 UnmintTokens, 2 LockTokenSupply, 3 FreezeToken, 4 UnfreezeToken, 5 ChangeTokenAuthority, 6 ConcludeOrder, 7 FillOrder, 8 ChangeTokenMetadataUri |
| `OrderAccountCommand` | 0 FillOrder, 1 FreezeOrder, 2 ConcludeOrder                                                   |
| `PublicKeyHolder`     | 0 Secp256k1Schnorr                                                                            |

These values are consensus-critical: they are the wire format. Reordering an enum or inserting a
variant without an explicit `#[codec(index = N)]` is a hard fork.

---

## 5. Not covered here

- `TokenIssuance`, `NftIssuance`, `TokenData` (V0) payload layouts, see `common/src/chain/tokens/`.
- `VRFReturn` / `VRFPublicKey` internals (schnorrkel types).
- The sighash pre-image: what a signature actually commits to is a separate encoding, built in
  `common/src/chain/transaction/signature/sighash/`, and is *not* the transaction encoding above.
- Merkle tree construction for `tx_merkle_root` / `witness_merkle_root`.
- P2P wire framing, which wraps these structures in its own message envelope, see `p2p/README.md`.
