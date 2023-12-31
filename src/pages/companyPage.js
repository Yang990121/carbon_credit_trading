import React from "react";
import EthereumAccount from "../components/EthereumAccount";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Paper,
	Typography,
	Grid,
} from "@mui/material";
import ProjectGenerator from "../components/ProjectGenerator";

const CompanyDashboard = ({
	id,
	selectedAccount,
	setSelectedAccount,
	transactions,
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

						<p>This is your Company Page</p>
						<EthereumAccount
							account={selectedAccount}
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
	);
};

export default CompanyDashboard;
