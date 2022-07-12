import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import * as jsrender from 'jsrender';
import * as htmlToText from 'html-to-text';
import { DepositAddressGenerated } from './Templates/DepositAddressGenerated';
import { AWS_ACCESS_KEY, AWS_SECRET_KEY } from '../../env';
import { DepositReceived } from './Templates/DepositReceived';
import { OldTxFound } from './Templates/OldTxFound';
import { WithdrawRequested } from './Templates/WithdrawRequested';
import { NodeIssue } from './Templates/NodeIssue';

const adminEmails = [
    'gazzini.john@gmail.com',
    'read.sprabery@gmail.com'
];

export namespace EmailService {

    export const depositCrash = async () => {
        await sendEmail(
            adminEmails,
            'Deposit Crash!',
            'You should take a look at the logs.',
            {}
        );
    };

    export const rebaseCrash = async () => {
        await sendEmail(
            adminEmails,
            'Rebase Crash!',
            'You should take a look at the logs.',
            {}
        );
    };

    export const nodeBehind = async (maxDiff: number) => {
        await sendEmail(
            adminEmails,
            'Node health issue!',
            NodeIssue.message,
            {
                maxDiff
            }
        );
    };

    export const chainNodeBehind = async (chainName: string, notes: string) => {
        await sendEmail(
            adminEmails,
            `${chainName} node health issue!`,
            notes,
            {},
        );
    };

    export const kickingChainNode = async (nodeName: string) => {
        await sendEmail(
            adminEmails,
            `Possibly kicking ${nodeName}`,
            'All we know is that someone called the health API for that node, and we returned 0.',
            {},
        );
    };

    export const depositAddressGenerated = async (poktAddr: string, ethAddr: string) => {
        await sendEmail(
            adminEmails,
            'New StakeRiver User!',
            DepositAddressGenerated.message,
            {
                poktAddr,
                ethAddr,
            }
        );
    };

    export const withdrawRequested = async (ethAddr: string, amount: number) => {
        await sendEmail(
            adminEmails,
            'Withdraw requested from StakeRiver!',
            WithdrawRequested.message,
            {
                ethAddr,
                amount
            }
        );
    };

    export const depositReceived = async (ethAddr: string, amountPokt: string, poktAddress: string, blockHeight: string) => {
        await sendEmail(
            adminEmails,
            `Staked ${amountPokt} POKT`,
            DepositReceived.message,
            {
                ethAddr,
                amountPokt,
                poktAddress,
                blockHeight
            }
        );
    };

    export const oldTransactionFound = async (ethAddr: string, amountPokt: string) => {
        await sendEmail(
            adminEmails,
            `Found old transaction, ${amountPokt} POKT`,
            OldTxFound.message,
            {
                ethAddr,
                amountPokt
            }
        );
    };

    const sendEmail = async (to_emails: string[], subject: string, templateString: string, template_vars: any) => {
        // load the template:
        const template = jsrender.templates(templateString);
        const rendered = template.render(template_vars);
        const plainText = htmlToText.fromString(rendered);

        /* The following example sends a formatted email: */
        const client = new SESClient({
            region: 'us-west-2',
            credentials: {
                accessKeyId: AWS_ACCESS_KEY,
                secretAccessKey: AWS_SECRET_KEY,
            }
        });
        
        var params = {
            Destination: {
                ToAddresses: to_emails
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: rendered
                    },
                    Text: {
                        Charset: 'UTF-8',
                        Data: plainText
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: subject
                }
            },
            Source: 'support@stakeriver.com',
            Tags: [
                {
                    Name: 'source' /* required */,
                    Value: 'AWS' /* required */
                }
            ]
        };

        const command = new SendEmailCommand(params);
        await client.send(command);
    };
}
