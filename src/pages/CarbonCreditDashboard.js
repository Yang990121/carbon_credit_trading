import React, { useState, useEffect } from "react";
import { useWeb3 } from "../contexts/Web3Context";
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
    const [accountBalance, setAccountBalance] = useState("");
    const { web3, carbonCreditContract } = useWeb3();
    // Initial state
    const [role, setRole] = useState("company");
    const [roles, setRoles] = useState(["company", "projectDeveloper", "certifier"]);

    const getCreditList = async () => {
        // In a real application, you would send a transaction to the smart contract
        // to record the carbon credit transaction and retrieve this data from the blockchain.
        if (!web3 || !carbonCreditContract) {
            console.log("no web3 or carbonCreditContract detected");
            return;
        }

        try {
            // Send a transaction to the smart contract to record a carbon credit transaction
            await carbonCreditContract.methods.getCreditIssuedList().call()
                .then((creditList) => {
                    // creditList will contain the array of Credit structs
                    console.log("Credit issued:", creditList);
                    setCreditsIssuedList(creditList);
                })
                .catch((error) => {
                    console.error("Error getting credit list:", error);
                });


        } catch (error) {
            console.error("Error adding transaction", error);
        }
    };
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
    useEffect(() => {
        getCreditBalance();
        getCreditList();
        return;
    })


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
                        type="text"
                        placeholder="Company Name"
                        value={selectedAccount}
                        onChange={(e) => {
                            setSelectedAccount(e.target.value)
                            const selectedRole = e.target.options[e.target.selectedIndex].getAttribute("data-role");
                            setRole(selectedRole);
                        }}
                    >
                        {accounts != null ? (
                            accounts.map((account, index) => (
                                <option
                                    key={account}
                                    value={account}
                                    data-role={roles[index]}
                                >
                                    {roles[index]} | {account}

                                </option>
                            ))
                        ) : (
                            <></>
                        )}
                    </select>
                </Toolbar>
            </AppBar>

            <div style={{ display: role === "company" ? "block" : "none" }}>
                <CompanyDashboard
                    id={id}
                    accountBalance={accountBalance}
                    selectedAccount={selectedAccount}
                    accounts={accounts}
                    setSelectedAccount={setSelectedAccount}
                    creditAmount={creditAmount}
                    setCreditAmount={setCreditAmount}
                    getCreditBalance={getCreditBalance}
                    transactions={transactions}
                    creditsIssuedList={creditsIssuedList}
                    setAccounts={setAccounts}
                    role={role}
                />
            </div>
            <div style={{ display: role === "certifier" ? "block" : "none" }}>
                <CertifierDashboard
                    id={id}
                    accountBalance={accountBalance}
                    selectedAccount={selectedAccount}
                    accounts={accounts}
                    setSelectedAccount={setSelectedAccount}
                    creditAmount={creditAmount}
                    setCreditAmount={setCreditAmount}
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
                <DeveloperDashboard
                    id={id}
                    accountBalance={accountBalance}
                    selectedAccount={selectedAccount}
                    accounts={accounts}
                    setSelectedAccount={setSelectedAccount}
                    creditAmount={creditAmount}
                    setCreditAmount={setCreditAmount}
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
