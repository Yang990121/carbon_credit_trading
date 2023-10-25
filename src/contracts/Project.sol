// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProjectContract {
    address public owner;
    uint256 public nextProjectId = 0; // Initialize the projectId counter

    struct Project {
        uint256 projectId;
        string projectTitle;
        string projectDescription;
        string companyInfo;
        uint256 emissionsOffset;
        uint256 creditsIssued;
        string financialInfo;
        string projectDocumentation;
        string verificationStatus;
        string purchaseStatus;
    }
    
    Project[] public projects;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    function createProject(
        string memory _companyInfo,
        string memory _projectTitle,
        string memory _projectDescription,
        uint256 _emissionsOffset,
        uint256 _creditsIssued,
        string memory _financialInfo,
        string memory _projectDocumentation
    ) public {
        // Check if all required fields are complete and valid
        require(bytes(_companyInfo).length > 0, "Company information is required");
        require(bytes(_projectTitle).length > 0, "Project title is required");
        require(bytes(_projectDescription).length > 0, "Project description is required");
        require(_emissionsOffset > 0, "Emissions offset must be greater than 0");
        require(bytes(_financialInfo).length > 0, "Financial information is required");
        require(bytes(_projectDocumentation).length > 0, "Documentation is required");

        // Create a new project with the provided details
        uint256 projectId = projects.length;
        Project memory newProject = Project({
            projectId: projectId,
            companyInfo: _companyInfo,
            projectTitle: _projectTitle,
            projectDescription: _projectDescription,
            emissionsOffset: _emissionsOffset,
            creditsIssued: _creditsIssued,
            financialInfo: _financialInfo,
            projectDocumentation: _projectDocumentation,
            verificationStatus: "Under Review", // Set to "Passed by AI" by default
            purchaseStatus: "Not Available" // Set to "Not available" by default
            
        });

        projects.push(newProject);
    }

    // Function to get a project by its ID
    function getProjectById(uint256 projectId) public view returns (Project memory project) {
        require(projectId < projects.length, "Project ID does not exist");
        return projects[projectId];
    }

    function getProjectInfoByCompany(string memory companyName) public view returns (
        Project memory project
    ) {
        for (uint256 i = 0; i < projects.length; i++) {
            if (keccak256(abi.encodePacked(projects[i].companyInfo)) == keccak256(abi.encodePacked(companyName))) {
                return projects[i];
            }
        }

        revert("Project not found for the given company");
    }
    
    function getProjectsByVerificationStatus(string memory _verificationStatus) public view returns (Project[] memory) {
        Project[] memory result;
        for (uint256 i = 0; i < projects.length; i++) {
            if (keccak256(abi.encodePacked(projects[i].verificationStatus)) == keccak256(abi.encodePacked(_verificationStatus))) {
                result[i] = projects[i];
            }
        }
        return result;
    }

    function updateVerificationStatus(uint256 _projectId, string memory _verificationStatus) public {
        require(_projectId < projects.length, "Project does not exist");
        
        // Get the project by projectId
        Project storage project = projects[_projectId];
        
        // Update the verification status
        project.verificationStatus = _verificationStatus;
    }

    function getProjectsByPurchaseStatus(string memory _purchaseStatus) public view returns (Project[] memory) {
        Project[] memory result;
        for (uint256 i = 0; i < projects.length; i++) {
            if (keccak256(abi.encodePacked(projects[i].purchaseStatus)) == keccak256(abi.encodePacked(_purchaseStatus))) {
                result[i] = projects[i];
            }
        }
        return result;
    }

    function getProjectsByStatus(
        string memory _verificationStatus,
        string memory _purchaseStatus
    ) public view returns (Project[] memory) {
        Project[] memory result;
        for (uint256 i = 0; i < projects.length; i++) {
            if (
                keccak256(abi.encodePacked(projects[i].verificationStatus)) == keccak256(abi.encodePacked(_verificationStatus)) &&
                keccak256(abi.encodePacked(projects[i].purchaseStatus)) == keccak256(abi.encodePacked(_purchaseStatus))
            ) {
                result[i] = projects[i];
            }
        }
        return result;
    }

    function updateCarbonCredits(uint256 projectId, uint256 newCreditsIssued) public {
        require(projectId < projects.length, "Project ID does not exist");
        Project storage project = projects[projectId];
        project.creditsIssued = newCreditsIssued;
    }

    function getAllProjects() public view returns (Project[] memory) {
        return projects;
    }

}
