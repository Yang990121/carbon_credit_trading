# Solidity API

## CarbonCredit

### Contract
CarbonCredit : src/contracts/CarbonCredit.sol

 --- 
### Functions:
### constructor

```solidity
constructor(string tokenName, string tokenSymbol, uint8 tokenDecimals, uint256 initialSupply) public
```

### approve

```solidity
function approve(address spender, uint256 value) public returns (bool success)
```

### transfer

```solidity
function transfer(address to, uint256 value) public returns (bool success)
```

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 value) public returns (bool success)
```

### transferCarbonCredits

```solidity
function transferCarbonCredits(address to, uint256 value) public returns (bool success)
```

### getCarbonCredits

```solidity
function getCarbonCredits(address account) public view returns (uint256)
```

 --- 
### Events:
### Transfer

```solidity
event Transfer(address from, address to, uint256 value)
```

### Approval

```solidity
event Approval(address owner, address spender, uint256 value)
```

### CarbonCreditTransferred

```solidity
event CarbonCreditTransferred(address from, address to, uint256 value)
```

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
function createProject(string _companyInfo, address _companyAddress, string _projectTitle, string _projectDescription, uint256 _emissionsOffset, uint256 _creditsIssued, string _financialInfo, string _projectDocumentation) public
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

## ProjectAdmin

### Contract
ProjectAdmin : src/contracts/ProjectAdmin.sol

 --- 
### Functions:
### constructor

```solidity
constructor(address _projectContractAddress, address _carbonCreditsAddress) public
```

### verifyProject

```solidity
function verifyProject(uint256 _projectId, bool _isCertified, uint256 _carbonCredits) public
```

### issueCarbonCredits

```solidity
function issueCarbonCredits(uint256 _projectId, uint256 amount) public returns (bool success)
```

 --- 
### Events:
### ProjectVerification

```solidity
event ProjectVerification(uint256 _projectId, string verificationStatus, uint256 carbonCredits)
```

### CarbonCreditIssued

```solidity
event CarbonCreditIssued(uint256 _projectId, uint256 amount)
```

