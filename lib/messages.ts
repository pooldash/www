
export const generateDepositMessage = (ethAddress: string) => `I am requesting a POKT staking address from StakeRiver for the Ethereum account ${ethAddress}`;

export const generateWithdrawMessage = (ethAddress: string, poktAddress: string, poktAmount: number) => `I am requesting that StakeRiver withdraw ${poktAmount} POKT to the address ${poktAddress} and debit the amount from the Ethereum account ${ethAddress}`;
