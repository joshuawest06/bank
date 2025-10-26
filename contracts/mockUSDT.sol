// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {FHE, euint64, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {ERC7984} from "@openzeppelin/confidential-contracts/token/ERC7984/ERC7984.sol";

/// @title MockUSDT Confidential Token
/// @notice ERC7984-compatible mock token used for testing the FixedTermBank contract.
contract MockUSDT is ERC7984, SepoliaConfig {
    uint256 private constant MAX_AMOUNT = type(uint64).max;

    constructor() ERC7984("Mock USDT", "mUSDT", "https://mockusdt.example/contract.json") {}

    /// @notice Mint tokens with a clear-text amount.
    /// @param amount Amount with 6 decimals to mint.
    function mint(uint256 amount) external returns (euint64) {
        return _mintWithClearAmount(msg.sender, amount);
    }

    /// @notice Mint tokens to a recipient using a clear-text amount.
    /// @param to Recipient address.
    /// @param amount Amount with 6 decimals to mint.
    function mintTo(address to, uint256 amount) external returns (euint64) {
        return _mintWithClearAmount(to, amount);
    }

    /// @notice Mint tokens by providing an encrypted payload and proof.
    /// @param encryptedAmount Ciphertext handle provided by the relayer.
    /// @param inputProof Proof associated with the encrypted payload.
    function mintEncrypted(externalEuint64 encryptedAmount, bytes calldata inputProof) external returns (euint64) {
        return _mint(msg.sender, FHE.fromExternal(encryptedAmount, inputProof));
    }

    /// @notice Mint tokens to a recipient from an encrypted payload and proof.
    /// @param to Recipient address.
    /// @param encryptedAmount Ciphertext handle provided by the relayer.
    /// @param inputProof Proof associated with the encrypted payload.
    function mintEncryptedTo(
        address to,
        externalEuint64 encryptedAmount,
        bytes calldata inputProof
    ) external returns (euint64) {
        return _mint(to, FHE.fromExternal(encryptedAmount, inputProof));
    }

    function _mintWithClearAmount(address to, uint256 amount) private returns (euint64) {
        require(amount > 0, "Amount is zero");
        require(amount <= MAX_AMOUNT, "Amount too large");
        return _mint(to, FHE.asEuint64(uint64(amount)));
    }
}
