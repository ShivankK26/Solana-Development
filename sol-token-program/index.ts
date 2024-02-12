import * as web3 from '@solana/web3.js'
import * as token from '@solana/spl-token'


// When creating a new mint from a script that has access to your secret key, you can simply use the createMint 
// function. However, if you were to build a website to allow users to create a new token mint, you would need to do 
// so with the user's secret key without making them expose it to the browser. In that case, you would want to build 
// and submit a transaction with the right instructions.

// This function is responsible for building a transaction to create a new token mint. Here's what it does:
// 1. Calculates the required lamports (minimum balance) for the new account.
// 2. Generates a new keypair for the new account.
// 3. Adds a System Program instruction to create a new account.
// 4. Adds a SPL Token instruction to initialize the mint.
// 5. Returns the built transaction.
async function buildCreateMintTransaction(
    connection: web3.Connection,
    payer: web3.PublicKey,
    decimals: number
): Promise<web3.Transaction> {
    const lamports = await token.getMinimumBalanceForRentExemptMint(connection);
    const accountKeypair = web3.Keypair.generate();
    const programId = token.TOKEN_PROGRAM_ID

    const transaction = new web3.Transaction().add(
        web3.SystemProgram.createAccount({
            fromPubkey: payer,
            newAccountPubkey: accountKeypair.publicKey,
            space: token.MINT_SIZE,
            lamports,
            programId,
        }),
        token.createInitializeMintInstruction(
            accountKeypair.publicKey,
            decimals,
            payer,
            payer,
            programId,
        )
    );

    return transaction;
}


// This function is used to build a transaction to create a new token account. Here's how it works:

// 1. Retrieves the state of the mint associated with the token.
// 2. Generates a new keypair for the new account.
// 3. Calculates the required lamports and space (account length) for the new account.
// 4. Adds a System Program instruction to create a new account.
// 5. Adds a SPL Token instruction to initialize the account.
// 6. Returns the built transaction.

async function buildCreateTokenAccountTransaction(
    connection: web3.Connection,
    payer: web3.PublicKey,
    mint: web3.PublicKey
): Promise<web3.Transaction> {
    const mintState = await token.getMint(connection, mint);
    const accountKeypair = await web3.Keypair.generate()
    const space = token.getAccountLenForMint(mintState)
    const lamports = await connection.getMinimumBalanceForRentExemption(space);
    const programId = token.TOKEN_PROGRAM_ID

    const transaction = new web3.Transaction().add(
        web3.SystemProgram.createAccount({
            fromPubkey: payer,
            newAccountPubkey: accountKeypair.publicKey,
            space,
            lamports,
            programId,
        }),
        token.createInitializeAccountInstruction(
            accountKeypair.publicKey,
            mint,
            payer,
            programId,
        )
    );

    return transaction
}


// An Associated Token Account is a Token Account where the address of the Token Account is derived using 
// an owner's public key and a token mint. Associated Token Accounts provide a deterministic way to find the 
// Token Account owned by a specific publicKey for a specific token mint.
async function buildCreateAssociatedTokenAccountTransaction(
    payer: web3.PublicKey,
    mint: web3.PublicKey
): Promise<web3.Transaction> {
    const associatedTokenAddress = await token.getAssociatedTokenAddress(mint, payer, false);

    const transaction = new web3.Transaction().add(
        token.createAssociatedTokenAccountInstruction(
            payer,
            associatedTokenAddress,
            payer,
            mint
        )
    )

    return transaction
}


// Mint Tokens- Minting tokens is the process of issuing new tokens into circulation. When you mint tokens, 
// you increase the supply of the token mint and deposit the newly minted tokens into a token account. Only the
// mint authority of a token mint is allowed to mint new tokens. The mintTo function returns a TransactionSignature 
// that can be viewed on the Solana Explorer. The mintTo function requires the following arguments:

async function buildMintToTransaction(
    authority: web3.PublicKey,
    mint: web3.PublicKey,
    amount: number,
    destination: web3.PublicKey
): Promise<web3.Transaction> {
    const transaction = new web3.Transaction().add(
        token.createMintToInstruction(
            mint,
            destination,
            authority,
            amount
        )
    )
    return transaction
}


// Transfer Tokens
// SPL-Token transfers require both the sender and receiver to have token accounts for the mint of the tokens 
// being transferred. The tokens are transferred from the sender’s token account to the receiver’s token account.
async function buildTransferTransaction(
    source: web3.PublicKey,
    destination: web3.PublicKey,
    owner: web3.PublicKey,
    amount: number,
): Promise<web3.Transaction> {
    const transaction = new web3.Transaction().add(
        token.createTransferInstruction(
            source,
            destination,
            owner,
            amount
        )
    )
    return transaction
}


//Burn Tokens
// Burning tokens is the process of decreasing the token supply of a given token mint. Burning tokens removes 
// them from the given token account and from broader circulation.
async function buildBurnTransaction(
    account: web3.PublicKey,
    mint: web3.PublicKey,
    owner: web3.PublicKey,
    amount: number,
): Promise<web3.Transaction> {
    const transaction = new web3.Transaction().add(
        token.createBurnInstruction(
            account,
            mint,
            owner,
            amount
        )
    )
    return transaction
}


// Approve Delegate

// Approving a delegate is the process of authorizing another account to transfer or burn tokens from a token 
// account. When using a delegate, the authority over the token account remains with the original owner. The maximum 
// amount of tokens a delegate may transfer or burn is specified at the time the owner of the token account approves 
// the delegate. Note that there can only be one delegate account associated with a token account at any given time.
async function buildApproveTransaction(
    account: web3.PublicKey,
    delegate: web3.PublicKey,
    owner: web3.PublicKey,
    amount: number
): Promise<web3.Transaction> {
    const transaction = new web3.Transaction().add(
        token.createApproveInstruction(
            account,
            delegate,
            owner,
            amount
        )
    )
    return transaction
}


// Revoke Delegate

// A previously approved delegate for a token account can be later revoked. Once a delegate is revoked, the delegate 
// can no longer transfer tokens from the owner's token account. Any remaining amount left untransferred from the 
// previously approved amount can no longer be transferred by the delegate.
async function buildRevokeTransaction(
    account: web3.PublicKey,
    owner: web3.PublicKey
): Promise<web3.Transaction> {
    const transaction = new web3.Transaction().add(
        token.createRevokeInstruction(
            account,
            owner
        )
    )
    return transaction
}