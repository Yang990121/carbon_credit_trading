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

    return (
        <button type="button" onClick={purchaseCredits}>
            Buy Credits
        </button>
    );
}
export default CreditPurchase;
