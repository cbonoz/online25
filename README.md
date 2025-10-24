# SafeSend – PYUSD Consumer Protection On-Chain

> Bringing PayPal-like consumer protection to on-chain stablecoin payments using fraud oracles and transparent smart contracts.

**SafeSend** is a Next.js web application with Solidity smart contracts that provides secure escrow services for PYUSD stablecoin transactions. It introduces on-chain consumer protection through automated fraud detection and transparent oracle-based arbitration, bringing Web2-style payment confidence to Web3.

## System Architecture & User Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          SAFESEND ARCHITECTURE                           │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────┐
│    USER     │  1. Connect Wallet
│   (Buyer)   │  2. Approve PYUSD
└──────┬──────┘  3. Create Escrow
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         NEXT.JS WEB APPLICATION                          │
│                                                                           │
│  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │  Create Escrow  │  │  My Escrows      │  │  Escrow Details      │  │
│  │  - Form Input   │  │  - List View     │  │  - Release Funds     │  │
│  │  - Amount/Desc  │  │  - Buyer/Seller  │  │  - Request Refund    │  │
│  └────────┬────────┘  └────────┬─────────┘  └──────────┬───────────┘  │
│           │                    │                        │               │
│           └────────────────────┼────────────────────────┘               │
│                                │                                         │
│  ┌─────────────────────────────▼─────────────────────────────────────┐ │
│  │              Viem + Dynamic Wallet Integration                     │ │
│  │  - Contract interactions via TypeScript-first Ethereum library     │ │
│  │  - Multi-wallet support (MetaMask, Coinbase, WalletConnect, etc.) │ │
│  └─────────────────────────────┬─────────────────────────────────────┘ │
└────────────────────────────────┼───────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      ETHEREUM BLOCKCHAIN (Sepolia)                       │
│                                                                           │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                      PYUSD Token Contract                           │ │
│  │  ERC-20: 0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9 (Sepolia)      │ │
│  └──────────────────────┬─────────────────────────────────────────────┘ │
│                         │ approve() / transferFrom()                    │
│                         ▼                                                │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    SAFESENDCONTRACT.SOL                             │ │
│  │  ┌──────────────────────────────────────────────────────────────┐  │ │
│  │  │ deposit(seller, amount, description)                          │  │ │
│  │  │   1. Transfer PYUSD from buyer to contract                    │  │ │
│  │  │   2. Create escrow record (ID, buyer, seller, amount, etc.)   │  │ │
│  │  │   3. Emit Deposited event                                     │  │ │
│  │  │   4. ─────┐                                                   │  │ │
│  │  │           ▼                                                   │  │ │
│  │  │   ┌────────────────────────────────────────────┐             │  │ │
│  │  │   │ Oracle Fraud Check (IFraudOracle)          │             │  │ │
│  │  │   │ try {                                       │             │  │ │
│  │  │   │   (isFlagged, reason) =                    │ ◄───────────┼──┼─┐
│  │  │   │     oracle.checkEscrow(id, buyer,          │             │  │ │
│  │  │   │                       seller, amount)       │             │  │ │
│  │  │   │   if (isFlagged) {                         │             │  │ │
│  │  │   │     - Mark as FraudFlagged                 │             │  │ │
│  │  │   │     - Refund buyer immediately             │             │  │ │
│  │  │   │     - Emit FraudFlagged event              │             │  │ │
│  │  │   │     - Revert with reason                   │             │  │ │
│  │  │   │   }                                         │             │  │ │
│  │  │   │ } catch { /* Continue if oracle fails */ } │             │  │ │
│  │  │   └────────────────────────────────────────────┘             │  │ │
│  │  │   5. Return escrowId (if not flagged)                        │  │ │
│  │  └──────────────────────────────────────────────────────────────┘  │ │
│  │                                                                      │ │
│  │  ┌──────────────────────────────────────────────────────────────┐  │ │
│  │  │ release(escrowId)         - Buyer releases to seller         │  │ │
│  │  │ refund(escrowId)          - Buyer/Oracle refunds buyer       │  │ │
│  │  │ markFraud(escrowId)       - Oracle flags fraud (auto refund) │  │ │
│  │  │ updateFraudOracle(address) - Owner changes oracle            │  │ │
│  │  └──────────────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                         │                                                │
│                         ▼ Implements IFraudOracle Interface             │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │             SIMPLEFRAUDORACLE.SOL (Modular & Upgradeable)          │ │
│  │  ┌──────────────────────────────────────────────────────────────┐  │ │
│  │  │ interface IFraudOracle {                                      │  │ │
│  │  │   function checkEscrow(id, buyer, seller, amount)            │  │ │
│  │  │     returns (bool isFlagged, string memory reason);          │  │ │
│  │  │   function isEscrowFlagged(id)                               │  │ │
│  │  │     returns (bool isFlagged, string memory reason);          │  │ │
│  │  │ }                                                             │  │ │
│  │  └──────────────────────────────────────────────────────────────┘  │ │
│  │                                                                      │ │
│  │  Fraud Detection Logic:                                              │ │
│  │  ✓ Blacklist Check        - Block known bad actors                  │ │
│  │  ✓ Amount Limit Check     - Reject transactions > 5000 PYUSD        │ │
│  │  ✓ Same Address Check     - Buyer ≠ Seller validation               │ │
│  │  ✓ Manual Flag Check      - Owner flagged escrows                   │ │
│  │  ✓ Dispute Window Tracking - 7-day dispute period                   │ │
│  │                                                                      │ │
│  │  Owner Functions (Maintained by External Authority):                │ │
│  │  - blacklistAddress(addr, reason)    Add to blacklist               │ │
│  │  - whitelistAddress(addr)            Remove from blacklist          │ │
│  │  - flagEscrow(id, addr, reason)      Manual fraud flag              │ │
│  │  - clearFlag(id)                     Remove fraud flag              │ │
│  │  - setMaxTransactionAmount(amount)   Update limits                  │ │
│  │  - setDisputeWindow(seconds)         Configure dispute period       │ │
│  │                                                                      │ │
│  │  ⚠️  MODULARITY: Oracle can be replaced without touching            │ │
│  │      SafeSendContract. Just deploy new oracle implementing          │ │
│  │      IFraudOracle and call updateFraudOracle(newAddress)            │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
└───────────────────────────────────────┬───────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    BLOCKSCOUT EXPLORER & SDK INTEGRATION                 │
│                                                                           │
│  Real-time Monitoring:                                                   │
│  ✓ Transaction toast notifications with status updates                  │
│  ✓ Transaction history popups (contract/wallet/token)                   │
│  ✓ Event logs (Deposited, Released, Refunded, FraudFlagged)            │
│  ✓ Complete audit trail for dispute resolution                          │
│  ✓ Public verification of all oracle decisions                          │
└─────────────────────────────────────────────────────────────────────────┘

