import React, { useState, useEffect } from 'react';

function EthereumAccount({ account, accounts, setAccount, setAccounts }) {
    const [error, setError] = useState('');
    // Use useEffect to automatically run connectToMetaMask when the component mounts
    useEffect(() => {
        connectToMetaMask();
    }, []); // The empty dependency array ensures this runs only once when mounted


    const connectToMetaMask = async () => {
        try {
            const ethereumAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (!accounts) {
                setAccounts(ethereumAccounts);
                setAccount(ethereumAccounts[0]);
            }

        } catch (err) {
            if (err.code === 4001) {
                setError('Please connect to MetaMask.');
            } else {
                setError(err.message);
            }
        }
    };

    return (
        <div>
            <button onClick={connectToMetaMask}>Connect to MetaMask</button>
            {account && <p>Your Ethereum account: {account}</p>}
            {error && <p>Error: {error}</p>}
        </div>
    );
}

export default EthereumAccount;
