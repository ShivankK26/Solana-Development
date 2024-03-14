use anchor_lang::prelude::*;

declare_id!("49Eh4ZK6EbcmYUUfWe1h54hDw3iatLgM8Qdvmyb9Unwt");

#[program]
pub mod anchor_testing {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
