# solana-send-transaction
---
## @Deprecated, check [@cryptoscan-pro/solana-send-transaction](https://github.com/cryptoscan-pro/solana-send-transaction)
---

The fastest way to send transaction in solana

To install package:

```bash
npm install @cryptoscan/solana-send-transaction
```

Usage

```javascript
import { VersionedTransaction } from '@solana/web3.js';
import sendTransaction from '@cryptoscan/solana-send-transaction';

const transaction = new VersionedTransaction();

sendTransaction(transaction).then((tx) => {
  console.log(tx)
})
```

## Docs

- `transaction` - Uint8 or VersionedTransaction
- `options` - options params for function
    - `commitment` - Status of transaction to resolve promise
       - `processed` -  Query the most recent block which has reached 1 confirmation by the connected node
       - `confirmed` -  Query the most recent block which has reached 1 confirmation by the cluster
       - `finalized` - Query the most recent block which has been finalized by the cluster
    - `connection` - Connection instance from solana/web3.js
    - `repeatTimeout` - Timeout to repeat while transaction does not reach commitment
   - `blockHeightLimit` - Block height limit to repeat while transaction is not expired
   - `sendOptions` - Options for sendTransaction function
      - `skipPreflight` - disable transaction verification step
      - `preflightCommitment` - preflight commitment level
      - `maxRetries` - Maximum number of times for the RPC node to retry sending the transaction to the leader
      - `minContextSlot` - The minimum slot that the request can be evaluated at

## Deploy

To install dependencies:

```bash
npm install
```

To build:

```bash
npm build
```

This project was created using `bun init` in bun v1.1.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
