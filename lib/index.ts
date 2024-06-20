import { Connection, VersionedTransaction } from "@solana/web3.js";
import { createConnection } from "./createConnection";
import { TCommitment } from "./types/TCommitment";
import { getTransactionStatus } from "./getTransactionStatus";

interface IParams {
	commitment?: TCommitment;
	connection?: Connection;
	repeatTimeout?: number;
}

const getIsVersionedTransaction = (transaction: VersionedTransaction | Uint8Array): transaction is VersionedTransaction =>
	typeof transaction === 'object' && transaction instanceof VersionedTransaction

export const sendTransaction = async (
	transaction: VersionedTransaction | Uint8Array,
	{
		commitment,
		connection = createConnection(),
		repeatTimeout = 1000,
	}: IParams,
): Promise<string> => {
	if (getIsVersionedTransaction(transaction)) {
		transaction = transaction.serialize();
	}

	let tx = '';
	const sendTransaction = () => connection.sendRawTransaction(transaction);
	tx = await sendTransaction();

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

	return tx;
}
