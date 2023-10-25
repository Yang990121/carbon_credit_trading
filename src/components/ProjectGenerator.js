import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Typography,
} from "@mui/material";
import { useWeb3 } from '../contexts/Web3Context';

function ProjectGenerator({ selectedAccount }) {
    const [projectData, setProjectData] = useState({});
    const [projects, setProjects] = useState([]);
    const { projectContract } = useWeb3();
    const tableHeaders = ["project_id", "company_name", "project_title", "project_description", "emissionsoffset", "credits_issued", "financial_description", "project_documentation"];

    useEffect(() => {
        loadProjects();
    }, [projectContract])

    const fetchProjectData = async () => {
        try {
            const response = await fetch('/projectData.csv'); // Update the path to your CSV file
            const data = await response.text();
            const rows = data.split('\n');
            const randomRowIndex = Math.floor(Math.random() * rows.length);
            const randomRow = rows[randomRowIndex];

            // You can parse the CSV data into an object or array as needed
            // Example: Parse a CSV row into an array
            const projectDataRow = randomRow.split('\t');

            // Create a new project and add it to the projects list
            const newProject = {
                company_name: projectDataRow[0],
                project_title: projectDataRow[1],
                project_description: projectDataRow[2],
                emissionsoffset: projectDataRow[3],
                credits_issued: projectDataRow[4],
                financial_description: projectDataRow[5],
                project_documentation: projectDataRow[6],
            };

            projectContract.methods.createProject(
                projectDataRow[0],
                projectDataRow[1],
                projectDataRow[2],
                projectDataRow[3],
                projectDataRow[4],
                projectDataRow[5],
                projectDataRow[6]
            )
                .send({ from: selectedAccount })
                // .on('transactionHash', (hash) => {
                //     // Transaction sent
                //     console.log(hash)
                //     console.log(projects);
                // })
                // .on('receipt', (receipt) => {

                //     // Transaction receipt received
                //     console.log(receipt)

                // })
                .on('confirmation', (confirmationNumber, receipt) => {

                    // Transaction confirmed
                    console.log(receipt)
                    loadProjects();

                })
                .on('error', (error, receipt) => {
                    // Transaction error
                    console.error("Unable to create project")
                });
        } catch (error) {
            console.error('Error fetching project data:', error);
        }
    }

    const loadProjects = async () => {
        // if (!projectContract) {
        //     throw new Error('Project contract not deployed on the current network');
        // }

        try {
            setProjects(await projectContract.methods.getAllProjects().call());
        } catch (error) {
            console.error("Error loading projects:", error);
        }
    }
    return (
        <>
            <Paper
                elevation={3}
                style={{ marginBottom: "20px", padding: "20px" }}
            >
                <Typography
                    variant="h5"
                    style={{ color: "rgb(25, 118, 210)" }}
                >
                    Projects
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            {tableHeaders.map((header, index) => (
                                <TableCell key={index}>{header}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projects ? projects.map((project, index) => (

                            <TableRow key={index}>
                                {tableHeaders.map((header, headerIndex) => (
                                    <TableCell key={headerIndex}>{project[headerIndex]}</TableCell>
                                ))}
                            </TableRow>
                        )) : null}
                    </TableBody>
                </Table>
            </Paper>
            <button onClick={fetchProjectData}>Create Project</button>
        </>
    );
}

export default ProjectGenerator;