KEY FEATURES:
═════════════

1. MODULAR ORACLE DESIGN
   - IFraudOracle interface standardizes fraud detection
   - Oracle contract can be swapped without redeploying SafeSendContract
   - Maintained by external authority (fraud detection specialist)
   - Payment contract only consults oracle, doesn't contain fraud logic

2. AUTOMATIC FRAUD REJECTION
   - Oracle consulted during escrow creation (deposit())
   - Flagged transactions immediately refund buyer + revert
   - No manual intervention needed for detected fraud
   - Graceful degradation if oracle unavailable

3. TRANSPARENT & AUDITABLE
   - All decisions logged as on-chain events
   - Public oracle address visible to all participants
   - Users can verify oracle reputation before transacting
   - Complete history viewable on Blockscout/Etherscan

4. PYUSD INTEGRATION
   - Regulated stablecoin for real-world value
   - 6 decimal precision (1 PYUSD = 1,000,000 units)
   - ERC-20 compatible with standard approve/transferFrom flow
```

---

## Features

### Core Escrow Features
* **PYUSD Escrow** – Secure smart contract holds buyer funds until transaction completion
* **Buyer Protection** – Buyers can release funds to sellers or request refunds
* **Seller Transparency** – All escrow terms and status visible on-chain
* **Multi-Party Support** – Track escrows as buyer, seller, or observer
* **Real-Time Status** – Live updates on escrow state (Active, Released, Refunded, Fraud Flagged)

### Fraud Protection System
* **Automated Fraud Detection** – SimpleFraudOracle performs instant checks on escrow creation
* **Blacklist Management** – Prevent known bad actors from participating
* **Amount Limits** – Configurable maximum transaction amounts (default: 5000 PYUSD)
* **Same-Address Protection** – Prevents buyer and seller being the same address
* **Manual Flagging** – Oracle owner can manually flag suspicious transactions
* **Automatic Refunds** – Flagged transactions immediately refund the buyer
* **Dispute Window** – 7-day dispute period tracking for review

### Integration Features
* **Blockscout SDK Integration** – Real-time transaction monitoring and explorer popups
* **Dynamic Wallet Connect** – Easy wallet connection with multiple provider support
* **Transaction Notifications** – Non-blocking toast notifications for all operations
* **Explorer Links** – Direct links to Etherscan/Blockscout for all transactions
* **Event Logging** – Complete audit trail with `Deposited`, `Released`, `Refunded`, and `FraudFlagged` events

---

## Tech Stack

### Frontend
* **Next.js 14** – App router with React Server Components
* **Ant Design (antd)** – UI components for forms, tables, cards, and modals
* **Viem** – Modern TypeScript-first Ethereum library for contract interactions
* **Dynamic** – Wallet connection and authentication
* **Blockscout App SDK** – Transaction notifications and explorer integration

### Smart Contracts
* **Solidity ^0.8.28** – Contract language
* **Hardhat** – Development, testing, and deployment framework
* **OpenZeppelin** – Battle-tested contract libraries (Ownable, ReentrancyGuard, ERC20)
* **Hardhat Ignition** – Declarative deployment management

### Blockchain Integration
* **PYUSD Token** – PayPal's regulated stablecoin (6 decimals)
  - Mainnet: `0x6c3ea9036406852006290770BEdFcAbA0e23A0e8`
  - Sepolia: `0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9`
* **Networks**: Ethereum Mainnet & Sepolia Testnet
* **Explorers**: Blockscout & Etherscan for transaction monitoring

## Sponsors

SafeSend is built around three key partner technologies: PYUSD, Hardhat, and Blockscout.

PYUSD – PayPal’s regulated stablecoin serves as the payment rail. Because it’s fully ERC-20 compatible and backed by real-world reserves, it provides the reliability and consumer confidence needed for escrow-based payments. All transfers and refunds in SafeSend use PYUSD, ensuring predictable settlement and fiat equivalence.

Hardhat – Used for contract development, deployment, and verification. Hardhat’s scripting and testing environment made it possible to quickly simulate multiple fraud scenarios, verify contracts on testnets, and emit events compatible with explorer indexing.

Blockscout – Integrated as both a transparency layer and developer tool using the official Blockscout SDK (@blockscout/app-sdk). Every SafeSend action (deposit, fraud attestation, refund, release) emits an event visible through Blockscout's explorer and SDK, making the entire fraud arbitration process publicly auditable.

**Blockscout SDK Integration Features:**
- **Real-time Transaction Notifications** – Toast notifications with pending/success/error states appear instantly for all escrow operations (create, release, refund, fraud marking)
- **Transaction History Popups** – Interactive popups allow users to view complete transaction history for contracts, wallet addresses, and PYUSD token transfers
- **Contract Activity Monitoring** – Dedicated buttons throughout the app to view SafeSend contract transactions in real-time
- **PYUSD Transaction Tracking** – Direct access to PYUSD token transaction history via integrated explorer

The contract is written in Solidity, deployed on Ethereum testnets, and uses a single shared escrow logic that supports multiple businesses. Each business registers its own oracle for fraud attestations, allowing scalable participation without redeploying new contracts.

In essence, SafeSend combines on-chain logic, stablecoin security, and open attestations to create a trust-minimized consumer protection system for digital payments — bringing Web2-style confidence into the Web3 economy.

<!-- 1. PyUSD – Provides the stablecoin for secure, real-world-value payments in the escrow system, enabling consumer payment use cases.
2. Hardhat – Handles smart contract deployment, testing, and verification, ensuring reproducibility and developer productivity.
3. Blockscout – Offers blockchain explorer functionality and SDK support for viewing contract events, token balances, and auditing escrow transactions in real time. -->

---

## How It Works

### SafeSendContract Flow

1. **Create Escrow**
   - Buyer approves PYUSD spending for the SafeSendContract
   - Buyer calls `deposit(seller, amount, description)` with escrow details
   - PYUSD transfers from buyer to contract
   - Escrow ID generated (starts at 10001 for better UX)
   - Fraud oracle automatically checks the transaction
   - If fraud detected: immediate refund + transaction reverts
   - If clean: escrow created in Active state

2. **Transaction Flow**
   - **Normal Completion**: Buyer calls `release(escrowId)` to send funds to seller
   - **Dispute/Issue**: Buyer calls `refund(escrowId)` to get funds back
   - **Fraud Detection**: Oracle calls `markFraud(escrowId)` for automatic buyer refund

3. **Fraud Detection**
   - SimpleFraudOracle runs checks on escrow creation:
     - Blacklist verification (buyer & seller)
     - Amount limit validation
     - Same-address detection
     - Manual flag check
   - Oracle can flag existing escrows manually
   - Flagged escrows automatically refund the buyer

4. **State Management**
   - **Active**: Escrow is open, funds locked in contract
   - **Released**: Funds successfully sent to seller
   - **Refunded**: Funds returned to buyer
   - **FraudFlagged**: Oracle detected fraud, funds refunded

5. **Event Transparency**
   - All actions emit events viewable on Blockscout/Etherscan
   - Complete audit trail for dispute resolution
   - Public verification of oracle decisions

### Blockscout SDK Integration Points

The Blockscout SDK is integrated throughout the SafeSend application to provide real-time transaction monitoring and instant explorer feedback:

**1. Transaction Toast Notifications**
- Automatically triggered after every escrow operation (create, release, refund, fraud marking)
- Shows real-time transaction status (pending → success/error)
- Displays transaction interpretation and summaries
- Links directly to Blockscout explorer for detailed view
- Implements automatic status polling for confirmation updates

**2. Transaction History Popups**
- **Global Navigation**: "Transactions" button in main navigation opens chain-wide activity
- **Escrow Details Page**: Three dedicated buttons for Contract/PYUSD/User transaction history
- **My Escrows Page**: Transaction monitoring card with quick access to all activity types
- **Main Page**: Interactive demo section showcasing Blockscout integration features

**3. Technical Implementation**
```
app/
  lib/
    BlockscoutProviders.js   # SDK providers wrapper (NotificationProvider + TransactionPopupProvider)
    BlockscoutDemo.js        # Interactive demo component for main page
  hooks/
    useBlockscout.js         # Custom hook wrapping SDK with app-specific configuration
  escrow/
    [id]/page.js            # Transaction notifications + history buttons on escrow details
    page.js                 # Transaction notifications on escrow creation
  my-escrows/
    page.js                 # Transaction monitoring card with activity viewers
