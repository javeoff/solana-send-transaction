# solana-send-transaction

The fastest way to send transaction in solana

To install package:

```bash
npm install solana-send-transaction
```

Usage

```javascript
import { VersionedTransaction } from '@solana/web3.js';
import sendTransaction from 'solana-send-transaction';

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
