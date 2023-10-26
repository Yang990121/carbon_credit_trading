import React from "react";
import EthereumAccount from "../components/EthereumAccount";
import {
	Paper,
	Typography,
	Grid,
} from "@mui/material";
import ProjectGenerator from "../components/ProjectGenerator";

const DeveloperDashboard = ({
	id,
	accountHolder,
	setAccountHolder,
	selectedAccount,
	accounts,
	setSelectedAccount,
	creditAmount,
	setCreditAmount,
	issueCarbonCredits,
	getCreditBalance,
	transferCarbonCredits,
	// creditsIssuedList,
	// transactions,
	accountBalance,
	setAccounts,
	role
}) => {
	return (
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

						<p>This is your Developer Page</p>
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
			<ProjectGenerator selectedAccount={selectedAccount} role={role} />

		</div>
	);
};

export default DeveloperDashboard;
