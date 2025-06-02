---
title: Bridge API
sidebar_label: Bridge API
---

# Mintlayer-ERC20 bridge

The purpose of the bridge is to transfer fungible tokens between Mintlayer and Ethereum chains.

# API server endpoints

* `api/v1/bridge-request` - submit a bridge request.

  E.g. (e2m):
  ```
  curl -H 'Content-type: application/json' \
    --data '{
        "source_chain":"Ethereum-XYZ",
        "destination_chain":"Mintlayer",
        "asset":"FOO",
        "amount":"100.00",
        "receiver_address":"tmt1q94w2g3vwvw74swj3gx4kaf5qelapmdhyyyxe3ef",
        "deposit_transactions":[{
            "raw_transaction":"02f9...bd03"
        }]
    }' \
    -X POST https://SERVER_URL/api/v1/bridge-request
  ```
  Or (m2e):
  ```
  curl -H 'Content-type: application/json' \
    --data '{
        "source_chain":"Mintlayer",
        "destination_chain":"Ethereum-XYZ",
        "asset":"FOO",
        "amount":"100.00",
        "receiver_address":"0x6CFF507AeA2FE77a508E13DD4C2dF495780871D5",
        "deposit_transactions":[{
            "intent":"e901...a9be",
            "raw_transaction":"0100...5250"
        }]
    }' \
    -X POST https://SERVER_URL/api/v1/bridge-request
  ```

  Alternatively, instead of passing the complete deposit transaction you can specify its hash.

  E.g. (e2m):
  ```
  curl -H 'Content-type: application/json' \
    --data '{
        "source_chain":"Ethereum-XYZ",
        "destination_chain":"Mintlayer",
        "asset":"FOO",
        "amount":"100.00",
        "receiver_address":"tmt1q94w2g3vwvw74swj3gx4kaf5qelapmdhyyyxe3ef",
        "deposit_transactions":[{
            "transaction_hash":"a76b...cb84"
        }]
    }' \
    -X POST https://SERVER_URL/api/v1/bridge-request
  ```
  Same for m2e.

  Example response:
  ```
  {
      "bridge_request_uuid": "aac4d30d-91c7-4e2e-94d9-00bb3709771e",
      "deposit_transaction_uuids": ["25c43ed1-d2eb-4a1a-b546-16c67d6303af"]
  }
  ```

  Note: `deposit_transaction_uuids` will have the same order as `deposit_transactions`  in the request.

* `api/v1/fees` - return the contents of the `fees` table.

  E.g.:
  ```
  curl -X GET https://SERVER_URL/api/v1/fees
  ```

  Example response: `{"bar":{"fixed_fee":"5","percentage_fee":"0.1%"},"foo":{"fixed_fee":"10","percentage_fee":"1%"}}`.

* `api/v1/subscribe` - open a websocket to receive notifications about status changes of bridge requests as well as deposit and withdrawal transactions.

  Example messages for a successful bridge request:
  ```
  {"event_name":"bridge_request_status_updated","uuid":"93bc6941-ebc5-4eae-8226-de7a606defcf","status":"pending"}
  {"event_name":"deposit_transaction_status_updated","uuid":"8d6f7745-6133-4bc6-a230-dc577d1ab626","status":"not_yet_submitted"}
  {"event_name":"deposit_transaction_status_updated","uuid":"8d6f7745-6133-4bc6-a230-dc577d1ab626","status":"submitted"}
  {"event_name":"deposit_transaction_status_updated","uuid":"8d6f7745-6133-4bc6-a230-dc577d1ab626","status":"confirmed_by_network"}
  {"event_name":"withdrawal_transaction_status_updated","uuid":"a78113ac-5984-47fb-9405-785dc38e6aae","status":"master_signed"}
  {"event_name":"bridge_request_status_updated","uuid":"93bc6941-ebc5-4eae-8226-de7a606defcf","status":"processed_by_master"}
  {"event_name":"withdrawal_transaction_status_updated","uuid":"a78113ac-5984-47fb-9405-785dc38e6aae","status":"submitted_to_network"}
  {"event_name":"withdrawal_transaction_status_updated","uuid":"a78113ac-5984-47fb-9405-785dc38e6aae","status":"confirmed_by_network"}
  {"event_name":"bridge_request_status_updated","uuid":"93bc6941-ebc5-4eae-8226-de7a606defcf","status":"completed"}
  ```
  Note: deposit transaction status change to "submitted" won't happen if the transaction has been submitted to the network by other means
  (i.e. outside the bridge); in this case the status will go from "not_yet_submitted" directly to "confirmed_by_network".

  Other possible statuses are:
    - for bridge requests: "failed" - the request has failed, "manual" - the request requires manual handling;
    - for deposit transactions: "confirmation_failed" - the transaction could not be confirmed, "invalid" - the transaction is invalid;
    - for withdrawal transactions: "failed_revalidation" - the cosigner determined that the withdrawal transaction is invalid
      (note that this is not a normal situation), "failed_submission" - the cosigner failed to submit the withdrawal transaction
      to the network.

