import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useWeb3 } from "../contexts/Web3Context";
import CircularProgress from "@mui/material/CircularProgress";

function PopupButton({ project, projectId, selectedAccount }) {
	const [open, setOpen] = useState(false);
	const [credits, setCredits] = useState(0);
	const [verificationSuccess, setVerificationSuccess] = useState(null);
	const { projectAdminContract } = useWeb3();
	const [isAcceptLoading, setIsAcceptLoading] = useState(false);
	const [isRejectLoading, setIsRejectLoading] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	useEffect(() => {
		if (project) {
			calculateCredits();
			return;
		}
	})
	const calculateCredits = () => {
		const emissionsOffset = project[5];
		const convertToTon = 100000;
		const rate = 1.65;
		const credits = emissionsOffset / convertToTon * rate
		setCredits(parseInt(credits));
	}
	const verifyProject = async (approval) => {
		if (approval) {
			setIsAcceptLoading(true);
		} else {
			setIsRejectLoading(true);
		}
		if (!projectAdminContract || !selectedAccount) {
			console.log(
				"project admin contract or selected account not available"
			);
			return;
		}

		// Ensure _carbonCredits is a valid positive number greater than zero
		if (approval && (!/^\d+$/.test(credits) || credits <= 0)) {
			console.error("Invalid _carbonCredits value");
			return;
		}

		try {
			await projectAdminContract.methods
				.verifyProject(project[0], approval, credits)
				.send({
					from: selectedAccount,
				});
			console.log("Project verified successfully");
			if (approval) {
				setVerificationSuccess(true);
			} else {
				setVerificationSuccess(false);
			}
		} catch (error) {
			console.error("Error calling the contract:", error);
			setVerificationSuccess(false);
		}
		handleClose();
		setIsAcceptLoading(false);
		setIsRejectLoading(false);

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
							isAcceptLoading ? <CircularProgress size={24} /> : null
						}
						disabled={isAcceptLoading}
					>
						Accept
					</Button>
					<Button
						onClick={() => verifyProject(false)}
						color="error"
						autoFocus
						startIcon={
							isRejectLoading ? <CircularProgress size={24} /> : null
						}
						disabled={isRejectLoading}
					>
						Reject
					</Button>
				</DialogActions>
			</Dialog>
			{verificationSuccess === true && <p>Project verified successfully!</p>}
			{verificationSuccess === false &&
				<p>Verification rejected successfully.</p>
			}
		</div>
	);
}

export default PopupButton;
