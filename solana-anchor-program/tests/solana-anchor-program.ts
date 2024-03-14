// import * as anchor from "@coral-xyz/anchor";
// import { Program } from "@coral-xyz/anchor";
// import { SolanaAnchorProgram } from "../target/types/solana_anchor_program";

// describe("solana-anchor-program", () => {
//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.AnchorProvider.env());

//   const program = anchor.workspace.SolanaAnchorProgram as Program<SolanaAnchorProgram>;

//   it("Is initialized!", async () => {
//     // Add your test here.
//     const tx = await program.methods.initialize().rpc();
//     console.log("Your transaction signature", tx);
//   });
// });

const assert = require("assert");
const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

describe("solana-anchor-program", () => {
  /* create and set a Provider */
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SolanaAnchorProgram;
  it("It creates the initial counter", async () => {
    /* Call the create function via RPC */
    const baseAccount = anchor.web3.Keypair.generate();
    await program.rpc.create({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });

    /* Fetch the account and check the value of count */
    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log("Count 0: ", account.count.toString());
    assert.ok(account.count.toString() == 0);
    _baseAccount = baseAccount;
  });

  it("Updating the previosuly created account", async () => {
    const baseAccount = _baseAccount;

    await program.rpc.increment({
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log("Count 1: ", account.count.toString());
    assert.ok(account.count.toString() == 1);
  });
});