* `api/v1/bridge-request/{uuid}` - obtain some information about a bridge request given its uuid.

  E.g.:
  ```
  curl https://SERVER_URL/api/v1/bridge-request/034d5ce2-70f4-4089-a330-97d8d8f23775
  ```

  Example response:
  ```
  {
      "uuid":"034d5ce2-70f4-4089-a330-97d8d8f23775",
      "source_chain":"mintlayer",
      "destination_chain":"ethereum-xyz",
      "asset":"foo",
      "amount":"100",
      "amount_after_fees":"89.1",
      "sender_addresses":[
          "tmt1q94w2g3vwvw74swj3gx4kaf5qelapmdhyyyxe3ef"
      ],
      "receiver_address":"0x6CFF507AeA2FE77a508E13DD4C2dF495780871D5",
      "status":"completed",
      "created_at":"2025-03-10 16:28:58.753664 +00:00:00",
      "updated_at":"2025-03-10 16:33:43.879247 +00:00:00",
      "deposit_transactions":[
          {
            "uuid":"1bcea941-2761-4655-a875-fe01c00120c6",
            "transaction_hash":"ef366c9129f6d36b7b8a7adde13a061351ea20d16b857bacab28a0ed6f8ead2d",
            "status":"confirmed_by_network",
            "created_at":"2025-03-10 16:28:58.753664 +00:00:00",
            "updated_at":"2025-03-10 16:29:10.875763 +00:00:00"
          }
      ],
      "withdrawal_transaction":{
          "uuid":"52d4bfdf-8a7c-4ea2-af54-5f287f747ffc",
          "destination_chain":"ethereum-xyz",
          "transaction_hash":"98267a71c2f40911da3aa71ee9beb7764729159d1c70510c42fa604c05dc2894",
          "status":"confirmed_by_network",
          "created_at":"2025-03-10 16:29:11.023903 +00:00:00",
          "updated_at":"2025-03-10 16:33:43.879247 +00:00:00",
          "bridge_request_uuids":[
              "034d5ce2-70f4-4089-a330-97d8d8f23775"
          ]
      }
  }
  ```

  Note:
    - The order of deposit transactions is unspecified in this case.
    - `amount_after_fees` and `withdrawal_transaction` will be `null` and `sender_addresses`
      will be empty if the request has not been handled by the master yet.
    - The returned data contains the full info about the withdrawal transaction that handles the
      bridge request (if any) instead of just a uuid. Though this is somewhat redundant (e.g. the uuid
      of the bridge request is also present in the `bridge_request_uuids` field of `withdrawal_transaction`),
      it's supposed to help reduce the number of requests that the UI has to make.

* `api/v1/deposit-transaction/{uuid}` - obtain some information about a deposit transaction given its uuid.

  E.g.:
  ```
  curl https://SERVER_URL/api/v1/deposit-transaction/1bcea941-2761-4655-a875-fe01c00120c6
  ```

  Example response:
  ```
  {
      "uuid":"1bcea941-2761-4655-a875-fe01c00120c6",
      "transaction_hash":"ef366c9129f6d36b7b8a7adde13a061351ea20d16b857bacab28a0ed6f8ead2d",
      "status":"confirmed_by_network",
      "created_at":"2025-03-10 16:28:58.753664 +00:00:00",
      "updated_at":"2025-03-10 16:29:10.875763 +00:00:00"
  }
  ```

