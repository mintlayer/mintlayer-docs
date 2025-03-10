# 5. Decentralized Exchange \(DEX\)

## **5.1. Decentralization, privacy, and censorship**

In general, any exchange has two main components: a messaging system and a trading engine. The messaging system collects trade intentions \(orders\) from the users and sends them to the trading engine that checks the orders and executes them. In the current DeFi ecosystem - mostly built on Ethereum - the messaging system generally uses protocols like 0x, while the trading engine is a smart contract. A DEX may fail in being censorship-resistant because of two distinct conditions:

1. When the matching engine is prone to attack vectors, for example, if there is an identifiable owner of the private key/address who manages the smart contract and, in some cases, has a power to stop it;
2. When the messaging system mostly relies on centralized access points \(i.e., a website or a node relayer\) that can be shut down[ \($$^1‎^3$$\) ](5-decentralized-exchange-dex.md#footnotes).

In this regard, Mintlayer users and developers can choose between six different types of DEX interactions, depending on their needs in terms of decentralization, privacy, and censorship resistance: from a fully decentralized solution in both trading engine and messaging system to milder solutions that introduce intermediaries in the communication to increase the spectrum of possible trades.



## 5.2. The atomic swap DEX

The first solution is based on the **atomic swap** smart contract playing the part of the trading engine. It does not rely on any particular communication system: users can exchange order intentions using **any medium of communication**.

This solution is likely the best choice for OTC trades as transactions require both parties to already be in contact and agree on the pair exchange details \(the precise amount of tokens and the relative price\).

The difference between other OTC trades is that this procedure is entirely trustless. The communication is facilitated via the **standardized order messages** \([described in §5.8](5-decentralized-exchange-dex.md#5-8-peer-to-peer-messaging-system)\) that can be used to create the atomic swap transaction in the wallet automatically. This way, the trade can easily occur without requiring escrow or technical support, while notarization becomes unnecessary if the goal is to ensure the counterpart’s compliance, given the fact that the atomic swap is fully trustless.

**The privacy is guaranteed** because **no one needs to know about the transaction** except the two parties involved, whereas **blockchain analysis cannot distinguish an atomic swap from any other transaction** in the blockchain.

Another benefit of the atomic swap is that it fully supports cross-chain swaps between BTC and MLS-01 tokens. The Mintlayer full node integrates an add-on to Bitcoin Core with a UI designed to specifically perform atomic swaps between the Bitcoin chain and Mintlayer chain. The Mintlayer mobile wallet \(which is a light wallet for managing either Bitcoin and/or Mintlayer\) also includes this functionality.

Thanks to the link between Mintlayer blocks and Bitcoin blocks, the cross-chain atomic swap is secure even in case of reorg \(chain reorganization\): even if a reorganization happens on Bitcoin, the Mintlayer chain reorganizes too as part of the consensus mechanism.



## **5.3. DHT multiparty swaps**

Like the first solution, the second one uses the **atomic swap** as a trading engine and also introduces a **peer-to-peer communication** system that allows swaps between parties that are unknown entities to each other with no prior contact. It is possible to create **multiple atomic swaps** splitting a single order into multiple sub-orders, increasing the possibility of finding a match in terms of the amount and price for the pair requested. The functioning of both the messaging systems \(the order structure\) and the multi-swap are further described in [§5.3.](5-decentralized-exchange-dex.md#5-3-dht-multiparty-swaps), [§5.8](5-decentralized-exchange-dex.md#5-8-peer-to-peer-messaging-system). The communication system can also work on a TOR network so that users can communicate directly without exposing each other's IP addresses, only their **DIDs** \([see §4.4.](4-decentralized-finance-defi.md#4-4-decentralized-identity-did-and-oracles)\).

The orders broadcasted are stored by the nodes in a decentralized manner using a **distributed hash table \(DHT\)**. Every full node can activate the DHT-DEX functionality: nodes are free to sync the full DHT, prune it, start partial sync only when they are online \(starting from the most recent orders\), or not sync at all. Once activated, the node starts syncing the Distributed Hash Table of orders from the peers.

Not all orders that reach the peer are registered on the hash table; instead, each node stores only those orders that are filtered based on their interest and will pass on to the network only what is stored, just like it happens on BitTorrent or other similar peer-to-peer systems. A bigger DHT grants more opportunities to find a successful match, but on the other hand, it takes more time and resources to be synched and stored.

It means that there will never be a single equal DHT shared by all nodes, and likely there will not be nodes who know or store the entire book history since the complete set of orders is stored only collectively in many fragmented tables in possession of different node owners.

The filters applied in the syncing phase can be set over a chosen pair, a price range and the amount requested in the transaction. Nodes can freely prune the unwelcome orders from their DHT, also stopping relaying them to other nodes.

Orders can have a **due-date**; some are dropped by the nodes who created them, while others are closed because the swap has already been successfully finalized. To notify peers of **closed or canceled orders**, it is necessary to prove those orders’ ownership by signing the message with the private key connected to the original order creator’s DID. Nodes also notify the peers by relaying messages about the closed orders.

An anti-spam filter is necessary because an attacker could populate the DHT with fake orders. For this reason, each node can configure **anti-spam** filters, removing old orders or directly those nodes that spread a suspiciously high amount of orders which are never fulfilled, closed, or canceled. If the anti-spam would prove to be insufficient to manage a vast amount of fake orders or require too many resources, a third party can intermediate the DHT synchronization \([see §5.3.](5-decentralized-exchange-dex.md#5-3-dht-multiparty-swaps)\).

The user creating an order may use a **price ratio** suggested directly by the wallet node. The user chooses between two indicators: a\) the price provided by a **centralized exchange/service through API** or b\) the price **retrieved from the DHT**, which is calculated in a fully decentralized way.



## **5.4. Observer of multiparty swaps**

A messaging system based on a **distributed hash table \(DHT\)** has a few drawbacks:

1. Speed and efficiency are far below what a centralized server can provide;
2. It might be too heavy and resource-draining, especially for mobile devices, considering what an average user is willing to dedicate to the purpose;
3. It is impossible to know exactly when an order is closed since the atomic swap is bilateral, meaning that users cannot remove orders from the DHT unless confirmation is already provided. It may lead to a huge number of contacts between concurrent users that match each other even if some of them already finalized the exchange transaction. Moreover, some orders might be left unmanaged by the users \(i.e., the user broadcasted them but went offline afterward, or never finalized the atomic swap for any reasons\). Even if they can be filtered by the wallet, they can increase the DHT size with useless information;
4. It leaves room for spam attacks: an attacker could populate the Mintlayer DEX with fake orders. This attack would be free and could disrupt the network.

For these reasons, **specialized nodes can intermediate the messaging system**. Nodes can subscribe to the “observer” services, which act as the quality guarantee to its subscribers. The observer aims to voluntarily store the entire DHT, plus a few additional pieces of information provided by the nodes connected to them that report the effective status of the orders.

The observer checks the status and the frequency of the operations to create a rank, which is higher when the number of finalized operations is higher when both involved users confirm that the atomic swap was successfully achieved. The observer cross-checks the DHT order book with the subscribers' data, proving that the transactions are effectively executed. It also performs a blockchain analysis to determine each user’s reliability.

The observer ranks the user and their associated orders, communicating information to each subscriber about the **estimated reliability of a particular order/node, reporting spam, and notifying closed or inactive orders**. It may also relay orders to the subscriber that are already filtered along with the subscriber's interests and sorted according to the observer's priority set. Wallets can use the observers as “oracles” and accept or reject connections with other peers based on the reported reputation. This way, the users syncing the DHT may leave aside useless information or decide not to initiate a particular atomic swap transaction if the counterpart is not “verified” by the observer.

The observer could require a payment fee for its services. However, hypothetically it could also operate for free if it represents an entity benefiting from developing a reliable DEX, like a service that provides complimentary services connected to the DEX. Moreover, given that the observer privately gathers data from the users, it also disposes of more resources for elaborating DEX statistics, which may have an economic value or grant reputational value, allowing monetization of advertising.

The observer also collects information, such as **price and timestamp**, about orders that led to successful atomic swaps. Keeping track of this information may serve when **calculating each pair's price ratio on the DEX**, not only estimated values by the book, but actual prices of the last exchange performed on-chain.

For a node to rely on the observer services, it does not require much trust: even if the observer is shut down or does not provide any useful information, the communication between peers is not interrupted, nor the observer has any influence on the atomic swaps that are going to be performed. The only trade-off is the loss of privacy since the observer can distinguish the on-chain transactions as atomic swaps in the DEX, thus associating them to a particular owner and tracking down each ownership transfer.



## **5.5. Book aggregators for multiparty swaps**

A second solution to avoid the drawbacks of a DHT constructed in a peer-to-peer way is to trust special node relayers that act as book aggregators and store the DHT on behalf of the users. It is particularly helpful for light node/mobile wallet users as they do not have time and resources to sync many megabytes of orders, or sort and filter them.

The relayer stores and broadcasts the orders on behalf of the users and also collects all the information from the subscribed users \(like any observer node\). When users intend to exchange tokens, the Mintlayer wallet uses bloom-filters to ask a book aggregator for a specific pair’s order. Then, the node relayer provides an answer – a list of all the orders in the network that may be of interest \(in terms of price and amount\) and already filtered or ordered according to a rank. It also combines matches between simultaneous online users, directly suggesting how to initiate the atomic swap transactions and what parties can be involved in it.

Mintlayer app enables a specific configuration of push notifications to let the book aggregators notify users of a contact received. This way, users avoid the “always-on-display” screen and can unlock the phone only at the moment of initiating the atomic swap.

When a user finalizes the order for the entire amount, it sends a closure notification to the book aggregator so that no more matches are proposed. It is useful as the relayer by itself never knows if the exchange transaction has been effectively carried out between parties after establishing contact through the relayer.

Such “book aggregator” relayers can be paid off using three specific fields in the order package \(see peer-to-peer messaging system §5.8\):

* feeRecipient: the address of the relayer;
* feeToken: the token used to pay the relayer;
* Fee: the fee amount sent to the relayer.

Given that book aggregators centralize the communication system in a single entity, no exchange can happen if the aggregator is shut down until nodes find an alternative book aggregator. Another drawback of this solution is that the aggregators can track down all the users’ operations, limiting their privacy. However, aggregators also might be highly efficient in finding matches and achieving a prolific market of exchange transactions.

The essential difference between a book aggregator and a centralized exchange is that:

1. it’s a non-custodial solution;
2. the matching engine remains a trustless atomic swap;
3. users identify themselves using pseudonyms \(DID\).

There is no correct choice between a DHT, an observer, or a book aggregator; **the best solution depends on the degree of trust the user is willing to give to third parties**.



## **5.6. Programmable pool DEX**

To participate in a programmable pool DEX, the traders need to “consolidate” one or more UTXO in an account-based address. The programmable pool DEX offers less privacy but more efficiency than the atomic swap because of two features:

1. Each participant in the pool publicly provides the address of his balance when submitting an order and uses the addressPool parameter in the order package \(§5.8\). It allows for a well-ordered and spam-free DHT as all nodes can monitor all the user activities: they can independently keep track of the finalized orders and easily recognize fake/spam orders, which are immediately discarded. Meanwhile, other order messages that refer to the same balance will be blocked. The programmable pool DHT is shared only between nodes that participate in the pool to lower resource consumption of other nodes committed to different types of DEX, like those that require the DHT sync.
2. The output of a successful trade is always the update of an account balance, not a UTXO. Therefore, there is no UTXO dust creation, even if orders are split in multiple transactions.

The order packages are relayed between all the users belonging to the pool, while the trades are executed through the pool’s script-based smart contract rather than the atomic swap. For this reason, the programmable pool can work only with MLS-01 tokens and not bitcoins \(BTC\), which needs to be wrapped in a MLS-01 form before being traded in the pool.

The pool may also provide a particular transaction script, allowing the construction of an order book on-chain: nodes directly lock-in the tokens in a smart contract paired with a corresponding order package. When another trader sees an order of interest, the smart contract can be unlocked simply by executing the on-chain transaction required by that order package.

For example:

Trader A locks-in 10.000 m-USDT in an address with the following script: the sender of a transaction who transfers 1 m-BTC to that address will be able to withdraw the 10.000 m-USDT to a different address \(the balance of Trader B\). In this case, the trader A is the “maker” who sets the exchange price \(10.000m-USDT/1m-BTC\), and trader B is the taker, getting 10.000 m-USDT to his address in exchange for 1 m-BTC.

The maker’s order automatically expires after n blocks after the on-chain transaction is executed. Until that order expires, no other participant in the pool accepts the locked 10.000 m-USDT for other transactions. If the order expires, nodes can freely prune the maker’s on-chain transaction as if it was never broadcasted to the network, and the tokens are still considered to be in the account balance of trader A.

This functionality has the great benefit of enabling out-of-sync exchanges because two traders do not have to be simultaneously online and connected to each other. On the other hand, if too many maker transactions are made without resulting in a successful trade \(matching with a taker\), it may produce on-chain pollution \(higher resources committed to syncing the chain even if those orders will expire someday and therefore, in the long run, do not pollute the blockchain but require more space on disk\).

More importantly, an on-chain transaction pays a fee to the blockmaker. Therefore, it is more costly and poses a risk to end up with no successful trades. The free market economy will determine what is the more convenient solution between an off-chain DHT book with programmable pool swaps where traders connect to each other, and an on-chain book with out-of-sync makers and traders.



## 5.7. Lightning Network DEX

Order packages can be integrated into the functionality of the Mintlayer wallet to trigger Lightning Network transactions. When a user wants to execute the trade, the wallet recognizes the Lightning Network swap's specific request, thanks to the parameter lightningSwap \([§5.8.](5-decentralized-exchange-dex.md#5-8-peer-to-peer-messaging-system)\). It also automatically produces the payment invoices and HTLC transactions according to that order request \(exchange rate, amount of tokens, and expiring time\).

The swap can be executed only if the two parties have already established a channel between them in both  exchange pairs.

1. Bob produces an order package asking for an amount \(valueB\) of tokenB in exchange for an amount \(valueA\) of tokenA and sends it to Alice.
2. Alice receives the order package, produces a Lightning Network payment invoice \(A\) for tokenA, and passes the invoice to Bob.
3. Bob creates an invoice \(B\) for tokenB, whose output can be redeemed only by revealing a secret \(HTLC contract\).
4. Bob creates a conditional payment to Alice's invoice \(A\), which is hash-locked with the same secret required to redeem the tokenB output paid to invoice B.
5. Alice pays the invoice \(B\) by passing the amount \(valueB\) of tokenB to Bob, as asked by him in the order package.
6. Bob redeems the payment executed by Alice, revealing the secret.
7. Alice can now redeem the conditional payment sent to invoice A.

The benefits of Lightning Network DEX transactions are speed, privacy, near-zero fees, and no on-chain pollution. The limitation is the establishment of two different channels \(for both the tokens exchanged\). Even with enough liquidity, it is unlikely unless the parties involved already know each other and have agreed on those channels' specific purpose. However, this solution can be used by exchanges and services for directly trading BTC against MLS-01 tokens.

When Lightning Network usage becomes more widespread, the relevance of such a solution will likely rise, allowing for additional features to be implemented. One example would be order packages with a field for submarine swaps to enable the direct purchase of BTC or MLS-01 tokens that already exist on a Lightning Network channel.



## 5.8. Peer-to-peer messaging system

As described in the previous paragraphs, Mintlayer’s DEX mostly uses technologies that assume the parties involved are already in contact when transferring money between each other \(i.e., the atomic swap [described in §3.2.4.](3-tokenization-standard.md#3-2-4-atomic-swap)\). However, while building a real marketplace, users must also be able to get in touch without knowing each other in advance. Therefore, a communication system is needed to allow them to choose between different orders available in the market waiting to be fulfilled.

Carrying out this process without a centralized book is challenging. Moreover, an atomic swap transaction is necessarily bilateral, meaning that both involved users must be online and agree on the exact amount of tokens that shall be exchanged. It could cause issues since it is unlikely to find an exact match between maker and taker in a precise moment.

The “request” of exchange preceding the atomic swap is a message that would need to be relayed all over the network before reaching a match. It would take time and resources and also expose the node relayers to spam attacks, while orders might never be fulfilled in the first place. It would result in an extremely inefficient and illiquid network. Mintlayer solves this puzzle by merging ideas and technologies that are already developed on other blockchains.

If the maker and the taker do not know each other in advance, they need to find the counterpart and communicate to perform an atomic swap. The communication is structured according to a protocol inspired by Ethereum 0x[ \($$^1‎^4$$\) ](5-decentralized-exchange-dex.md#footnotes), allowing users to lean on node relayers to speed up the reconciliation process between demand and supply.

Each message is a data packet that contains order parameters concatenated and hashed to 32 bytes using the Keccak SHA3 function. The maker signs the order with the private key associated with his digital identity \([DID, see §4.4.](4-decentralized-finance-defi.md#4-4-decentralized-identity-did-and-oracles)\).

Once packaged, the order can be sent to the recipient using whatever medium of communication, even a direct message \(i.e., using Messenger, Telegram, etc.\), that is if the recipient already knows the maker.

The message is structured as follows:

[//]: # ()
[//]: # ()
[//]: # (<table>)

[//]: # (  <thead>)

[//]: # (    <tr>)

[//]: # (      <th style="text-align:left"><b>name</b>)

[//]: # (      </th>)

[//]: # (      <th style="text-align:left"><b>datatype</b>)

[//]: # (      </th>)

[//]: # (      <th style="text-align:left"><b>description</b>)

[//]: # (      </th>)

[//]: # (    </tr>)

[//]: # (  </thead>)

[//]: # (  <tbody>)

[//]: # (    <tr>)

[//]: # (      <td style="text-align:left"><b>identity</b>)

[//]: # (      </td>)

[//]: # (      <td style="text-align:left"><b>uint256</b>)

[//]: # (      </td>)

[//]: # (      <td style="text-align:left"><b>Contact &#40;DID&#41; of the maker</b>)

[//]: # (      </td>)

[//]: # (    </tr>)

[//]: # (    <tr>)

[//]: # (      <td style="text-align:left"><b>tokenA</b>)

[//]: # (      </td>)

[//]: # (      <td style="text-align:left"><b>uint256</b>)

[//]: # (      </td>)

[//]: # (      <td style="text-align:left"><b>ID of the tokenA offered by the maker</b>)

[//]: # (      </td>)

[//]: # (    </tr>)

[//]: # (    <tr>)

[//]: # (      <td style="text-align:left"><b>valueA</b>)

[//]: # (      </td>)

[//]: # (      <td style="text-align:left"><b>uint256</b>)

[//]: # (      </td>)

[//]: # (      <td style="text-align:left"><b>total units of tokenA offered by the maker</b>)

[//]: # (      </td>)

[//]: # (    </tr>)

[//]: # (    <tr>)

[//]: # (      <td style="text-align:left"><b>tokenB</b>)

[//]: # (      </td>)

[//]: # (      <td style="text-align:left"><b>uint256</b>)

[//]: # (      </td>)

[//]: # (      <td style="text-align:left"><b>ID of the tokenB requested by the maker</b>)

[//]: # (      </td>)

[//]: # (    </tr>)

[//]: # (    <tr>)

[//]: # (      <td style="text-align:left"><b>valueB</b>)

[//]: # (      </td>)

[//]: # (      <td style="text-align:left"><b>uint256</b>)

[//]: # (      </td>)

[//]: # (      <td style="text-align:left"><b>total units of tokenB requested by the maker</b>)

[//]: # (      </td>)

[//]: # (    </tr>)

[//]: # (    <tr>)

[//]: # (      <td style="text-align:left"><b>expiration</b>)

[//]: # (      </td>)

[//]: # (      <td style="text-align:left"><b>uint256</b>)

[//]: # (      </td>)

[//]: # (      <td style="text-align:left"><b>time at which the order expires</b>)

[//]: # (      </td>)

[//]: # (    </tr>)

[//]: # (    <tr>)

[//]: # (      <td style="text-align:left"><b>priceRange</b>)

[//]: # (      </td>)

[//]: # (      <td style="text-align:left"><b>uint256</b>)

[//]: # (      </td>)

[//]: # (      <td style="text-align:left"><b>% of deviation from the price &#40;valueA/valueB ratio&#41; accepted by the maker &#40;optional&#41;</b>)

[//]: # (      </td>)

[//]: # (    </tr>)

[//]: # (    <tr>)

[//]: # (      <td style="text-align:left"><b>multipartySwap</b>)

[//]: # (      </td>)

[//]: # (      <td style="text-align:left"><b>uint256</b>)

[//]: # (      </td>)

[//]: # (      <td style="text-align:left">)

[//]: # (        <p><b>If equal to tokenA it enables only an exact match &#40;no multiparty swap&#41;</b>)

[//]: # (        </p>)

[//]: # (        <p><b>If different from tokenA it indicates the minimum amount of token accepted for a multi-party swap &#40;it shall be less or equal than tokenA/2&#41;</b>)

[//]: # (        </p>)

[//]: # (      </td>)

[//]: # (    </tr>)

[//]: # (    <tr>)

[//]: # (      <td style="text-align:left"><b>feeRecipient</b>)

[//]: # (      </td>)

[//]: # (      <td style="text-align:left"><b>address</b>)

[//]: # (      </td>)

[//]: # (      <td style="text-align:left"><b>address of a relayer &#40;optional&#41;</b>)

[//]: # (      </td>)

[//]: # (    </tr>)

[//]: # (    <tr>)

[//]: # (      <td style="text-align:left"><b>feeToken</b>)

[//]: # (      </td>)

[//]: # (      <td style="text-align:left"><b>Uint256</b>)

[//]: # (      </td>)

[//]: # (      <td style="text-align:left"><b>ID of the token used to pay the relayer &#40;optional&#41;</b>)

[//]: # (      </td>)

[//]: # (    </tr>)

[//]: # (    <tr>)

[//]: # (      <td style="text-align:left"><b>fee</b>)

[//]: # (      </td>)

[//]: # (      <td style="text-align:left"><b>uint256</b>)

[//]: # (      </td>)

[//]: # (      <td style="text-align:left"><b>fee paid to the relayer &#40;optional&#41;</b>)

[//]: # (      </td>)

[//]: # (    </tr>)

[//]: # (    <tr>)

[//]: # (      <td style="text-align:left"><b>lightningSwap</b>)

[//]: # (      </td>)

[//]: # (      <td style="text-align:left"><b>uint256</b>)

[//]: # (      </td>)

[//]: # (      <td style="text-align:left"><b>Indicates if the order have to be executed on Lightning Network &#40;optional&#41;</b>)

[//]: # (      </td>)

[//]: # (    </tr>)

[//]: # (    <tr>)

[//]: # (      <td style="text-align:left"><b>addressPool</b>)

[//]: # (      </td>)

[//]: # (      <td style="text-align:left"><b>uint256</b>)

[//]: # (      </td>)

[//]: # (      <td style="text-align:left"><b>Address of the maker referring to the tokenA account in the pool that will be used for the trade &#40;optional, mandatory for programmable pool DEX trades&#41;</b>)

[//]: # (      </td>)

[//]: # (    </tr>)

[//]: # (  </tbody>)

[//]: # (</table>)

The data contained in the order does not reveal any confidential information that directly relates to the maker except for the maker’s **id**, which is necessary for the taker\(s\) to get in touch and perform the transaction. There is an **expiration time** at which the offer is no longer considered valid, and the wallet will reject any match proposed by other nodes. Two additional parameters are introduced to increase the chances of having a match between maker and taker, both freely configurable by the user:

1. **multipartySwap**: it is expected that the amount of tokens requested for the atomic swap is not easily matched in the market with an equal and opposite order expressed in the same pairs. Therefore, to fulfill an order, it might be necessary to split the amount in smaller orders, which are going to be performed by different users in a “multi-party swap” \(i.e., the maker can send 0.4 BTC to user1, 0.2 BTC to user2 and 0.4 BTC to user3, creating three different atomic swaps\). The trade-off is that several atomic swap transactions require more fees to be paid on-chain, and the users are not willing to create so much dust. Therefore, the maker can introduce a threshold in the number of tokens exchanged in the atomic swap, under which any request of exchange would be rejected. If the parameter is set equal to valueA, it means that the maker intends to perform a single atomic swap and exchange the entire amount of tokenA. If the parameter is different, it represents an arbitrary value equal to or below half of the valueA, which indicates the minimum amount accepted for every single swap with other users. The lower the parameter is set, the higher the chances to find a match, but fees and dust increase. On the other hand, if the parameter is high, failure is probable in finalizing the order \(i.e., only a few orders find a match and execute as atomic swaps\).
2. **priceRange**: indicates the deviation from the actual price in the offer that might be accepted by the maker. For example, if tokenA is BTC, and tokenB is USDT, and the ratio between valueA and valueB is 1/10.000, then a 1% priceRange means that the maker is willing to accept an atomic swap transaction for any amount of USDT that is higher than 9,900 USDT in exchange for a single BTC. By default, each node accepts whatever more favorable price ratio, so the priceRange deviation is calculated only for higher tokenA/tokenB ratios than what is indicated by the maker \(which is usually the price suggested by the wallet, [see §4.5.](4-decentralized-finance-defi.md#4-5-programmable-pools-dividends-taxation)\). Accepting a small variability in price levels makes it much more likely to find a match on the DEX but may also imply less advantageous trades. By default, the wallet picks up the most favorable price among the matches.

The wallet automatically prepares the message when the user selects the pair and digits the amount of token, desired exchange price, and the expiration date. The parameter priceRange is optional, set to 0,02% by default, as well as the parameter multipartySwap, set to one-fifth of the amount by default.

The nodes store the messages sent in the network in a distributed hash table. If any user in the network is interested in receiving an order message \(i.e., directly from the maker, relayed from a peer, or a node relayer\), they will connect and initiate the atomic swap \(only if both users are online\). The wallet looks for possible matches until it finds the first user online, then initiates the atomic swap. In the presence of multiple available offers, the wallet will choose the ones closer to the amount requested and a more favorable price to reduce the number of atomic swap transactions required and maximize the profit.

In this type of transaction, the labeling of “maker” and “taker” is imprecise since all users are, or can be, either makers and takers. The order is carried out only when there is a match between two “maker” offers expressed in the same pair \(but in the opposite direction\) and are consistent in terms of amount and price range.

In case of low liquidity of a specific asset, users might be unsure about the possibility of finalizing a big order for its entire amount, so it shall be split into many different atomic swaps. Here comes the “**traffic** **light**” function into play, which allows for three different configurations:

* **Red Light**: no atomic swap is ever initiated unless there are enough matches to close the entire order, and the corresponding users are all online at a specific moment. Contacted users are considered online when they positively confirm the reception of a message at the last minute. This option minimizes the possibility of starting a multi-party swap without finalizing it. Still, it may also slow down the process or end up with the exchange transaction stuck at the very beginning.
* **Yellow Light**: no atomic swap is initiated unless the user is aware of enough matches in the market to finalize the order for its entire amount.
* **Green Light** \(set by default\): the atomic swap is automatically initiated with the first user available for whatever amount equal or above the amount indicated in the multipartySwap parameter.


