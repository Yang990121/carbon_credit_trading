import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Typography,
} from "@mui/material";
import { useWeb3 } from "../contexts/Web3Context";
import { camelCaseToTitleCase } from "../utils/mappers";
import CreditPurchase from "./CreditPurchase";
import PopupButton from "../pages/CertifyModal";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

function ProjectGenerator({ selectedAccount, role }) {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState(projects);
    const [selectedStatus, setSelectedStatus] = useState("");
    const { projectContract, setProjectContract } = useWeb3();
    const [isLoading, setIsLoading] = useState(false);

    var tableHeaders = [
        "projectId",
        "companyInfo",
        "projectTitle",
        "projectDescription",
        "emissionsOffset",
        "creditsIssued",
        "financialInfo",
        "projectDocumentation",
        "purchaseStatus",
        "verificationStatus",
    ];
    if (role === "company") {
        tableHeaders = [
            "projectId",
            "companyInfo",
            "projectTitle",
            "projectDescription",
            "creditsIssued",
        ];
    } else if (role === "certifier") {
        tableHeaders = [
            "projectId",
            "companyInfo",
            "projectTitle",
            "projectDescription",
            "emissionsOffset",
            "creditsIssued",
            "financialInfo",
            "projectDocumentation",
            "verificationStatus",
        ];
    }

    useEffect(() => {
        if (projectContract) {
            loadProjects();
            return;
        }
    });

    const fetchProjectData = async () => {
        try {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 3000));
            const response = await fetch("/projectData.csv"); // Update the path to your CSV file
            const data = await response.text();
            const rows = data.split("\n");
            const randomRowIndex = Math.floor(Math.random() * rows.length);
            const randomRow = rows[randomRowIndex];

            // You can parse the CSV data into an object or array as needed
            // Example: Parse a CSV row into an array
            const projectDataRow = randomRow.split("\t");

            projectContract.methods
                .createProject(
                    projectDataRow[0],
                    projectDataRow[1],
                    projectDataRow[2],
                    projectDataRow[3],
                    projectDataRow[4],
                    projectDataRow[5],
                    projectDataRow[6]
                )
                .send({ from: selectedAccount })
                .on("confirmation", (confirmationNumber, receipt) => {
                    loadProjects();
                    setIsLoading(false);
                })
                .on("error", (error, receipt) => {
                    // Transaction error
                    console.error("Unable to create project");
                });
        } catch (error) {
            console.error("Error fetching project data:", error);
            setIsLoading(false);
        }
    };

    const loadProjects = async () => {
        if (!projectContract) {
            console.log("no project contract");
            return;
        }
        try {
            if (role === "company") {
                getProjectsByStatus("Certified", "Available");
            } else {
                setProjects(
                    await projectContract.methods.getAllProjects().call()
                );
            }
        } catch (error) {
            console.error("Error loading projects:", error);
        }

        filterProjects(selectedStatus);
    };

    const getProjectsByStatus = async (
        _verificationStatus,
        _purchaseStatus
    ) => {
        if (projectContract) {
            try {
                const projects = await projectContract.methods
                    .getProjectsByStatus(_verificationStatus, _purchaseStatus)
                    .call();

                setProjects(projects);
                // Do something with the retrieved projects
            } catch (error) {
                console.error("Error calling the contract:", error);
            }
        }
    };
    function getStatusColor(header, status) {
        if (header === "verificationStatus") {
            switch (status) {
                case "Under Review":
                    return "red"; // Style as red
                case "Certified":
                    return "blue"; // Style as blue
                case "Rejected":
                    return "grey"; // Style as green
                default:
                    return "black"; // Default text color
            }
        } else if (header === "purchaseStatus") {
            switch (status) {
                case "Not Available":
                    return "red"; // Style as red
                case "Available":
                    return "green"; // Style as green
                default:
                    return "black"; // Default text color
            }
        } else {
            // Return the default text color for other headers
            return "black";
        }
    }

    const filterProjects = (status) => {
        if (status === "") {
            setFilteredProjects(projects); // No filter selected, show all projects
        } else {
            console.log(status);
            const filtered = projects.filter(
                (project) => project.verificationStatus === status
            );

            setFilteredProjects(filtered);
        }
    };

    return (
        <>
            <Paper
                elevation={3}
                style={{ marginBottom: "20px", padding: "20px" }}
            >
                <Typography variant="h5" style={{ color: "rgb(25, 118, 210)" }}>
                    Projects
                    {role === "certifier" ? (
                        <select
                            value={selectedStatus}
                            style={{ marginLeft: "10px" }}
                            onChange={(e) => {
                                setSelectedStatus(e.target.value);
                                filterProjects(e.target.value);
                            }}
                        >
                            <option value="">All</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Certified">Certified</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    ) : (
                        <></>
                    )}
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            {tableHeaders.map((header, index) => (
                                <TableCell key={index}>
                                    {camelCaseToTitleCase(header)}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProjects
                            ? filteredProjects.map((project, index) => (
                                <TableRow key={index}>
                                    {tableHeaders.map(
                                        (header, headerIndex) => (
                                            <TableCell
                                                key={headerIndex}
                                                style={{
                                                    color: getStatusColor(
                                                        header,
                                                        project[header]
                                                    ),
                                                }}
                                            >
                                                {project[header]}
                                                {role === "certifier" &&
                                                    header ===
                                                    "verificationStatus" &&
                                                    project[header] !==
                                                    "Certified" ? (
                                                    <>
                                                        <PopupButton
                                                            projectId={
                                                                project[0]
                                                            }
                                                            selectedAccount={
                                                                selectedAccount
                                                            }
                                                        />
                                                    </>
                                                ) : (
                                                    <></>
                                                )}
                                            </TableCell>
                                        )
                                    )}

                                    {role === "company" ? (
                                        <CreditPurchase
                                            account={selectedAccount}
                                            project={project}
                                            projects={projects}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </TableRow>
                            ))
                            : null}
                    </TableBody>
                </Table>
            </Paper>
            {role === "projectDeveloper" ? (
                <Button
                    onClick={fetchProjectData}
                    variant="outlined"
                    startIcon={
                        isLoading ? <CircularProgress size={24} /> : null
                    }
                    disabled={isLoading}
                >
                    {isLoading ? "Loading..." : "Create Project"}
                </Button>
            ) : (
                <></>
            )}
        </>
    );
}

export default ProjectGenerator;
