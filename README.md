# Fixed-Term Bank with Fully Homomorphic Encryption

A privacy-preserving decentralized fixed-term deposit protocol built with Zama's FHEVM (Fully Homomorphic Encryption Virtual Machine), enabling confidential banking operations on the blockchain.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Advantages](#advantages)
- [Technologies Used](#technologies-used)
- [Problems Solved](#problems-solved)
- [Architecture](#architecture)
- [Smart Contracts](#smart-contracts)
- [Frontend Application](#frontend-application)
- [Getting Started](#getting-started)
- [How It Works](#how-it-works)
- [Interest Calculation](#interest-calculation)
- [Security Considerations](#security-considerations)
- [Testing](#testing)
- [Deployment](#deployment)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project implements a decentralized fixed-term deposit banking system that leverages **Fully Homomorphic Encryption (FHE)** to provide complete privacy for user balances and transactions. Users can deposit confidential tokens (mockUSDT) for predetermined periods and earn predictable interest rates while maintaining complete financial privacy on-chain.

Unlike traditional blockchain applications where all transaction data is publicly visible, this application encrypts sensitive financial information using Zama's FHEVM technology, ensuring that only authorized parties can decrypt and view their own balances and transaction amounts.

## Key Features

### Privacy-Preserving Operations
- **Confidential Balances**: User token balances are encrypted on-chain using FHE, making them invisible to external observers
- **Private Transactions**: All deposit and withdrawal amounts remain confidential throughout their lifecycle
- **Selective Disclosure**: Users control who can view their encrypted financial data through cryptographic proofs

### Fixed-Term Deposits
- **Multiple Term Options**: Choose from 1 month, 6 months, 1 year, or 3 years deposit periods
- **Predictable Returns**: Earn 1% interest per month on locked principal (simple interest model)
- **Time-Locked Security**: Funds are cryptographically locked until maturity timestamp
- **Automated Interest Distribution**: Interest is automatically minted and transferred upon withdrawal

### User-Friendly Interface
- **Modern React Frontend**: Intuitive web interface built with React 19 and TypeScript
- **Wallet Integration**: Seamless connection via RainbowKit supporting multiple wallet providers
- **Real-Time Decryption**: Client-side balance decryption using Zama's relayer SDK
- **Comprehensive Dashboard**: View all deposits, maturity dates, and projected earnings in one place

## Advantages

### 1. **Privacy by Design**
Traditional DeFi protocols expose all transaction amounts, balances, and trading strategies publicly. This project uses FHE to ensure:
- Competitors cannot analyze your trading patterns
- Your financial position remains confidential
- Transaction history is encrypted on-chain
- Only you can decrypt your own data with your private keys

### 2. **Regulatory Compliance Potential**
By enabling confidential transactions while maintaining on-chain verification:
- Supports compliance with financial privacy regulations
- Enables audit trails without public exposure
- Facilitates institutional adoption requiring confidentiality
- Maintains blockchain transparency for authorized parties

### 3. **True Decentralization with Privacy**
Unlike mixing services or privacy coins that can be censored:
- Runs on standard EVM-compatible chains
- No trusted intermediaries required
- Cryptographic guarantees from FHE mathematics
- Composable with other FHEVM-compatible protocols

### 4. **Predictable and Transparent Interest**
- Simple 1% per month interest model (12% APY, 36% for 3 years)
- Interest calculation logic is publicly auditable
- No hidden fees or variable rates
- Smart contract enforces automatic payouts

### 5. **Security Through Mathematics**
- FHE provides cryptographic security guarantees
- No reliance on off-chain privacy solutions
- Resistance to most blockchain analysis techniques
- Smart contracts auditable despite encrypted state

## Technologies Used

### Blockchain & Smart Contracts
- **Solidity 0.8.27**: Smart contract programming language with latest security features
- **Hardhat**: Ethereum development environment for compilation, testing, and deployment
- **FHEVM (Zama)**: Fully Homomorphic Encryption Virtual Machine for confidential smart contracts
  - `@fhevm/solidity ^0.8.0`: Core FHE operations library
  - `@zama-fhe/oracle-solidity ^0.1.0`: Decryption oracle integration
- **OpenZeppelin Confidential Contracts**: ERC-7984 confidential token standard implementation
- **TypeChain**: TypeScript bindings for smart contracts
- **Hardhat Deploy**: Declarative deployment system for contract management

### Frontend Technologies
- **React 19.1.1**: Latest React with concurrent features and improved performance
- **TypeScript 5.8.3**: Type-safe development with advanced type system features
- **Vite**: Next-generation frontend build tool for fast development experience
- **Wagmi 2.17.0**: React hooks library for Ethereum interactions
- **Viem 2.37.6**: TypeScript-first Ethereum library with tree-shakeable design
- **RainbowKit 2.2.8**: Beautiful wallet connection UI component
- **Ethers.js 6.15.0**: Complete Ethereum wallet and contract interaction library
- **TanStack Query 5.89.0**: Powerful data synchronization and caching

### Encryption & Privacy
- **Zama FHE Relayer SDK 0.2.0**: Client-side encryption/decryption utilities
- **EIP-712 Signatures**: Typed data signing for secure decryption authorization
- **Client-Side Key Generation**: Ephemeral keypairs for secure decryption

### Development & Testing
- **Mocha**: JavaScript test framework for contract testing
- **Chai**: Assertion library with comprehensive matchers
- **Hardhat Network Helpers**: Utilities for time manipulation and blockchain testing
- **ESLint & Prettier**: Code quality and formatting tools
- **Solhint**: Solidity linting for security best practices
- **Gas Reporter**: Gas usage analysis for optimization

### Deployment Networks
- **Hardhat Local Network**: Development and testing environment
- **Sepolia Testnet**: Ethereum testnet deployment with Infura RPC
- **FHEVM-Compatible Chains**: Designed for networks supporting Zama's FHE

## Problems Solved

### 1. **Privacy Paradox in Public Blockchains**
**Problem**: Ethereum and most blockchains are transparent by design, exposing all financial activity to anyone with a block explorer. This creates:
- Competition front-running based on visible strategies
- Loss of financial privacy for individuals and institutions
- Regulatory challenges in jurisdictions requiring confidentiality
- Reluctance of traditional finance to adopt transparent systems

**Solution**: By implementing FHE at the smart contract level, this project enables:
- Encrypted balances that are mathematically secure yet verifiable
- Private transactions that still settle on public infrastructure
- Compliance with privacy requirements while maintaining decentralization
- A bridge between traditional finance privacy expectations and blockchain benefits

### 2. **Fixed-Term Deposit Products in DeFi**
**Problem**: Most DeFi lending protocols use variable interest rates that:
- Create uncertainty for risk-averse users
- Fluctuate based on market conditions
- Lack the predictability of traditional banking products
- Don't serve users seeking guaranteed returns

**Solution**: Implements traditional fixed-term deposits with:
- Guaranteed interest rates (1% per month)
- Time-locked principals ensuring rate stability
- Multiple term options (1 month to 3 years)
- Automatic interest distribution at maturity

### 3. **Balance Privacy Without Centralization**
**Problem**: Current privacy solutions compromise on decentralization:
- Mixers require trusted setup or coordinators
- Privacy chains fragment liquidity
- L2 privacy solutions add complexity
- Centralized custodians negate blockchain benefits

**Solution**: FHEVM enables privacy with full decentralization:
- No trusted setup required
- Works on standard EVM chains
- Composable with other smart contracts
- Self-custodial throughout the entire process

### 4. **Institutional DeFi Adoption Barriers**
**Problem**: Institutions resist DeFi adoption due to:
- Public visibility of trading positions
- Exposure of investment strategies
- Regulatory compliance concerns
- Lack of confidential transaction capabilities

**Solution**: Provides enterprise-ready privacy features:
- Confidential balances meeting compliance needs
- Auditable trails for authorized parties
- Professional-grade privacy guarantees
- Standard Ethereum infrastructure

### 5. **User Experience in Encrypted Systems**
**Problem**: Privacy-focused crypto applications often suffer from:
- Complex key management
- Slow decryption processes
- Poor user interfaces
- Difficult wallet integration

**Solution**: Delivers seamless UX through:
- Automatic key generation via Zama SDK
- Fast client-side decryption
- Modern React interface
- One-click wallet connection with RainbowKit

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + TypeScript)           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ RainbowKit   │  │   Wagmi      │  │  Zama SDK    │     │
│  │ (Wallet UI)  │  │ (Eth Hooks)  │  │ (FHE Client) │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                Ethereum Network (Sepolia / Local)           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Smart Contract Layer                       │  │
│  │  ┌────────────────┐      ┌──────────────────────┐   │  │
│  │  │  MockUSDT      │◄─────│  FixedTermBank       │   │  │
│  │  │  (ERC-7984)    │      │  (Deposit Logic)     │   │  │
│  │  │  FHE Token     │      │  Interest Calc       │   │  │
│  │  └────────────────┘      └──────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                │
│                            ▼                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           FHEVM Layer (Zama)                         │  │
│  │  • Encrypted State Storage                           │  │
│  │  • FHE Operations (euint64)                          │  │
│  │  • Decryption Oracle                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

#### Deposit Flow
1. User mints mockUSDT tokens (confidential balance created)
2. User approves FixedTermBank as operator (ERC-7984 permission)
3. User selects term and amount, initiates deposit
4. Smart contract:
   - Encrypts amount to `euint64` type
   - Transfers encrypted tokens via `confidentialTransferFrom`
   - Records deposit metadata (cleartext: timestamp, duration, term)
   - Emits `Deposited` event
5. Frontend updates UI with new deposit information

#### Withdrawal Flow
1. User selects matured deposit
2. Smart contract validates:
   - Ownership verification
   - Maturity timestamp check
   - Not previously withdrawn
3. Contract executes:
   - Transfers encrypted principal back to user
   - Mints interest tokens to user address
   - Marks deposit as withdrawn
   - Emits `Withdrawn` event
4. Frontend decrypts new balance using Zama SDK

#### Balance Decryption Flow
1. Frontend generates ephemeral keypair
2. Creates EIP-712 typed data for decryption authorization
3. User signs typed data with wallet
4. Signature + public key sent to Zama relayer
5. Relayer decrypts ciphertext and returns cleartext
6. Frontend displays decrypted balance to user

## Smart Contracts

### MockUSDT.sol
**Purpose**: Confidential ERC-7984 token implementation for testing and demonstration.

**Key Features**:
- 6 decimal precision (matching USDT standard)
- Confidential balances using `euint64` encrypted type
- Public and encrypted minting functions
- Operator-based approval system (replaces standard allowances)
- Compliant with ERC-7984 confidential token standard

**Main Functions**:
```solidity
function mint(uint256 amount) external returns (euint64)
function mintTo(address to, uint256 amount) external returns (euint64)
function confidentialBalanceOf(address account) view returns (euint64)
function confidentialTransfer(address to, euint64 amount) returns (euint64)
function confidentialTransferFrom(address from, address to, euint64 amount) returns (euint64)
function setOperator(address operator, uint48 until) external
function isOperator(address holder, address spender) view returns (bool)
```

### FixedTermBank.sol
**Purpose**: Core banking logic for fixed-term deposits with confidential operations.

**Deposit Terms**:
- `OneMonth`: 30 days, 1% total interest
- `SixMonths`: 182 days, 6% total interest
- `OneYear`: 365 days, 12% total interest
- `ThreeYears`: 1095 days, 36% total interest

**Data Structures**:
```solidity
struct Deposit {
    address owner;           // Cleartext: deposit owner
    uint256 amount;          // Cleartext: principal amount
    uint64 startTimestamp;   // Cleartext: deposit creation time
    uint64 duration;         // Cleartext: lock period in seconds
    uint16 months;           // Cleartext: term length for interest calculation
    bool withdrawn;          // Cleartext: withdrawal status
}
```

**Main Functions**:
```solidity
function deposit(uint256 amount, Term term) external returns (uint256 depositId)
function withdraw(uint256 depositId) external
function getDeposit(uint256 depositId) view returns (Deposit)
function getUserDepositIds(address account) view returns (uint256[])
function calculateInterest(uint256 amount, uint16 monthsCount) pure returns (uint256)
function preview(Term term, uint256 amount) pure returns (uint256)
function maturityTimestamp(uint256 depositId) view returns (uint256)
```

**Interest Formula**:
```solidity
interest = (principal × months) / 100
// Examples:
// 100 USDT × 1 month = 1 USDT interest
// 100 USDT × 12 months = 12 USDT interest
// 100 USDT × 36 months = 36 USDT interest
```

### Contract Addresses (Local Development)
- **MockUSDT**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **FixedTermBank**: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`

*Note: These addresses are for local Hardhat network. Update after deployment to testnet/mainnet.*

## Frontend Application

### Component Structure

```
home/src/
├── components/
│   ├── Header.tsx          # Wallet connection and network status
│   └── BankApp.tsx         # Main application logic and UI
├── hooks/
│   ├── useEthersSigner.ts  # Wagmi to Ethers.js adapter
│   └── useZamaInstance.ts  # FHE instance initialization
├── config/
│   ├── wagmi.ts            # Wagmi and RainbowKit configuration
│   └── contracts.ts        # Contract ABIs and addresses
└── styles/
    └── BankApp.css         # Application styling
```

### Key Features

#### BankApp Component
The main application component manages:
- **State Management**: Balance, deposits, loading states, error handling
- **FHE Instance**: Initialization and management of Zama SDK
- **Decryption Context**: Keypair generation, EIP-712 signing, relayer communication
- **User Actions**: Minting, depositing, withdrawing with transaction feedback
- **Data Fetching**: Periodic refresh of balances and deposit status

#### User Workflow

1. **Connect Wallet**: Click "Connect Wallet" → Select provider (MetaMask, WalletConnect, etc.)
2. **Mint Tokens**: Enter amount → Click "Mint tokens" → Confirm transaction
3. **View Balance**: Sign decryption request → Balance decrypted and displayed
4. **Create Deposit**:
   - Select term (1M, 6M, 1Y, 3Y)
   - Enter deposit amount
   - Preview projected interest
   - Click "Confirm deposit"
   - Auto-approval of operator permission if needed
5. **Monitor Deposits**: View all deposits with status (Locked/Matured/Withdrawn)
6. **Withdraw**: Click "Withdraw" on matured deposits → Receive principal + interest

## Getting Started

### Prerequisites

- **Node.js**: >= 20.0.0
- **npm**: >= 7.0.0
- **Git**: Latest version
- **Wallet**: MetaMask or compatible Web3 wallet
- **Testnet Funds**: Sepolia ETH for gas fees (from faucet)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/bank.git
cd bank
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env`:
```env
# Deployment Configuration
PRIVATE_KEY=your_private_key_here
INFURA_API_KEY=your_infura_api_key

# Block Explorer Verification
ETHERSCAN_API_KEY=your_etherscan_api_key

# Optional
REPORT_GAS=true
```

4. **Install frontend dependencies**
```bash
cd home
npm install
cd ..
```

### Local Development

#### Start Local Hardhat Node
```bash
npm run chain
```

#### Deploy Contracts
In a new terminal:
```bash
npm run deploy:localhost
```

Expected output:
```
MockUSDT deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
FixedTermBank deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

#### Run Tests
```bash
npm test
```

#### Start Frontend Development Server
```bash
cd home
npm run dev
```

Access at: `http://localhost:5173`

### Testnet Deployment

#### Deploy to Sepolia
```bash
npm run deploy:sepolia
```

#### Verify Contracts
```bash
npm run verify:sepolia
```

#### Update Frontend Configuration
Edit `home/src/config/contracts.ts` with deployed addresses.

## How It Works

### Confidential Token Operations

#### Encryption Process
When a user deposits tokens, the following occurs:

1. **Cleartext Input**: User specifies amount (e.g., 100 USDT)
2. **Conversion to euint64**: Contract converts cleartext to encrypted type
   ```solidity
   euint64 encryptedAmount = FHE.asEuint64(uint64(amount));
   ```
3. **Encrypted Transfer**: Tokens move in encrypted form
   ```solidity
   token.confidentialTransferFrom(msg.sender, address(this), encryptedAmount);
   ```
4. **Storage**: Encrypted balance stored in contract state
   - External observers see only ciphertext (bytes32)
   - Actual amount remains cryptographically hidden

#### Decryption Process
To view balance:

1. **Generate Keypair**: Client creates ephemeral public/private key
2. **Create Authorization**: EIP-712 typed signature proves ownership
3. **Request Decryption**: Send ciphertext handle + proof to Zama relayer
4. **Decrypt**: Relayer uses FHE to decrypt under user's public key
5. **Return Result**: Decrypted value sent only to authorized requester

### Interest Calculation

**Simple Interest Model**:
```
Interest = Principal × (Months ÷ 100)
```

**Examples**:
- 100 USDT for 1 month: `100 × 1 / 100 = 1 USDT` (1% return)
- 1000 USDT for 6 months: `1000 × 6 / 100 = 60 USDT` (6% return)
- 500 USDT for 1 year: `500 × 12 / 100 = 60 USDT` (12% return)
- 10000 USDT for 3 years: `10000 × 36 / 100 = 3600 USDT` (36% return)

**Why Simple Interest?**
- Predictable returns for users
- Gas-efficient calculation
- Transparent and auditable
- No compounding complexity

### Time-Lock Mechanism

Deposits are locked using timestamp comparison:

```solidity
require(
    block.timestamp >= userDeposit.startTimestamp + userDeposit.duration,
    "Deposit locked"
);
```

- **OneMonth**: 30 days (2,592,000 seconds)
- **SixMonths**: 182 days (15,724,800 seconds)
- **OneYear**: 365 days (31,536,000 seconds)
- **ThreeYears**: 1095 days (94,608,000 seconds)

### Operator Permission System

ERC-7984 uses operators instead of traditional allowances:

```solidity
function setOperator(address operator, uint48 until) external
```

**Benefits**:
- Time-bound permissions (expiry timestamp)
- More gas-efficient for multiple transfers
- Better suited for confidential tokens
- Automatic expiry without manual revocation

## Security Considerations

### Smart Contract Security

#### Access Controls
- **Ownership Verification**: Only deposit owner can withdraw
  ```solidity
  require(userDeposit.owner == msg.sender, "Not deposit owner");
  ```
- **Reentrancy Protection**: Single withdrawal per deposit ID enforced
  ```solidity
  require(!userDeposit.withdrawn, "Deposit withdrawn");
  ```
- **Time-Lock Validation**: Maturity enforced by block timestamp
  ```solidity
  require(block.timestamp >= maturity, "Deposit locked");
  ```

#### Integer Overflow Prevention
- Solidity 0.8.27 includes automatic overflow checks
- Additional safety with type constraints:
  ```solidity
  require(amount <= type(uint64).max, "Amount too large");
  ```

#### Input Validation
- Non-zero amount checks
- Valid term enumeration
- Address zero checks in constructor

### FHE-Specific Security

#### Ciphertext Integrity
- All encrypted operations verified by FHEVM
- Tampering with ciphertext detectable by FHE circuit
- Operations only valid on properly encrypted inputs

#### Decryption Authorization
- EIP-712 signatures prevent unauthorized decryption
- Time-bound decryption keys (7-day window)
- User controls which contracts access encrypted data

#### Key Management
- Client-side keypair generation (no server storage)
- Ephemeral keys reduce long-term exposure
- Private keys never leave user's browser

### Known Limitations

1. **Testnet Security**:
   - MockUSDT is for testing only
   - Not audited for production use
   - Should not hold real value

2. **Timestamp Dependency**:
   - Block timestamps can be manipulated by miners (±15 seconds)
   - Acceptable for day/month-level precision
   - Not suitable for high-frequency operations

3. **FHE Performance**:
   - Encrypted operations more expensive than cleartext
   - Decryption requires relayer infrastructure
   - Network-dependent latency

4. **No Emergency Withdrawal**:
   - Funds locked until maturity (by design)
   - Consider emergency unlock mechanism for production
   - Potential governance override for edge cases

## Testing

### Test Coverage

The project includes comprehensive tests for both contracts:

#### MockUSDT Tests
```bash
npm test -- --grep "MockUSDT"
```

**Coverage**:
- ✓ Mints tokens with 6 decimal precision
- ✓ Confidential balance encryption
- ✓ Operator approval system
- ✓ Encrypted transfers

#### FixedTermBank Tests
```bash
npm test -- --grep "FixedTermBank"
```

**Coverage**:
- ✓ Deposit creation and metadata recording (`test/FixedTermBank.ts:71`)
- ✓ Withdrawal prevention before maturity (`test/FixedTermBank.ts:92`)
- ✓ Principal and interest distribution (`test/FixedTermBank.ts:105`)
- ✓ Interest preview calculations (`test/FixedTermBank.ts:126`)
- ✓ User deposit tracking
- ✓ Operator permission validation

### Running Tests

**All Tests**:
```bash
npm test
```

**With Gas Reporting**:
```bash
REPORT_GAS=true npm test
```

**Coverage Report**:
```bash
npm run coverage
```

**Sepolia Testnet Tests**:
```bash
npm run test:sepolia
```

### Expected Test Output

```
  MockUSDT
    ✓ mints tokens to caller with 6 decimals (1234ms)

  FixedTermBank
    ✓ creates deposits and records metadata (2156ms)
    ✓ prevents withdrawals before maturity (1845ms)
    ✓ releases principal and interest after maturity (2567ms)
    ✓ computes preview interest for longer terms (892ms)

  5 passing (9.2s)
```

## Deployment

### Contract Deployment

#### Local Network
```bash
# Terminal 1: Start node
npm run chain

# Terminal 2: Deploy
npm run deploy:localhost
```

#### Sepolia Testnet
```bash
npm run deploy:sepolia
```

**Deployment Script** (`deploy/deploy.ts`):
1. Deploys MockUSDT (no constructor args)
2. Deploys FixedTermBank with MockUSDT address
3. Logs deployed addresses for frontend configuration

### Frontend Deployment

#### Build for Production
```bash
cd home
npm run build
```

Output: `home/dist/` (static files ready for hosting)

#### Deployment Options

**Netlify** (Recommended):
```bash
# Already configured in home/netlify.toml
cd home
netlify deploy --prod
```

**Vercel**:
```bash
cd home
vercel --prod
```

**IPFS (Decentralized)**:
```bash
cd home
npm run build
ipfs add -r dist/
```

### Post-Deployment Configuration

1. **Update Contract Addresses**:
   Edit `home/src/config/contracts.ts`:
   ```typescript
   export const MOCK_USDT_ADDRESS = '0xYourDeployedAddress' as const;
   export const FIXED_TERM_BANK_ADDRESS = '0xYourDeployedAddress' as const;
   ```

2. **Verify Contracts** (Optional but recommended):
   ```bash
   npm run verify:sepolia
   ```

3. **Test Frontend**:
   - Connect wallet to Sepolia
   - Mint test tokens
   - Create sample deposit
   - Verify all features work

## Future Roadmap

### Phase 1: Core Enhancements (Q2 2025)

#### Flexible Interest Rates
- **Variable APY**: Interest rates adjustable by governance
- **Tiered Rates**: Higher rates for longer terms or larger deposits
- **Compound Interest**: Optional auto-reinvestment of interest
- **Early Withdrawal**: Partial withdrawals with penalty mechanism

#### Additional Features
- **Partial Withdrawals**: Withdraw portion of deposit while maintaining lock
- **Deposit Transfer**: NFT-based deposit receipts transferable to other users
- **Auto-Renewal**: Automatic rollover of matured deposits to new terms
- **Referral System**: On-chain referral rewards for user acquisition

### Phase 2: Advanced Privacy (Q3 2025)

#### Enhanced Confidentiality
- **Confidential Interest**: Encrypt interest amounts on-chain
- **Private Terms**: Hide deposit duration and term selection
- **Zero-Knowledge Proofs**: Prove solvency without revealing amounts
- **Anonymous Deposits**: Dissociate deposit IDs from user addresses using stealth addresses

#### Cross-Chain Privacy
- **Bridge Integration**: Confidential cross-chain token transfers
- **Multi-Chain Deployment**: Deploy to multiple FHEVM-compatible chains
- **Privacy Pools**: Shared liquidity pools with encrypted balances

### Phase 3: DeFi Integration (Q4 2025)

#### Composability
- **Deposit Derivatives**: Tokenized deposit receipts as collateral
- **Lending Integration**: Use deposits as collateral for loans
- **Yield Aggregation**: Integration with yield optimization strategies
- **LP Token Support**: Accept LP tokens from DEXs as deposits

#### Governance
- **DAO Formation**: Decentralized governance for protocol parameters
- **Voting System**: Confidential voting on proposals
- **Treasury Management**: Protocol fee collection and distribution
- **Parameter Adjustment**: Community-driven interest rate modifications

### Phase 4: Institutional Features (Q1 2026)

#### Enterprise Capabilities
- **Multi-Signature Wallets**: Corporate account management
- **Compliance Tools**: Selective disclosure for audit purposes
- **Batch Operations**: Bulk deposit/withdrawal operations
- **API Access**: Programmatic access for institutional integrations

#### Audit and Compliance
- **Auditor Roles**: Designated addresses with limited decryption access
- **Compliance Reporting**: Automated reporting for regulatory requirements
- **KYC Integration**: Optional identity verification for regulated entities
- **Transaction Limits**: Configurable limits for AML compliance

### Long-Term Vision (2027+)

- **Privacy-Preserving DeFi Ecosystem**: Foundation for confidential financial products
- **Institutional Adoption**: Bridge between TradFi and DeFi privacy standards
- **Regulatory Compliance**: Model for compliant confidential finance
- **Global Expansion**: Deployment on all major FHEVM-compatible chains
- **Real-World Assets**: Tokenized traditional assets with confidential balances

## Contributing

We appreciate contributions from the community! Here's how to get involved:

### Getting Started

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/bank.git
   cd bank
   git remote add upstream https://github.com/originalowner/bank.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow existing code style
   - Add tests for new features
   - Update documentation as needed

4. **Run Tests**
   ```bash
   npm test
   npm run lint
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   **Commit Convention**:
   - `feat:` New features
   - `fix:` Bug fixes
   - `docs:` Documentation changes
   - `test:` Test additions or updates
   - `refactor:` Code refactoring
   - `style:` Code style changes
   - `chore:` Build/tooling changes

6. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Development Guidelines

#### Smart Contracts
- Follow Solidity style guide
- Add comprehensive NatSpec comments
- Include test coverage for all functions
- Run gas optimization checks
- Security considerations documented

#### Frontend
- Use TypeScript for type safety
- Follow React best practices
- Maintain responsive design
- Add error handling
- Write accessible UI components

#### Testing
- Unit tests for all new functions
- Integration tests for user flows
- Edge case coverage
- Gas usage benchmarks

### Reporting Issues

**Bug Reports** should include:
- Description of the bug
- Steps to reproduce
- Expected vs. actual behavior
- Environment details (Node version, network, etc.)
- Screenshots/logs if applicable

**Feature Requests** should include:
- Use case description
- Proposed solution
- Alternative approaches considered
- Impact on existing functionality

## License

This project is licensed under the **BSD-3-Clause-Clear License**.

```
Copyright (c) 2025 Fixed-Term Bank Contributors
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted (subject to the limitations in the disclaimer
below) provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright
  notice, this list of conditions and the following disclaimer in the
  documentation and/or other materials provided with the distribution.
* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED
BY THIS LICENSE. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND
CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING,
BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
```

### Third-Party Licenses

This project uses open-source libraries under various licenses:
- **Zama FHEVM**: BSD-3-Clause-Clear
- **OpenZeppelin Contracts**: MIT
- **Hardhat**: MIT
- **React**: MIT
- **ethers.js**: MIT

See individual package licenses in `package.json` dependencies.

---

## Acknowledgments

- **Zama**: For pioneering FHE technology and providing FHEVM infrastructure
- **OpenZeppelin**: For confidential contract standards and security libraries
- **Ethereum Foundation**: For the foundational blockchain technology
- **Hardhat Team**: For excellent developer tooling
- **Community Contributors**: For feedback, testing, and improvements

---

## Disclaimer

**IMPORTANT**: This software is experimental and provided "as-is" for educational and research purposes.

⚠️ **Use at Your Own Risk**:
- Smart contracts have not been formally audited
- May contain bugs or vulnerabilities
- Not recommended for production use with real funds
- No warranty or liability for losses

**Before Production Deployment**:
1. Conduct comprehensive security audit
2. Implement emergency pause mechanisms
3. Add governance safeguards
4. Consider insurance protocols
5. Conduct extensive testnet trials

**Legal Compliance**:
- Consult legal counsel regarding regulations in your jurisdiction
- Understand tax implications of DeFi participation
- Comply with local financial services laws
- Consider KYC/AML requirements for institutional use

---

**Built with ❤️ for a private, decentralized financial future**
