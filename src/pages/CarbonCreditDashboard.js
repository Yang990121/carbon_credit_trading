import React, { useState, useEffect } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import EthereumAccount from "../components/EthereumAccount";
import { useParams } from "react-router-dom";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Paper,
	Typography,
	Grid,
	AppBar,
	Toolbar,
} from "@mui/material";
// import { Select, MenuItem } from "@material-ui/core";
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
		console.log("role", role);
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
			console.log(web3);
			console.log(carbonCreditContract);
			console.log("no web3 or carbonCreditContract detected");
			return;
		}

		try {
			// Convert the credit amount to the contract's required format (if needed)
			// const creditAmountWei = etherToWei(creditAmount.toString(), 'ether');
			console.log(accountHolder);
			console.log(selectedAccount);
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
						<option value="projectDeveloper">Project Developer</option>
						<option value="certifier">Certifier</option>
					</select>
				</Toolbar>
			</AppBar>
			

			<div style={{ display: role === "company" ? "block" : "none" }}>
				<h1>this is company display</h1>
			</div>
            <div style={{ display: role === "certifier" ? "block" : "none" }}>
				<h1>this is certifier display</h1>
			</div>
            <div style={{ display: role === "projectDeveloper" ? "block" : "none" }}>
				<h1>this is project developer display</h1>
			</div>

			<div style={{ margin: "20px" }}>
				<Grid container spacing={3}>
					<Grid item xs={6}>
						<Paper
							elevation={3}
							style={{
								marginBottom: "20px",
								padding: "20px",
								height: "200px",
							}}
						>
							<Typography
								variant="h4"
								style={{
									display: "block",
									// backgroundColor: "blue",
									padding: "10px 0",
									textAlign: "left",
									width: "100%",
									top: 0,
									color: "rgb(25, 118, 210)",
								}}
							>
								Hello there user {id}
							</Typography>

							<p>This is your awesome User Profile page</p>
							<EthereumAccount
								myAccount={accountHolder}
								setMyAccount={setAccountHolder}
								account={selectedAccount}
								accounts={accounts}
								setAccount={setSelectedAccount}
								setAccounts={setAccounts}
							/>
						</Paper>
					</Grid>
					<Grid item xs={6} className="credit-balance">
						<Paper
							elevation={3}
							style={{
								marginBottom: "20px",
								padding: "20px",
								height: "200px",
							}}
						>
							<div className="transaction-form">
								<label
									style={{
										marginBottom: "10px",
										color: "rgb(25, 118, 210)",
									}}
								>
									Select Company Account:
								</label>
								<select
									type="text"
									placeholder="Company Name"
									value={selectedAccount}
									style={{
										marginTop: "10px",
										marginLeft: "10px",
									}}
									onChange={(e) =>
										setSelectedAccount(e.target.value)
									}
								>
									{accounts != null ? (
										accounts.map((account) => (
											<option
												key={account}
												value={account}
											>
												{account}
											</option>
										))
									) : (
										<></>
									)}
								</select>
								<br />
								<input
									type="number"
									placeholder="Credit Amount"
									value={creditAmount}
									style={{
										marginTop: "10px",
										marginLeft: "10px",
									}}
									onChange={(e) =>
										setCreditAmount(
											parseInt(e.target.value, 10)
										)
									}
								/>
								<br />
								<button
									onClick={issueCarbonCredits}
									style={{
										marginBottom: "10px",
										marginTop: "15px",
									}}
								>
									Issue Carbon Credits
								</button>
								<button
									onClick={getCreditBalance}
									style={{ marginLeft: "10px" }}
								>
									Get Credit Balance
								</button>
								<button
									onClick={transferCarbonCredits}
									style={{ marginLeft: "20px" }}
								>
									Transfer Credit
								</button>
							</div>
							<Typography
								variant="h5"
								style={{ marginTop: "20px" }}
							>
								Credit Balance: {accountBalance}
							</Typography>
						</Paper>
					</Grid>
				</Grid>
				<div className="credit-list">
					<Paper
						elevation={3}
						style={{ marginBottom: "20px", padding: "20px" }}
					>
						<Typography
							variant="h5"
							style={{ color: "rgb(25, 118, 210)" }}
						>
							List of Credits Issued
						</Typography>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Issuer</TableCell>
									<TableCell>Credits</TableCell>
									<TableCell>Timestamp</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{creditsIssuedList.map((credit, index) => (
									<TableRow key={index}>
										<TableCell>{credit.address}</TableCell>
										<TableCell>{credit.credits}</TableCell>
										<TableCell>
											{credit.timestamp}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Paper>
				</div>

				<div className="transaction-list">
					<Paper
						elevation={3}
						style={{ marginBottom: "20px", padding: "20px" }}
					>
						<Typography
							variant="h5"
							style={{ color: "rgb(25, 118, 210)" }}
						>
							Recent Transactions
						</Typography>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>From</TableCell>
									<TableCell>To</TableCell>
									<TableCell>Credits</TableCell>
									<TableCell>Timestamp</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{transactions.map((transaction, index) => (
									<TableRow key={index}>
										<TableCell>
											{transaction.fromAddress}
										</TableCell>
										<TableCell>
											{transaction.toAddress}
										</TableCell>
										<TableCell>
											{transaction.credits}
										</TableCell>
										<TableCell>
											{transaction.timestamp}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Paper>
				</div>
			</div>
		</div>
	);
}

export default CarbonCreditDashboard;
