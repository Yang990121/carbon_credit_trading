import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function PopupButton() {
	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<Button
				variant="outlined"
                size="small"
				color="primary"
				onClick={handleClickOpen}
			>
				Unnamed popup button
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>{"Pop up title"}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						???? Carbon credit popup
                        <br />
                        Issue Carbon Credits:
						<input
							type="number"
							placeholder="Credit Amount"
							value={0}
							style={{
								marginTop: "10px",
								marginLeft: "10px",
							}}
							// onChange={(e) =>
							// 	setCreditAmount(
							// 		parseInt(e.target.value, 10)
							// 	)
							// }
						/>
					</DialogContentText>
				</DialogContent>

				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Accept
					</Button>
					<Button onClick={handleClose} color="error" autoFocus>
						Reject
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default PopupButton;
