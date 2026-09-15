---
title: "transaction-inspect"
sidebar_position: 115
---

Print the summary of a transaction.

The main purpose of this command is to inspect the result of `transaction-compose` or `account-sign-raw-transaction` before broadcasting to the network.

Note: this only works for transactions whose inputs have not been spent yet (i.e. it will not work if the transaction has already been included in a block). It also does not support certain input types such as account-based inputs.

## Usage

```
transaction-inspect <TRANSACTION>
```

## Arguments

- **`<TRANSACTION>`**: Hex encoded transaction or PartiallySignedTransaction.

## Example Output

```
Transaction summary:
Transaction id: <tx_id>
=== BEGIN OF INPUTS ===
- Transaction(<prev_tx_id>, 0)
=== END OF INPUTS ===
=== BEGIN OF OUTPUTS ===
- Transfer(<address>, 10.5)
- Transfer(<change_address>, 0.499)
=== END OF OUTPUTS ===

Number of inputs: 1
Total signatures: 0
Valid signatures: 0
Invalid signatures: 0
Missing signatures: 1
```

## Related

- [`transaction-compose`](transaction-compose-command-guide.md): Compose a transaction to inspect.
- [`account-sign-raw-transaction`](../accounts-addresses/account-sign-raw-transaction-command-guide.md): Sign a transaction before inspecting.
- [`node-submit-transaction`](../node-control/node-submit-transaction-command-guide.md): Broadcast after verifying.