```

**4. User Experience Flow**
- User creates escrow → Instant toast notification with transaction status
- User views escrow details → Quick access buttons to view contract/token/wallet history
- User releases/refunds → Real-time notification with confirmation status
- User explores transactions → One-click access to comprehensive Blockscout explorer data


## Fraud Oracle Architecture

### IFraudOracle Interface

SafeSend uses a standardized `IFraudOracle` interface that any fraud detection contract can implement:

```solidity
interface IFraudOracle {
    // Called automatically during escrow deposit
    function checkEscrow(
        uint256 escrowId,
        address buyer,
        address seller,
        uint256 amount
    ) external returns (bool isFlagged, string memory reason);
    
    // View function to check if escrow is flagged
    function isEscrowFlagged(uint256 escrowId) 
        external view 
        returns (bool isFlagged, string memory reason);
}
```

### SimpleFraudOracle Implementation

The included `SimpleFraudOracle` contract provides basic fraud detection:

**Automatic Checks (run on escrow creation):**
- Blacklist verification for buyer and seller addresses
- Amount limit enforcement (default 5000 PYUSD)
- Same-address detection (buyer ≠ seller)
- Manual flag check

**Owner Controls:**
- `blacklistAddress(address, reason)` - Add addresses to blacklist
- `whitelistAddress(address)` - Remove from blacklist
- `flagEscrow(escrowId, address, reason)` - Manually flag suspicious transactions
- `clearFlag(escrowId)` - Remove fraud flag
- `setMaxTransactionAmount(amount)` - Update limit
- `setDisputeWindow(seconds)` - Configure dispute period

### Integration Model

**Per-Deployment Configuration:**
- One fraud oracle per SafeSendContract deployment
- Oracle address set during contract deployment
- Can be updated by contract owner via `updateFraudOracle(newAddress)`
- All escrows in that deployment use the same oracle

**Deployment Options:**
- **With SimpleFraudOracle**: `yarn deploy:with-oracle` (recommended)
- **Custom Oracle**: Deploy implementing IFraudOracle interface
- **Third-Party Service**: Integrate external fraud detection API
- **Multi-Sig Oracle**: Use Gnosis Safe or similar for distributed control

### Oracle Failure Handling

The SafeSendContract is resilient to oracle failures:
- Oracle calls are wrapped in `try/catch`
- If oracle is down or throws error, escrow proceeds normally
- Contract doesn't break if oracle is misconfigured
- Users can still create escrows even if oracle is unavailable

### Transparency & Trust

- Oracle address is publicly viewable via `fraudOracle()` function
- All fraud flags emit `FraudFlagged` events on-chain
- Users can verify oracle before participating
- Oracle decisions are permanent and auditable

## Why this can be trusted

Code is open and verifiable – The smart contract is fully deployed and auditable on Blockscout or Etherscan. Users can see exactly how funds are handled.

Fraud protection is automated – Funds are only released or refunded based on verifiable fraud attestations or trusted oracle signatures, not arbitrary admin decisions.

Immutable rules – The contract enforces escrow logic and fraud resolution automatically, eliminating human error or bias.

Stablecoin-backed – Transactions use PYUSD, a regulated stablecoin, ensuring real-world value and predictable settlement.

Transparent event logs – Every deposit, release, refund, and fraud flag emits an event for anyone to verify.

Users don’t have to trust the developer—they trust the contract, the attestation, and the oracle.

---

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn or npm
- MetaMask or compatible Web3 wallet

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/cbonoz/online25.git
cd online25
```

