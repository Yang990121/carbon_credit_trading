// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Project.sol"; // Import the correct contract
import "./CarbonCredit.sol";

contract ProjectAdmin {
    address public owner;
    ProjectContract public projectContract; // Use the correct data type
    CarbonCredit public ccContract; // Use the correct data type

    // Define a custom structure to store project details
    struct ProjectDetails {
        string companyName;
        string verificationStatus;
        uint256 carbonCredits;
    }

    // Event for logging project verification
    event ProjectVerification(uint256 _projectId, string verificationStatus, uint256 carbonCredits);
    // Event for logging issuing of carbon credits
    event CarbonCreditIssued(uint256 _projectId, uint256 amount);


    constructor(address _projectContractAddress, address _carbonCreditsAddress) {
        owner = msg.sender;
        projectContract = ProjectContract(_projectContractAddress);
        ccContract = CarbonCredit(_carbonCreditsAddress);
    }

    function verifyProject(uint256 _projectId, bool _isCertified, uint256 _carbonCredits) public {
        // Get the project details from ProjectContract
        ProjectContract.Project memory project = projectContract.getProjectById(_projectId);

        // Check if the project is already verified
        require(
            keccak256(abi.encodePacked(project.verificationStatus)) != keccak256(abi.encodePacked("Certified")),
            "Project verification has already been completed"
        );

        if (_isCertified) {
            // Update verification status to "Certified"
            projectContract.updateVerificationStatus(_projectId, "Certified");
            projectContract.updatePurchaseStatus(_projectId,"Available");
            // Issue carbon credits to the project
            issueCarbonCredits(_projectId, _carbonCredits);

            // Log the project verification
            emit ProjectVerification(_projectId, "Certified", _carbonCredits);
        } else {
            // Update verification status to "Rejected"
            projectContract.updateVerificationStatus(_projectId, "Rejected");

            // Log the project verification
            emit ProjectVerification(_projectId, "Rejected", 0); // No carbon credits issued
        }
    }

    // Add other functions for interacting with ProjectContract as needed
    function issueCarbonCredits(uint256 _projectId , uint256 amount) public returns (bool success) {
        require(amount > 0, "Amount must be greater than 0");
        projectContract.issueCredit(_projectId, amount);
        emit CarbonCreditIssued(_projectId, amount);

        return true;
    }
}
