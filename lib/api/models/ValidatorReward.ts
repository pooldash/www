
/// Represents a reward earned by a validator in a specific block
export interface ValidatorReward {
    addr: string;           // Validator's POKT address
    blockHeight: bigint;    // Block height for this reward
    date: Date;             // Date for block
    amount: bigint;         // in uPOKT (1 POKT = 10^6 uPOKT)
}
