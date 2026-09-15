---
title: "createdelegation"
sidebar_position: 21
---


The `createdelegation` command allows you to create a delegation to a specific staking pool in Mintlayer. This is useful for users who want to delegate their tokens to a staking pool without actually running a node themselves.

### Usage

To create a delegation, you need to specify the destination address and the Pool ID of the staking pool you want to delegate to. Use the following command:

```sh
createdelegation <ADDRESS> <POOL_ID>
```

#### Arguments

- `<ADDRESS>`: The destination address of the delegation.
- `<POOL_ID>`: The ID of the staking pool to which you want to delegate.

#### Options

- `-h, --help`: Print the help message.

### Example

Let's say you want to create a delegation with destination address `tmt1q8duxru0ranld7r73c6meezkwndftdma9vmmnzyc` and the staking pool with the ID `tpool12udk7skuzl3u5msdq4zx3n0wyc3ahp5ejnzh7a59ylvzl39elqcs5zpc5e `. You would use the following command:

```sh
createdelegation tmt1q8duxru0ranld7r73c6meezkwndftdma9vmmnzyc tpool12udk7skuzl3u5msdq4zx3n0wyc3ahp5ejnzh7a59ylvzl39elqcs5zpc5e
```

### Note

- Ensure that the Pool ID you are delegating to is valid and active.
- The destination address will be the one controlling the delegation. Make sure it is a valid and accessible address. If you are unsure, just create a new one using [newaddress](../accounts-addresses/newaddress-command-guide.md).
