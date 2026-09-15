---
title: "Mintlayer Address Format"
sidebar_position: 1
---

Mintlayer addresses use **Bech32m** encoding (BIP 350), the same standard used by Bitcoin for SegWit v1+ addresses. A Mintlayer address string has the form:

```
<prefix>1<bech32m-encoded-data>
```

- **Prefix** (Human-Readable Part / HRP): identifies the network and address type
- **`1`**: separator character
- **Bech32m-encoded data**: the serialized address payload with a built-in checksum

The checksum catches typos and transcription errors. Addresses are case-insensitive (conventionally lowercase).

---

## Address Types

Mintlayer has several address types, each with its own prefix. The most common one for sending and receiving coins is the **public key hash** address.

### Standard Destination Addresses

| Type | Description | Mainnet prefix | Testnet prefix |
|------|-------------|---------------|---------------|
| `PublicKeyHash` | Hash of a public key. The standard address type for sending and receiving. | `mtc` | `tmt` |
| `PublicKey` | A full public key (used in specific contexts, e.g. staking keys). | `mptc` | `tpmt` |
| `ScriptHash` | Hash of a spending script. | `mstc` | `tstc` |
| `ClassicMultisig` | Hash of a multisig script. | `mmtc` | `tmtc` |

### Other Identifiers

These are encoded in the same Bech32m format and appear in wallet and staking contexts:

| Type | Description | Mainnet prefix | Testnet prefix |
|------|-------------|---------------|---------------|
| VRF Public Key | Verifiable Random Function key used for staking | `mvrfpk` | `tvrfpk` |
| Pool ID | Identifier for a staking pool | `mpool` | `tpool` |
| Delegation ID | Identifier for a delegation | `mdelg` | `tdelg` |
| Token ID | Identifier for a fungible token | `mmltk` | `tmltk` |
| Order ID | Identifier for a DEX order | `mordr` | `tordr` |

---

## Network Prefixes

All prefixes by network:

| Type | Mainnet | Testnet | Regtest | Signet |
|------|---------|---------|---------|--------|
| PublicKeyHash | `mtc` | `tmt` | `rmt` | `smt` |
| PublicKey | `mptc` | `tpmt` | `rpmt` | `spmt` |
| ScriptHash | `mstc` | `tstc` | `rstc` | `sstc` |
| ClassicMultisig | `mmtc` | `tmtc` | `rmtc` | `smtc` |
| VRF Public Key | `mvrfpk` | `tvrfpk` | `rvrfpk` | `svrfpk` |
| Pool ID | `mpool` | `tpool` | `rpool` | `spool` |
| Delegation ID | `mdelg` | `tdelg` | `rdelg` | `sdelg` |
| Token ID | `mmltk` | `tmltk` | `rmltk` | `smltk` |
| Order ID | `mordr` | `tordr` | `rordr` | `sordr` |

You can always tell which network an address belongs to from its prefix. Mainnet addresses start with `m`, testnet addresses with `t`.

---

## Examples

```
# Mainnet public key hash address
mtc1qyerxzjxfpz9zy2n7dfs73yvhglyfy5f8hkmmfu0

# Testnet public key hash address
tmt1q8lhgxhycm8e6yk9zpnetdwtn03h73z70c3ha4l7

# Mainnet token ID
mmltk1e7egscactagl7e3met67658hpl4vf9ux0ralaculjvnzhtc4qmsqv9y857

# Mainnet staking pool ID
mpool1zg7yccqqjlz38cyghxlxyp5lp36vwecu2g7gudrf58plzjm75tzq99fr6v

# Mainnet VRF public key
mvrfpk1qqyxcl4tc6y9amf2vmv6sgu8x5jwqlxawx73vhgemkduag9c8ku57m03mze
```

---

## Generating Addresses

The `wallet-address-generator` tool can generate addresses offline without running a node:

```bash
wallet-address-generator --network mainnet
wallet-address-generator --network testnet -n 5
```

Inside `wallet-cli`, use:

```
address-new          # generate a new receiving address
address-show         # list all existing receiving addresses
```

---

## Address typo recovery

The Bech32m checksum is a 30-bit BCH code. Beyond detecting corruption, it can **locate up to two character errors** in an address, which makes automatic typo recovery possible: when a pasted address fails its checksum, you can compute where the error is (or the two errors are), fix it, and show the corrected address to the user for confirmation.

