// Every interaction with the Solana network using @solana/web3.js is going to happen through a Connection object. 
// The Connection object establishes a connection with a specific Solana network, called a 'cluster'.
// For now we'll use the Devnet cluster rather than Mainnet. 
// Devnet is designed for developer use and testing, and DevNet tokens don't have real value.
import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));
console.log('Connection to Solana Devnet Network has been Successfully made!');

// Reading the Balance of an account
const address = new PublicKey("CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN");
const balance = await connection.getBalance(address);
// console.log(`The balance of the account ${address} is ${balance}`);
const balanceInSol = balance / LAMPORTS_PER_SOL;
console.log(`The balance of the account ${address} is ${balanceInSol} SOL.`);
