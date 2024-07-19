// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(address indexed depositor, uint256 amount);
    event Withdraw(address indexed withdrawer, uint256 amount);
    event Transfer(address indexed sender, address indexed recipient);

    constructor() payable {
        owner = payable(msg.sender);
        balance = msg.value;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner of this account");
        _;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit() public payable onlyOwner {
        balance += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public onlyOwner {
        if (balance < _withdrawAmount) {
            revert InsufficientBalance(balance, _withdrawAmount);
        }
        balance -= _withdrawAmount;
        payable(msg.sender).transfer(_withdrawAmount);
        emit Withdraw(msg.sender, _withdrawAmount);
    }

    function depositCustom(uint256 _amount) public payable onlyOwner {
        balance += _amount;
        emit Deposit(msg.sender, _amount);
    }

    function withdrawCustom(uint256 _withdrawAmount) public onlyOwner {
        if (balance < _withdrawAmount) {
            revert InsufficientBalance(balance, _withdrawAmount);
        }
        balance -= _withdrawAmount;
        payable(msg.sender).transfer(_withdrawAmount);
        emit Withdraw(msg.sender, _withdrawAmount);
    }

    function transferAccount(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "Invalid new owner address");
        emit Transfer(msg.sender, _newOwner);
        owner = payable(_newOwner);
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}
