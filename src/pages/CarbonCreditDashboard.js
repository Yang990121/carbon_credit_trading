import React, { useState, useEffect, useRef } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import EthereumAccount from "../components/EthereumAccount";
import { useParams } from "react-router-dom";
import CompanyDashboard from "./companyPage";
import DeveloperDashboard from "./developerPage";
import CertifierDashboard from "./certifierPage";
import {
    Typography,
    AppBar,
    Toolbar
} from "@mui/material";

function CarbonCreditDashboard() {
    const [creditsIssuedList, setCreditsIssuedList] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [creditAmount, setCreditAmount] = useState(0);
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState("");
    const [accountHolder, setAccountHolder] = useState("");
    const [accountBalance, setAccountBalance] = useState("");
    const { web3, carbonCreditContract } = useWeb3();
    // Initial state
    const [role, setRole] = useState("company");
    // Handle dropdown change
    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    useEffect(() => {
        if (accounts != null) {
            setSelectedAccount(accounts[0]);
        }
    }, [accounts]);

    const issueCarbonCredits = async () => {
        // In a real application, you would send a transaction to the smart contract
        // to record the carbon credit transaction and retrieve this data from the blockchain.
        if (!web3 || !carbonCreditContract) {
            console.log("no web3 or carbonCreditContract detected");
            return;
        }

        try {
            // Convert the credit amount to the contract's required format (if needed)
            // const creditAmountWei = etherToWei(creditAmount.toString(), 'ether');
            if (
                web3.utils.toChecksumAddress(accountHolder) ===
                web3.utils.toChecksumAddress(selectedAccount)
            ) {
                // Send a transaction to the smart contract to record a carbon credit transaction
                const txResult = await carbonCreditContract.methods
                    .issueCarbonCredits(selectedAccount, creditAmount)
                    .send({
                        from: selectedAccount, // Use the selected Ethereum account
                    });

                console.log("Carbon credits issued:", txResult);
            } else {
                console.error(
                    "Only the account holder can issue carbon credits"
                );
            }
            const newCreditIssue = {
                address: selectedAccount,
                credits: creditAmount,
                timestamp: new Date().toLocaleString(),
            };

            setCreditsIssuedList([...creditsIssuedList, newCreditIssue]);

            // Clear the input fields
            setCreditAmount(0);
            setSelectedAccount(accounts[0]);
        } catch (error) {
            console.error("Error adding transaction", error);
        }
    };

    const transferCarbonCredits = async () => {
        try {
            // Transfer carbon credits
            const txResult = await carbonCreditContract.methods
                .transferCarbonCredits(selectedAccount, creditAmount)
                .send({
                    from: accountHolder, // Use the selected Ethereum account
                });

            console.log("Carbon credits transferred:", txResult);

            // Update the UI or perform any other actions after the transaction is successful
            const transaction = {
                fromAddress: accountHolder,
                toAddress: selectedAccount,
                credits: creditAmount,
                timestamp: new Date().toLocaleString(),
            };

            setTransactions([...transactions, transaction]);

            // Clear the input fields
            setCreditAmount(0);
            setSelectedAccount(accounts[0]);
        } catch (error) {
            console.error("Error transferring carbon credits:", error);
        }
    };

    const getCreditBalance = async () => {
        if (!web3 || !carbonCreditContract) {
            return;
        }

        try {
            const creditBalance = await carbonCreditContract.methods
                .getCarbonCredits(selectedAccount)
                .call();
            console.log("Get Credits Balance:", creditBalance);
            setAccountBalance(creditBalance);
        } catch (error) {
            console.error("Error getting credit balance", error);
        }
    };
    let { id } = useParams();
    return (
        <div className="carbon-trading-app">
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Carbon Credit Trading Dashboard
                    </Typography>
                    <select
                        defaultValue="none"
                        style={{ float: "right" }}
                        onChange={(e) => handleRoleChange(e)}
                    >
                        <option value="company">Company</option>
                        <option value="projectDeveloper">
                            Project Developer
                        </option>
                        <option value="certifier">Certifier</option>
                    </select>
                </Toolbar>
            </AppBar>

            <div style={{ display: role === "company" ? "block" : "none" }}>
                <h1>this is company display</h1>
                <CompanyDashboard
                    id={id}
                    accountBalance={accountBalance}
                    accountHolder={accountHolder}
                    selectedAccount={selectedAccount}
                    setAccountHolder={setAccountHolder}
                    accounts={accounts}
                    setSelectedAccount={setSelectedAccount}
                    creditAmount={creditAmount}
                    setCreditAmount={setCreditAmount}
                    issueCarbonCredits={issueCarbonCredits}
                    getCreditBalance={getCreditBalance}
                    transactions={transactions}
                    creditsIssuedList={creditsIssuedList}
                    setAccounts={setAccounts}
                    role={role}
                />
            </div>
            <div style={{ display: role === "certifier" ? "block" : "none" }}>
                <h1>this is certifier display</h1>
                <CertifierDashboard
                    id={id}
                    accountBalance={accountBalance}
                    accountHolder={accountHolder}
                    selectedAccount={selectedAccount}
                    setAccountHolder={setAccountHolder}
                    accounts={accounts}
                    setSelectedAccount={setSelectedAccount}
                    creditAmount={creditAmount}
                    setCreditAmount={setCreditAmount}
                    issueCarbonCredits={issueCarbonCredits}
                    getCreditBalance={getCreditBalance}
                    transactions={transactions}
                    creditsIssuedList={creditsIssuedList}
                    setAccounts={setAccounts}
                    role={role}
                />

            </div>
            <div
                style={{
                    display: role === "projectDeveloper" ? "block" : "none",
                }}
            >
                <h1>this is project developer display</h1>
                <DeveloperDashboard
                    id={id}
                    accountBalance={accountBalance}
                    accountHolder={accountHolder}
                    selectedAccount={selectedAccount}
                    setAccountHolder={setAccountHolder}
                    accounts={accounts}
                    setSelectedAccount={setSelectedAccount}
                    creditAmount={creditAmount}
                    setCreditAmount={setCreditAmount}
                    issueCarbonCredits={issueCarbonCredits}
                    getCreditBalance={getCreditBalance}
                    transactions={transactions}
                    creditsIssuedList={creditsIssuedList}
                    setAccounts={setAccounts}
                    role={role}
                />
            </div>
        </div>
    );

}

export default CarbonCreditDashboard;