2. **Install frontend dependencies**
```bash
yarn install
```

3. **Install contract dependencies**
```bash
cd contracts
yarn install
```

4. **Set up environment variables**
```bash
# Copy example file
cp .env.example .env

# Add your configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # Your deployed SafeSendContract
NEXT_PUBLIC_FRAUD_ORACLE_ADDRESS=0x... # Your SimpleFraudOracle
NEXT_PUBLIC_NETWORK=sepolia # or mainnet
```

### Deployment

#### Deploy Contracts with Fraud Oracle

```bash
cd contracts

# Compile contracts
yarn build

# Deploy to Sepolia testnet with oracle
yarn deploy:with-oracle

# Or deploy to mainnet
yarn deploy:oracle:mainnet
```

The deployment script will output:
- SimpleFraudOracle address
- SafeSendContract address
- Environment variables to add to your `.env` file

#### Run Frontend

```bash
# From project root
yarn dev
```

Visit `http://localhost:3000` to see the application.

### Project Structure

```
├── app/                      # Next.js app directory
│   ├── escrow/              # Escrow creation and detail pages
│   ├── my-escrows/          # User's escrow dashboard
│   ├── hooks/               # Custom React hooks
│   │   ├── useBlockscout.js    # Blockscout SDK wrapper
│   │   ├── useWalletClient.js  # Wallet connection
│   │   └── useWalletAddress.js # Address management
│   ├── lib/                 # Shared components
│   │   ├── BlockscoutProviders.js  # SDK provider setup
│   │   ├── DynamicWrapper.js       # Wallet connection wrapper
│   │   └── Navigation.js           # Main navigation
│   ├── util/                # Utility functions
│   │   ├── safeSendContract.js # Contract interaction layer
│   │   └── metadata.js          # Contract ABIs
│   └── constants/           # App configuration
├── contracts/               # Smart contract code
│   ├── contracts/          # Solidity contracts
│   │   ├── SafeSendContract.sol    # Main escrow contract
│   │   ├── SimpleFraudOracle.sol   # Fraud detection oracle
│   │   ├── IFraudOracle.sol        # Oracle interface
│   │   └── MockERC20.sol           # Testing token
│   ├── ignition/           # Hardhat Ignition modules
│   │   └── modules/
│   │       ├── SafeSendContract.ts
│   │       └── SafeSendWithOracle.ts
│   ├── scripts/            # Deployment scripts
│   │   └── deploy-with-oracle.js
│   └── test/               # Contract tests
└── public/                 # Static assets
```

## User Flows

### Creating an Escrow
1. Connect wallet via Dynamic
2. Navigate to "Create Escrow" page
3. Fill in seller address, amount, and description
4. Approve PYUSD spending (first transaction)
5. Create escrow (second transaction)
6. Oracle automatically checks for fraud
7. If clean: Escrow created, receive confirmation
8. If fraud: Transaction reverts, funds returned

### Viewing Escrows
- **My Escrows**: Dashboard showing all your escrows as buyer or seller
- **Escrow Details**: Click any escrow to see full details, transaction history, and available actions
- **Transaction History**: One-click access to Blockscout explorer for contract/wallet/token activity

### Managing Escrows
- **As Buyer**: Release funds to seller or request refund
- **As Seller**: Wait for buyer to release funds
- **As Oracle**: Mark suspicious escrows as fraud (automatic refund)

### Monitoring Activity
- Real-time toast notifications for all transactions
- Transaction status updates (pending → confirmed)
- Blockscout explorer integration for detailed views
- Public audit trail of all escrow events
