// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./CarbonCredit.sol";

contract ProjectContract {
    address public owner;
    uint256 public nextProjectId = 0; // Initialize the projectId counter
    CarbonCredit public carbonCreditContract;

    struct Project {
        uint256 projectId;
        address creator;
        string companyInfo;
        string projectTitle;
        string projectDescription;
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
    
    constructor(address _carbonCreditContractAddress) {
        owner = msg.sender;
        carbonCreditContract = CarbonCredit(_carbonCreditContractAddress);

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

        // Capture the address of the caller (the creator)
        address creator = msg.sender;

        // Create a new project with the provided details
        uint256 projectId = projects.length;
        Project memory newProject = Project({
            projectId: projectId,
            creator: creator,  // Store the creator's address
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
        uint256 count = 0;

        // First, count the number of projects that match the verification status
        for (uint256 i = 0; i < projects.length; i++) {
            if (keccak256(abi.encodePacked(projects[i].verificationStatus)) == keccak256(abi.encodePacked(_verificationStatus))) {
                count++;
            }
        }

        // Create a dynamic array to store the matching projects
        Project[] memory result = new Project[](count);
        uint256 resultIndex = 0;

        // Populate the result array with matching projects
        for (uint256 i = 0; i < projects.length; i++) {
            if (keccak256(abi.encodePacked(projects[i].verificationStatus)) == keccak256(abi.encodePacked(_verificationStatus))) {
                result[resultIndex] = projects[i];
                resultIndex++;
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

    function getProjectsByStatus(string memory _verificationStatus, string memory _purchaseStatus) public view returns (Project[] memory) {
        uint256 count = 0;

        // First, count the number of projects that match both the verification and purchase status
        for (uint256 i = 0; i < projects.length; i++) {
            if (
                keccak256(abi.encodePacked(projects[i].verificationStatus)) == keccak256(abi.encodePacked(_verificationStatus)) &&
                keccak256(abi.encodePacked(projects[i].purchaseStatus)) == keccak256(abi.encodePacked(_purchaseStatus))
            ) {
                count++;
            }
        }

        // Create a dynamic array to store the matching projects
        Project[] memory result = new Project[](count);
        uint256 resultIndex = 0;

        // Populate the result array with matching projects
        for (uint256 i = 0; i < projects.length; i++) {
            if (
                keccak256(abi.encodePacked(projects[i].verificationStatus)) == keccak256(abi.encodePacked(_verificationStatus)) &&
                keccak256(abi.encodePacked(projects[i].purchaseStatus)) == keccak256(abi.encodePacked(_purchaseStatus))
            ) {
                result[resultIndex] = projects[i];
                resultIndex++;
            }
        }

        return result;
    }

    function updatePurchaseStatus(uint256 projectId, string memory purchaseStatus) public {
        require(projectId < projects.length, "Project ID does not exist");
        Project storage project = projects[projectId];
        project.purchaseStatus = purchaseStatus;
    }

    function getAllProjects() public view returns (Project[] memory) {
        return projects;
    }

    function issueCredit(uint256 project_id, uint256 _amount) public {
        require(project_id < projects.length, "Project ID does not exist");
        require(_amount > 0, "Credits must be more than 0");
        Project storage project = projects[project_id];
        project.creditsIssued += _amount;

        // // Example: Allow anyone to issue credits
        CarbonCredit.Credit memory newCredit = CarbonCredit.Credit({
            certifier: msg.sender,
            issuanceTime: block.timestamp,
            amount: _amount,
            projectTitle: project.projectTitle,
            projectDeveloper: project.creator
        });

        carbonCreditContract.issueCredit(newCredit);
    }
}
