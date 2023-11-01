// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Project.sol";
contract CarbonCredit {
    Credit[] public credits;
    CreditTransaction[] public creditTransactions;

    struct Credit {
        address certifier;
        uint256 issuanceTime;
        uint256 amount;
        string projectTitle;
        address projectDeveloper;
    }

    struct CreditTransaction {
        address from;
        address to;
        uint256 amount;
        uint256 timestamp;
    }
    mapping(address => uint256) public carbonCredits; // Store the number of carbon credits for each address

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event CarbonCreditTransferred(address indexed from, address indexed to, uint256 value);
    event CreditIssued(address certifier, uint256 issuanceTime, uint256 amount, string projectTitle, address projectDeveloper );   

    function transfer(address to, uint256 value) public returns (bool success) {
        require(to != address(0), "Invalid address");
        require(carbonCredits[msg.sender] >= value, "Insufficient balance");

        carbonCredits[msg.sender] -= value;
        carbonCredits[to] += value;
        emit Transfer(msg.sender, to, value);

        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool success) {
        require(to != address(0), "Invalid address");
        require(carbonCredits[from] >= value, "Insufficient balance");

        carbonCredits[from] -= value;
        carbonCredits[to] += value;
        emit Transfer(from, to, value);

        return true;
    }

    

    function transferCarbonCredits(address to, uint256 value) public returns (bool success) {
        require(to != address(0), "Invalid address");
        require(carbonCredits[msg.sender] >= value, "Insufficient carbon credits");

        carbonCredits[msg.sender] -= value;
        carbonCredits[to] += value;
        emit CarbonCreditTransferred(msg.sender, to, value);

        return true;
    }
    
    // Get the carbon credits balance of an address
    function getCarbonCredits(address account) public view returns (uint256) {
        return carbonCredits[account];
    }

    function issueCredit(Credit memory newCredit) public {
        credits.push(newCredit);
        carbonCredits[newCredit.projectDeveloper] += newCredit.amount;
        emit CarbonCredit.CreditIssued(newCredit.certifier, newCredit.issuanceTime, newCredit.amount, newCredit.projectTitle, newCredit.projectDeveloper);
    }
    
}
