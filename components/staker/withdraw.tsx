import { useMutation } from '@apollo/client';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import React from 'react';
import { useContext } from 'react';
import { WithdrawMutation, WithdrawMutationVariables } from '~/gql/generated/types';
import { REQUEST_WITHDRAW } from '~/gql/queries/withdraw';
import { Util } from '~/lib/util';
import { Button } from '../button/button';
import { Section } from '../section';
import { StakerContext } from './context';
import { useSignedRequest } from './ethHelpers/useSignMessage';
import styles from './withdraw.module.scss';


const InnerWithdrawWidget: React.FC = () => {
    const { ethAddress } = useContext(StakerContext);
    const { generateWithdrawRequest } = useSignedRequest();
    const [amountString, setAmountString] = React.useState('');
    const [poktAddress, setPoktAddress] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [firstBoxChecked, setFirstBoxChecked] = React.useState(false);
    const [secondBoxChecked, setSecondBoxChecked] = React.useState(false);

    const [requestWithdraw, requestWithdrawResult] = useMutation<WithdrawMutation, WithdrawMutationVariables>(REQUEST_WITHDRAW);

    const handleWithdrawPressed = async () => {
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        try {
            // ensure boxes are checked
            if (!firstBoxChecked || !secondBoxChecked) {
                console.error('You must check both boxes indicating this is a POKT address.');
                alert('You must check both boxes indicating this is a POKT address.');
                setIsLoading(false);
                return;
            }

            // validate amount
            const amount = +amountString;
            if ((typeof amount !== 'number') || (isNaN(amount))) {
                console.error('invalid amount');
                alert('Please enter a valid amount of POKT to withdraw');
                setIsLoading(false);
                return;
            }

            // validate address
            if (!Util.validatePoktAddress(poktAddress)) {
                console.error('invalid pokt address');
                alert('Invalid POKT address');
                setIsLoading(false);
                return;
            }

            // validate address does not equal current eth address:
            const ethLower = Util.removePrefix(ethAddress.toLowerCase(), '0x');
            const poktLower = poktAddress.toLowerCase();
            if (ethLower === poktLower) {
                console.error('entered ETH address');
                alert('Wait! You accidentally typed your ETH address. Please specify a POKT destination wallet.');
                setIsLoading(false);
                return;
            }

            // sign message
            const signature = await generateWithdrawRequest(ethAddress, poktAddress, amount);

            // send request
            const result = await requestWithdraw({ variables: {
                ethAddr: ethAddress,
                poktAddr: poktAddress,
                poktAmount: amount,
                signature,
            } });

            console.dir(result);
            if (result.data?.withdraw) {
                alert('Success! Your withdrawal is now pending.');
            } else {
                alert('Error! Please try again soon.');
            }
            
        } catch (e) {
            console.error(e);
        }
        setIsLoading(false);
    };

    return <>
        <div className={styles.addressWrapper}>
            <TextField 
                label='Destination POKT Address'
                variant='outlined'
                onChange={e => setPoktAddress(e.target.value) }
                InputLabelProps={{
                    style: {
                        fontFamily: '"Manrope", sans-serif',
                    }
                }}
                InputProps={{
                    style: {
                        color: 'black',
                        fontFamily: '"Manrope", sans-serif',
                        fontSize: '1rem',
                        width: '420px'
                    },
                    // startAdornment: <div>0x</div>
                }}/>
            <div className={styles.checkboxWrapper}>
                <Checkbox onChange={e => setFirstBoxChecked(e.target.checked)} />
                <div>This is <span style={{ fontWeight: 900 }}>NOT</span> an Ethereum address.</div>
            </div>
            <div className={styles.checkboxWrapper}>
                <Checkbox onChange={e => setSecondBoxChecked(e.target.checked)}/>
                <div>This is a POKT address.</div>
            </div>
        </div>

        <div className={styles.amountWrapper}>
            <TextField
                label='Amount'
                variant='outlined'
                type='number'
                onChange={e => setAmountString(e.target.value) }
                InputLabelProps={{
                    style: {
                        fontFamily: '"Manrope", sans-serif',
                    }
                }}
                InputProps={{
                    style: {
                        color: 'black',
                        fontFamily: '"Manrope", sans-serif',
                        
                    },
                    endAdornment: <div>POKT</div>
                }}/>
        </div>
        <Button text='Submit Unstake' onPress={ handleWithdrawPressed } backgroundColor='#7DF1E6' color='black' />
    </>;
};

export const WithdrawWidget: React.FC = () => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const handleButtonPressed = () => {
        setIsExpanded(true);
    };

    let content = <Button text='Unstake' onPress={ handleButtonPressed } backgroundColor='#7DF1E6' color='black' />;
    if (isExpanded) {
        content = <InnerWithdrawWidget />;
    }

    return <Section title='Unstake'>
        { content }
    </Section>;  
};