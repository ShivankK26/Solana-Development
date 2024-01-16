import { Keypair, Connection, clusterApiUrl } from '@solana/web3.js';
import web3 from '@solana/web3.js'
import "dotenv/config";
import { getKeypairFromEnvironment } from '@solana-developers/node-helpers';


const CLUSTER_NAME = "devnet";
const PING_PROGRAM_ADDRESS = new web3.PublicKey('ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa')
const PING_PROGRAM_DATA_ADDRESS =  new web3.PublicKey('Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod')


const payer = getKeypairFromEnvironment("SECRET_KEY");
const connection = new web3.Connection(web3.clusterApiUrl(CLUSTER_NAME));
console.log(`Connected to the Solana ${CLUSTER_NAME} Cluster!`);


// This part creates a Solana transaction with a single instruction. The instruction involves interacting 
// with a Solana program identified by programId and providing necessary keys. The transaction is then signed 
// by the payer and sent to the Solana network. The resulting transaction signature is printed.

await connection.requestAirdrop(payer.publicKey, web3.LAMPORTS_PER_SOL * 1);
console.log(`💸 Got some ${CLUSTER_NAME} lamports!`);
const transaction = new web3.Transaction()
const programId = new web3.PublicKey(PING_PROGRAM_ADDRESS)
const pingProgramDataId = new web3.PublicKey(PING_PROGRAM_DATA_ADDRESS)

const instruction = new web3.TransactionInstruction({
    keys: [
        {
                pubkey: pingProgramDataId,
                isSigner: false,
                isWritable: true,
        },
    ],
    programId
})

transaction.add(instruction);

const signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [payer]
)

console.log(`✅ Transaction completed! Signature is ${signature}`)
