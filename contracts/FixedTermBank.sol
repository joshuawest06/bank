// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {FHE, euint64} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {IERC7984} from "@openzeppelin/confidential-contracts/interfaces/IERC7984.sol";

interface IMockUSDT is IERC7984 {
    function mintTo(address to, uint256 amount) external returns (euint64);
}

contract FixedTermBank is SepoliaConfig {
    enum Term {
        OneMonth,
        SixMonths,
        OneYear,
        ThreeYears
    }

    struct Deposit {
        address owner;
        uint256 amount;
        uint64 startTimestamp;
        uint64 duration;
        uint16 months;
        bool withdrawn;
    }

    IERC7984 public immutable token;
    IMockUSDT private immutable mintableToken;

    uint256 public nextDepositId;

    mapping(uint256 => Deposit) private deposits;
    mapping(address => uint256[]) private userDeposits;

    event Deposited(address indexed user, uint256 indexed depositId, uint256 amount, Term term);
    event Withdrawn(
        address indexed user,
        uint256 indexed depositId,
        uint256 principal,
        uint256 interest
    );

    constructor(address tokenAddress) {
        require(tokenAddress != address(0), "Token address required");
        token = IERC7984(tokenAddress);
        mintableToken = IMockUSDT(tokenAddress);
        nextDepositId = 1;
    }

    function deposit(uint256 amount, Term term) external returns (uint256) {
        require(amount > 0, "Amount is zero");
        require(amount <= type(uint64).max, "Amount too large");
        require(token.isOperator(msg.sender, address(this)), "Operator approval required");

        uint64 duration = _durationFor(term);
        uint16 monthsCount = _monthsFor(term);

        uint256 depositId = nextDepositId;
        nextDepositId += 1;

        euint64 encryptedAmount = FHE.asEuint64(uint64(amount));
        token.confidentialTransferFrom(msg.sender, address(this), encryptedAmount);

        deposits[depositId] = Deposit({
            owner: msg.sender,
            amount: amount,
            startTimestamp: uint64(block.timestamp),
            duration: duration,
            months: monthsCount,
            withdrawn: false
        });

        userDeposits[msg.sender].push(depositId);

        emit Deposited(msg.sender, depositId, amount, term);
        return depositId;
    }

    function withdraw(uint256 depositId) external {
        Deposit storage userDeposit = deposits[depositId];
        require(userDeposit.owner == msg.sender, "Not deposit owner");
        require(!userDeposit.withdrawn, "Deposit withdrawn");
        require(
            block.timestamp >= userDeposit.startTimestamp + userDeposit.duration,
            "Deposit locked"
        );

        userDeposit.withdrawn = true;

        uint256 interest = calculateInterest(userDeposit.amount, userDeposit.months);

        token.confidentialTransfer(userDeposit.owner, FHE.asEuint64(uint64(userDeposit.amount)));

        if (interest > 0) {
            mintableToken.mintTo(userDeposit.owner, interest);
        }

        emit Withdrawn(userDeposit.owner, depositId, userDeposit.amount, interest);
    }

    function getDeposit(uint256 depositId) external view returns (Deposit memory) {
        return deposits[depositId];
    }

    function getUserDepositIds(address account) external view returns (uint256[] memory) {
        return userDeposits[account];
    }

    function calculateInterest(uint256 amount, uint16 monthsCount) public pure returns (uint256) {
        return (amount * monthsCount) / 100;
    }

    function preview(Term term, uint256 amount) external pure returns (uint256) {
        uint16 monthsCount = _monthsFor(term);
        return calculateInterest(amount, monthsCount);
    }

    function maturityTimestamp(uint256 depositId) external view returns (uint256) {
        Deposit memory userDeposit = deposits[depositId];
        return uint256(userDeposit.startTimestamp + userDeposit.duration);
    }

    function _durationFor(Term term) private pure returns (uint64) {
        if (term == Term.OneMonth) {
            return uint64(30 days);
        }
        if (term == Term.SixMonths) {
            return uint64(182 days);
        }
        if (term == Term.OneYear) {
            return uint64(365 days);
        }
        return uint64(3 * 365 days);
    }

    function _monthsFor(Term term) private pure returns (uint16) {
        if (term == Term.OneMonth) {
            return 1;
        }
        if (term == Term.SixMonths) {
            return 6;
        }
        if (term == Term.OneYear) {
            return 12;
        }
        return 36;
    }
}
