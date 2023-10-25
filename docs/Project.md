# Solidity API

## ProjectContract

### Contract
ProjectContract : src/contracts/Project.sol

 --- 
### Modifiers:
### onlyOwner

```solidity
modifier onlyOwner()
```

 --- 
### Functions:
### constructor

```solidity
constructor() public
```

### createProject

```solidity
function createProject(string _companyInfo, string _projectTitle, string _projectDescription, uint256 _emissionsOffset, uint256 _creditsIssued, string _financialInfo, string _projectDocumentation) public
```

### getProjectById

```solidity
function getProjectById(uint256 projectId) public view returns (struct ProjectContract.Project project)
```

### getProjectInfoByCompany

```solidity
function getProjectInfoByCompany(string companyName) public view returns (struct ProjectContract.Project project)
```

### getProjectsByVerificationStatus

```solidity
function getProjectsByVerificationStatus(string _verificationStatus) public view returns (struct ProjectContract.Project[])
```

### updateVerificationStatus

```solidity
function updateVerificationStatus(uint256 _projectId, string _verificationStatus) public
```

### getProjectsByPurchaseStatus

```solidity
function getProjectsByPurchaseStatus(string _purchaseStatus) public view returns (struct ProjectContract.Project[])
```

### getProjectsByStatus

```solidity
function getProjectsByStatus(string _verificationStatus, string _purchaseStatus) public view returns (struct ProjectContract.Project[])
```

### updateCarbonCredits

```solidity
function updateCarbonCredits(uint256 projectId, uint256 newCreditsIssued) public
```

### getAllProjects

```solidity
function getAllProjects() public view returns (struct ProjectContract.Project[])
```

