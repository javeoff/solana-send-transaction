import { Connection, VersionedTransaction } from "@solana/web3.js";

type TCommitment = 'processed' | 'confirmed' | 'finalized';

interface IParams {
	commitment: TCommitment;
	connection?: Connection;
}

export const createConnection = (url?: string, getProxy?: () => string) => {
	return new Connection(url || "https://api.mainnet-beta.solana.com", {
		wsEndpoint: 'wss://api.mainnet-beta.solana.com/',
		fetch: getProxy ? async (input: any, options: any): Promise<Response> => {
			const processedInput = typeof input === 'string' && input.slice(0, 2) === '//'
				? 'https:' + input
				: input;

				return fetch(processedInput, {
					...options,
					proxy: getProxy ? getProxy() : undefined,
				})
		} : undefined
	});
}

const getIsVersionedTransaction = (transaction: VersionedTransaction | Uint8Array): transaction is VersionedTransaction =>
	typeof transaction === 'object' && transaction instanceof VersionedTransaction

export const sendTransaction = (
	transaction: VersionedTransaction | Uint8Array,
	{
		connection = createConnection(),
	}: IParams,
) => {
	if (getIsVersionedTransaction(transaction)) {
		transaction = transaction.serialize();
	}

	return connection.sendRawTransaction(transaction);
}
