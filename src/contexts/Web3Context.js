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
                '0x36509c1bcBC2CcE2af89bCc8756c4E6Ec36BEF69'
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
                '0x253cb6e024423D6342cd6071a9462Ee8e580e3CA'
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
                '0x966DC4415F159d1b8e81636897061877CD093b06'
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
