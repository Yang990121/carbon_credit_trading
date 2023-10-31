import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';
function CreditPurchase({ account, project, projects }) {
    const { carbonCreditContract } = useWeb3();

    const purchaseCredits = async () => {
        if (!carbonCreditContract) {
            console.log("no project contract detected");
        }
        const result = await carbonCreditContract.methods
            .transferFrom(project.creator, account, project.creditsIssued)
            .call();

        console.log("Carbon credits purchased:", result);


    }

    // const transferCarbonCredits = async () => {
    //     try {
    //         // Transfer carbon credits
    //         const txResult = await carbonCreditContract.methods
    //             .transferCarbonCredits(selectedAccount, creditAmount)
    //             .send({
    //                 from: accountHolder, // Use the selected Ethereum account
    //             });

    //         console.log("Carbon credits transferred:", txResult);

    //         // Update the UI or perform any other actions after the transaction is successful
    //         const transaction = {
    //             fromAddress: accountHolder,
    //             toAddress: selectedAccount,
    //             credits: creditAmount,
    //             timestamp: new Date().toLocaleString(),
    //         };

    //         setTransactions([...transactions, transaction]);

    //         // Clear the input fields
    //         setCreditAmount(0);
    //         setSelectedAccount(accounts[0]);
    //     } catch (error) {
    //         console.error("Error transferring carbon credits:", error);
    //     }
    // };
    return (
        <button type="button" onClick={purchaseCredits}>
            Buy Credits
        </button>
    );
}
export default CreditPurchase;