* `api/v1/withdrawal-transaction/{uuid}` - obtain some information about a withdrawal transaction given its uuid.

  E.g.:
  ```
  curl https://SERVER_URL/api/v1/withdrawal-transaction/52d4bfdf-8a7c-4ea2-af54-5f287f747ffc
  ```

  Example response:
  ```
  {
      "uuid":"52d4bfdf-8a7c-4ea2-af54-5f287f747ffc",
      "destination_chain":"ethereum-xyz",
      "transaction_hash":"98267a71c2f40911da3aa71ee9beb7764729159d1c70510c42fa604c05dc2894",
      "status":"confirmed_by_network",
      "created_at":"2025-03-10 16:29:11.023903 +00:00:00",
      "updated_at":"2025-03-10 16:33:43.879247 +00:00:00",
      "bridge_request_uuids":[
          "034d5ce2-70f4-4089-a330-97d8d8f23775"
      ]
  }
  ```

  Note: in m2e the actual withdrawal transaction (i.e. the one that is sent to the network) is created by the cosigner.
  So, the returned `transaction_hash` will be null if the withdrawal transaction has not been handled by the cosigner yet.\
  In e2m, on the other hand, the actual transaction is created by the master, so in this case `transaction_hash` will be
  known right away.

* `api/v1/agents-config` - obtain agents' configuration values.

  E.g.:
  ```
  curl https://SERVER_URL/api/v1/agents-config
  ```

  Example response:
  ```
  {
     "network_type":"testnet",
     "ml_tokens":{
        "bar":"tmltk1lht3lwdzkdydwr7qk2j6zudqssh0lunfnhua7jrczdyjuk97edaswt2fpj",
        "foo":"tmltk1e7egscactagl7e3met67658hpl4vf9ux0ralaculjvnzhtc4qmsqv9y857"
     },
     "eth_flavor_specific_config":{
        "":{
           "token_config":{
              "bar":{
                 "address":"0x7f6dae09b819f918314d86466a9af4564d3ed805",
                 "max_amount_per_request":null
              },
              "foo":{
                 "address":"0xb87a9b1cafb3b42ea7e2cb3a72b20c5695994a53",
                 "max_amount_per_request":"1000.5"
              }
           },
           "infura_rpc_url":"https://sepolia.infura.io/v3/1c4fd1ef43ca40deb35e81bc47838b3f",
           "bridge_contract_address":"0x0b3c26e254ab5e8c9d84ccdcf1957bed0890322c",
           "e2m":null,
           "m2e":{
              "deposit_tx_required_confirmations":1,
              "deposit_tx_destination":"tmt1q94w2g3vwvw74swj3gx4kaf5qelapmdhyyyxe3ef",
              "deposit_tx_max_blocks_to_wait":10,
              "withdrawal_tx_required_confirmations":1,
              "resend_withdrawal_tx_after_block_count":2,
              "multisend_contract_address":"0x38869bf66a61cf6bdb996a6ae40d5853fd43b526",
              "gnosis_safe_address":"0xb0b61e0aaf88bc40065739112cd2347fcde3f906"
           }
        },
        "xyz":{
           "token_config":{
              "bar":{
                 "address":"0xc00f017fbd014a4daa7898b20781508c388253a8",
                 "max_amount_per_request":null
              },
              "foo":{
                 "address":"0x4ef442684ef3d050c6bd54a25d4ea95d688a74e5",
                 "max_amount_per_request":"1000.5"
              }
           },
           "infura_rpc_url":"https://something-else.infura.io/v3/1c4fd1ef43ca40deb35e81bc47838b3f",
           "bridge_contract_address":"0x80285cc9ccb49456709242c18f50e60195b371be",
           "e2m":{
              "deposit_tx_required_confirmations":1,
              "ml_token_owner_address":"tmtc1qnw7qgm87l0a0vhegyrw5szrgqlldkt8rczqzpc2",
              "tx_fee_change_address":"tmt1q9pfchtsepyy6n8hx3w74e7tm3pcv5y6ncjtjysg",
              "bridge_contract_deposit_log_record_topic":"0x2dc24880b34b2026fb1cd0231e65ef42ca1c78e4efdd9711b7629740206bfa46",
              "deposit_tx_max_blocks_to_wait":10,
              "withdrawal_tx_required_confirmations":1,
              "resend_withdrawal_tx_after_block_count":2
           },
           "m2e":{
              "deposit_tx_required_confirmations":1,
              "deposit_tx_destination":"tmt1qxm8pnvpu5886kun0vv9dqzp3nxvhawgqugprcv3",
              "deposit_tx_max_blocks_to_wait":10,
              "withdrawal_tx_required_confirmations":1,
              "resend_withdrawal_tx_after_block_count":2,
              "multisend_contract_address":"0x38869bf66a61cf6bdb996a6ae40d5853fd43b526",
              "gnosis_safe_address":"0x9f7ed25b653dfedf775b55077f0025722abd7c9f"
           }
        }
     }
  }
  ```
