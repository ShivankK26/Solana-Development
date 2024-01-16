import web3 from '@solana/web3.js';
import nacl from 'tweetnacl'


// Creating the account from which payment will be made
const payer = web3.Keypair.generate();
// Establishing the connection with the devnet testnet
const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");

// Creating the airdrop request
const airdropSignature = await connection.requestAirdrop(
    payer.publicKey,
    web3.LAMPORTS_PER_SOL
)

// Confirming the airdrop transaction
await connection.confirmTransaction({ signature: airdropSignature });

// Creating the Keypair for the account to which payment has to be made
const toAccount = web3.Keypair.generate();

// Create Simple Transaction
const transaction = new web3.Transaction();

// SystemProgram grants the ability to create accounts, allocate account data, assign an account to programs, 
// work with nonce accounts, and transfer lamports. You can use the SystemInstruction class to help with decoding 
// and reading individual instructions. Using transaction.add you can perform the transaction- A transaction is 
// used to interact with programs on the Solana blockchain. These transactions are constructed with 
// TransactionInstructions, containing all the accounts possible to interact with, as well as any needed data or program addresses.
transaction.add(
    web3.SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: toAccount.publicKey,
        lamports: 1000,
    }),
);

// Confirming the final transaction
await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [payer]
)

const recentBlockHash = await connection.getRecentBlockhash();
const manualTransaction = new web3.Transaction({
    recentBlockhash: recentBlockHash.blockhash,
    feePayer: payer.publicKey,
})

manualTransaction.add(
    web3.SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: toAccount.publicKey,
        lamports: 1000
    }),
);

const transactionBuffer = manualTransaction.serializeMessage();
const signature = nacl.sign.detached(transactionBuffer, payer.secretKey);

manualTransaction.addSignature(payer.publicKey, signature);

const isVerifiedSignature = manualTransaction.verifySignatures();
console.log(`The signatures were verified: ${isVerifiedSignature}`);


let rawTransaction = manualTransaction.serialize();

await web3.sendAndConfirmRawTransaction(connection, rawTransaction);