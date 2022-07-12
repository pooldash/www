export interface Deposit {
    ethAddr: string;
    amount: bigint;
}

export type Withdraw = Deposit;