This is implemented in the bridge frontend ([`src/bridge-sdk/addressCorrection.ts`](https://github.com/mintlayer/bridge-frontend), ported from the node web-gui). It never mutates input silently and is never applied automatically: the corrected address is shown as a suggestion, and the user must explicitly accept it, after which it goes through normal validation again.

### How it works

1. **Reject what cannot be corrected**: input must be uniformly lowercase or uppercase, at most 128 characters, the separator (last `1`) must sit exactly after the expected HRP (`mtc1`, `tmt1`, ...), and every data character must be in the Bech32 charset.
2. **Compute the syndrome**: `syndrome = polymod(hrp_expand(hrp) + data) ^ BECH32M_CONST`. A valid address gives syndrome 0.
3. **One-error correction**: the checksum is affine over GF(2), so the syndrome of a single-symbol change at position `pos` by magnitude `m` is `polymod(delta) ^ polymod(zeros)`. Build a lookup table of these syndromes for every data position and magnitude 1..31; if your syndrome matches an entry, flip that character.
4. **Two-error correction**: for each single-error candidate, XOR out its syndrome and look up the remainder in the same table; two matches locate both errors.
5. **Re-encode** the fixed data part and return the corrected address plus how many characters were fixed (1 or 2). If nothing matches, the address is uncorrectable.

A typo in the HRP itself is deliberately *not* correctable: the prefix identifies the network, so it is identity, not a typo.

### How to implement it

The codec primitives are the standard BIP-350 pieces:

```ts
const CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
const GENERATOR = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
const BECH32M_CONST = 0x2bc830a3;

const polymod = (values: number[]): number => {
  let chk = 1;
  for (const value of values) {
    const top = chk >> 25;
    chk = ((chk & 0x1ffffff) << 5) ^ value;
    for (let i = 0; i < 5; i++) {
      if ((top >> i) & 1) chk ^= GENERATOR[i];
    }
  }
  return chk;
};

const hrpExpand = (hrp: string): number[] => [
  ...[...hrp].map((c) => c.charCodeAt(0) >> 5),
  0,
  ...[...hrp].map((c) => c.charCodeAt(0) & 31),
];
```

The recovery function:

```ts
type CorrectionStatus = 'valid' | 'corrected' | 'invalid';

interface AddressCorrection {
  status: CorrectionStatus;
  corrected?: string;  // present only when status is 'corrected'
  fixedChars?: number; // 1 or 2
}

function suggestAddressCorrection(address: string, expectedHrp: string): AddressCorrection {
  if (address !== address.toLowerCase() && address !== address.toUpperCase())
    return { status: 'invalid' };
  const lower = address.toLowerCase();
  if (lower.length > 128) return { status: 'invalid' };

  const sep = lower.lastIndexOf('1');
  if (sep !== expectedHrp.length || lower.slice(0, sep) !== expectedHrp || sep + 7 > lower.length)
    return { status: 'invalid' };

  const data = [...lower.slice(sep + 1)].map((c) => CHARSET.indexOf(c));
  if (data.some((d) => d < 0)) return { status: 'invalid' };

  const values = [...hrpExpand(expectedHrp), ...data];
  const n = values.length;
  const dataStart = n - data.length;
  const chk = polymod(values) ^ BECH32M_CONST;
  if (chk === 0) return { status: 'valid' };

  const zero = polymod(new Array(n).fill(0));
  const single = new Map<number, [number, number]>();
  for (let pos = dataStart; pos < n; pos++)
    for (let m = 1; m < 32; m++) {
      const delta = new Array(n).fill(0);
      delta[pos] = m;
      const syndrome = polymod(delta) ^ zero;
      if (!single.has(syndrome)) single.set(syndrome, [pos, m]);
    }

  // one-error correction
  for (const [syndrome, [pos, m]] of single) {
    if ((chk ^ syndrome) !== 0) continue;
    const fixed = data.slice();
    fixed[pos - dataStart] ^= m;
    return { status: 'corrected', corrected: encode(expectedHrp, fixed.slice(0, -6)), fixedChars: 1 };
  }

  // two-error correction: fix one candidate, look up the remainder
  for (const [s1, [p1, m1]] of single) {
    const rest = chk ^ s1;
    if (rest === 0) continue;
    const hit = single.get(rest);
    if (!hit || hit[0] === p1) continue;
    const fixed = data.slice();
    fixed[p1 - dataStart] ^= m1;
    fixed[hit[0] - dataStart] ^= hit[1];
    return { status: 'corrected', corrected: encode(expectedHrp, fixed.slice(0, -6)), fixedChars: 2 };
  }

  return { status: 'invalid' };
}
```

where `encode` is standard Bech32m encoding (`data + checksum computed with BECH32M_CONST`, mapped through the charset). If the expected network is unknown, try both the mainnet and testnet HRPs; since the suggestion re-validates on acceptance, a wrong-network fix is still caught.

### UX rules

- **Never apply a correction automatically.** Show "did you mean ...?" with the corrected address and require explicit user confirmation.
- Re-run full validation (checksum, network prefix, payload deserialization) on the accepted suggestion; the correction is only a search over the checksum, not a guarantee of intent.
- Require a minimum data length before attempting recovery: a payload shorter than 16 words plus 6 checksum symbols cannot be a valid Mintlayer address, so suggestions would be dead on arrival.
- If no correction is found, show the plain error and point at the likely causes: missing, extra, or swapped characters.

## Technical Notes

- **Encoding**: Bech32m (BIP 350). Unlike legacy Bech32 (BIP 173), Bech32m has a stronger checksum and is required for all Mintlayer addresses.
- **Payload**: The data portion is a SCALE-encoded serialization of the underlying object (e.g. a 20-byte public key hash for `PublicKeyHash` addresses).
- **Public key hash**: computed as BLAKE2b → RIPEMD-160, resulting in a 20-byte hash.
- **Case**: Addresses are always lowercase. Mixed-case inputs are rejected.
- **Validation**: An address is invalid if the Bech32m checksum fails, if the prefix does not match the expected network, or if the payload cannot be deserialized.
- **Typo recovery**: a failed checksum can be used to locate up to two mistyped characters; see [Address typo recovery](#address-typo-recovery).
