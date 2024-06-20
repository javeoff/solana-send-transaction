import { Connection, VersionedTransaction } from "@solana/web3.js";
import { createConnection } from "./createConnection";
import { TCommitment } from "./types/TCommitment";
import { getTransactionStatus } from "./getTransactionStatus";

interface IParams {
	commitment?: TCommitment;
	connection?: Connection;
	repeatTimeout?: number;
	blockHeightLimit?: number;
}

const getIsVersionedTransaction = (transaction: VersionedTransaction | Uint8Array): transaction is VersionedTransaction =>
	typeof transaction === 'object' && !Array.isArray(transaction)


export default async function sendTransaction(
	transaction: VersionedTransaction | Uint8Array,
	params?: IParams,
): Promise<string | Error> {
	const {
		connection = createConnection(),
		repeatTimeout = 1000,
		blockHeightLimit = 150,
		commitment = null,
	} = params ? params : {}

	if (getIsVersionedTransaction(transaction)) {
		transaction = transaction.serialize();
	}

	let tx = '';
	let lastValidBlockHeight: number | null = null;

	connection.getLatestBlockhashAndContext().then((blockhash) => {
		lastValidBlockHeight = blockhash.value.lastValidBlockHeight - blockHeightLimit;
	})

	const sendTransaction = () => connection.sendRawTransaction(transaction as Uint8Array);
	tx = await sendTransaction();

	console.log('com', commitment)
	if (commitment) {
		let times = 0;
		const status = await getTransactionStatus(tx, connection)
		let isReady = status === commitment;

		while (!isReady) {
			times += 1;
			if (times > 5) {
				break;
			}
			const status = await getTransactionStatus(tx)
			isReady = status === commitment;
			if (!isReady) {
				tx = await sendTransaction();
			}
			else {
				break;
			}
			await new Promise((resolve) => setTimeout(resolve, repeatTimeout));
		}
	}

	const blockHeight = await connection.getBlockHeight();

	if (!lastValidBlockHeight) {
		lastValidBlockHeight = blockHeight;
	}

	if (blockHeight > lastValidBlockHeight) {
		return new Error("Transaction expired");
	}

	return tx;
}

export { createConnection } from './createConnection'
