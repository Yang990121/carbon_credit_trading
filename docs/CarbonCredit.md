# Solidity API

## CarbonCredit

### Contract
CarbonCredit : frontend/src/contracts/CarbonCredit.sol

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

### issueCarbonCredits

```solidity
function issueCarbonCredits(address account, uint256 amount) public returns (bool success)
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

### CarbonCreditIssued

```solidity
event CarbonCreditIssued(address account, uint256 amount)
```

### CarbonCreditTransferred

```solidity
event CarbonCreditTransferred(address from, address to, uint256 value)
```

