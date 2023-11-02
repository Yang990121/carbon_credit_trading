// Web3Context.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import CarbonCreditContract from '../contracts/artifacts/CarbonCredit.json';
import ProjectContract from '../contracts/artifacts/ProjectContract.json'
import ProjectAdminContract from '../contracts/artifacts/ProjectAdmin.json';
const Web3Context = createContext();

export function Web3Provider({ children }) {
    const [web3, setWeb3] = useState(null);
    const [carbonCreditContract, setCarbonCreditContract] = useState(null);
    const [projectContract, setProjectContract] = useState(null);
    const [projectAdminContract, setProjectAdminContract] = useState(null);
    const [selectedAccount, setSelectedAccount] = useState("");

    useEffect(() => {
        // Check if the Ethereum provider (e.g., MetaMask) is available
        if (window.ethereum) {

            // Request account access using eth_requestAccounts
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(() => {
                    console.log('Connected to MetaMask');
                    setWeb3(new Web3(window.ethereum));
                })
                .catch((error) => {
                    console.error('User denied account access');
                });
        } else {
            // Handle the case where there's no Ethereum provider available
            console.error('No web3 provider detected. Please install MetaMask or use a dApp browser.');
        }

    }, []);

    useEffect(() => {
        if (web3) {
            getCarbonCreditContract(web3);
            getProjectContract(web3);
            getProjectAdminContract(web3);
        }
    }, [web3])

    // CarbonCredit.sol
    // Get Carbon Credit Contract
    const getCarbonCreditContract = async (web3) => {
        try {
            const contractInstance = new web3.eth.Contract(
                CarbonCreditContract.abi,
                '0xC6aad973A8A8e3EBBEe10e0F7aDA909Be168cb3d'
            );
            setCarbonCreditContract(contractInstance);
        } catch (error) {
            console.error('Error connecting to Web3', error);
        }
    }

    // Project.sol
    // Create Project
    const getProjectContract = async (web3) => {
        try {

            // const networkId = await web3.eth.net.getId();
            // const contractData = ProjectContract.networks[networkId];
            const contractInstance = new web3.eth.Contract(
                ProjectContract.abi,
                '0x981907D55685B8C67454d0561Ca6f3e5F229A918'
            );
            setProjectContract(contractInstance);
        } catch (error) {
            console.error('Error connecting to Web3', error);
        }
    }

    const getProjectAdminContract = async (web3) => {
        try {

            // const networkId = await web3.eth.net.getId();
            // const contractData = ProjectContract.networks[networkId];
            const contractInstance = new web3.eth.Contract(
                ProjectAdminContract.abi,
                '0x9dec265D6dcEb7F35ad17b08617fB31a6E1da152'
            );
            setProjectAdminContract(contractInstance);
        } catch (error) {
            console.error('Error connecting to Web3', error);
        }
    }
    return (
        <Web3Context.Provider value={{ web3, carbonCreditContract, projectContract, projectAdminContract }}>
            {children}
        </Web3Context.Provider>
    );


}

export function useWeb3() {
    return useContext(Web3Context);
}
