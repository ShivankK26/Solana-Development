import "dotenv/config"
import { Keypair } from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/node-helpers";


// The command to generate your Keypairs
// const keypair = Keypair.generate();
const keypair = getKeypairFromEnvironment("SECRET_KEY");


// The command to display public and secret keys
// console.log("The public key is: ", keypair.publicKey.toBase58());
// console.log("The secret key is: ", keypair.secretKey);
console.log("Keypair has been generated!");
console.log(`✅ Finished! We've loaded our secret key securely, using an env file!`);