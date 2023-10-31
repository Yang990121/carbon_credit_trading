import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useWeb3 } from "../contexts/Web3Context";
import CircularProgress from "@mui/material/CircularProgress";

function PopupButton({ projectId, selectedAccount }) {
	const [open, setOpen] = useState(false);
	const [credits, setCredits] = useState(0);
	const [loading, setLoading] = useState(false);
	const [verificationSuccess, setVerificationSuccess] = useState(null);
	const { projectAdminContract } = useWeb3();
	const [isLoading, setIsLoading] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const verifyProject = async (approval) => {
		setIsLoading(true);
		if (!projectAdminContract || !selectedAccount) {
			console.log(selectedAccount);
			console.log(projectAdminContract);
			console.log(
				"project admin contract or selected account not available"
			);
			return;
		}

		// Ensure _carbonCredits is a valid positive number greater than zero
		if (!/^\d+$/.test(credits) || credits <= 0) {
			console.error("Invalid _carbonCredits value");
			return;
		}

		try {
			await projectAdminContract.methods
				.verifyProject(projectId, approval, credits)
				.send({
					from: selectedAccount,
				});
			console.log("Project verified successfully");
			setVerificationSuccess(true);
		} catch (error) {
			console.error("Error calling the contract:", error);
			setVerificationSuccess(false);
		} finally {
			setLoading(false);
		}

		handleClose();
		setIsLoading(false);
	};

	return (
		<div>
			<Button
				variant="outlined"
				size="small"
				color="primary"
				onClick={handleClickOpen}
			>
				Certify
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>{"Certify Project"}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Issue Carbon Credits:
						<input
							type="number"
							placeholder="Credit Amount"
							value={credits}
							style={{
								marginTop: "10px",
								marginLeft: "10px",
							}}
							onChange={(e) =>
								setCredits(parseInt(e.target.value, 10))
							}
						/>
					</DialogContentText>
				</DialogContent>

				<DialogActions>
					<Button
						onClick={() => verifyProject(true)}
						color="primary"
						startIcon={
							isLoading ? <CircularProgress size={24} /> : null
						}
						disabled={isLoading}
					>
						Accept
					</Button>
					<Button
						onClick={() => verifyProject(false)}
						color="error"
						autoFocus
					>
						Reject
					</Button>
				</DialogActions>
			</Dialog>
			{loading && <p>Verifying project...</p>}
			{verificationSuccess && <p>Project verified successfully!</p>}
			{verificationSuccess === false && !loading && (
				<p>Verification failed. Please try again.</p>
			)}
		</div>
	);
}

export default PopupButton;
