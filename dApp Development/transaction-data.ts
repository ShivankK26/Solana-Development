// A transaction on Solana is similar to a transaction elsewhere: it is atomic. 
// Atomic means the entire transaction runs or fails. The steps within transaction on Solana are called instructions.
// You can create a new transaction with the constructor, new Transaction(). 
// Once created, then you can add instructions to the transaction with the add() method.
import { Connection, PublicKey, LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/node-helpers";


const suppliedToPubkey = process.argv[2] || null;

if (!suppliedToPubkey) {
    console.log('Please provide a Public Key');
    process.exit(1);
}

const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");
console.log(`suppliedToPubkey: ${suppliedToPubkey}`);

const toPubKey = new PublicKey(suppliedToPubkey);
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const transaction = new Transaction();

const sendSolInstruction = SystemProgram.transfer({
    fromPubkey: sender_address,
    toPubkey: recipient_address,
    lamports: LAMPORTS_PER_SOL * amount
})

transaction.add(sendSolInstruction);


const signature = sendAndConfirmTransaction(
    connection,
    transaction,
    [senderKeypair]
)


console.log(
    `✅ Loaded our own keypair, the destination public key, and connected to Solana`
  );
  
//   const transaction = new Transaction();
  
//   const LAMPORTS_TO_SEND = 5000;
  
//   const sendSolInstruction = SystemProgram.transfer({
//     fromPubkey: senderKeypair.publicKey,
//     toPubkey,
//     lamports: LAMPORTS_TO_SEND,
//   });
  
//   transaction.add(sendSolInstruction);
  
//   const signature = await sendAndConfirmTransaction(connection, transaction, [
//     senderKeypair,
//   ]);
  
//   console.log(
//     `💸 Finished! Sent ${LAMPORTS_TO_SEND} to the address ${toPubkey}. `
//   );
//   console.log(`Transaction signature is ${signature}!`);