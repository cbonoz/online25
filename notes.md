# SafeSend – PYUSD Consumer Protection on-Chain

Bringing PayPal-like consumer protection to on-chain stablecoin payments using attestations and transparent oracles.

**SafeSend** is a smart contract-based escrow system that protects buyers and sellers in PYUSD stablecoin transactions. It introduces on-chain consumer protection using verifiable fraud attestations and trusted oracles, mimicking PayPal consumer protection in a trustless environment.


---

## Features

* **PYUSD Escrow** – Holds buyer funds securely until transaction completion.
* **Fraud Oracle / Attestation Integration** – Refunds or blocks funds based on verified fraud signals.
* **Automatic Refunds** – If a fraud attestation is received, buyer funds are automatically released.
* **Release to Seller** – Normal transactions release funds when no fraud is flagged.
* **Transparent Ledger** – All transactions and events are visible on Blockscout or any Ethereum-compatible explorer.
* **Oracle Management** – Designated fraud oracle can be updated securely.
* **Event Logging** – Emits `Deposited`, `Released`, `Refunded`, and `FraudFlagged` events for full auditability.

---

## Tech Stack

* **Smart Contract**: Solidity, Hardhat
* **Token**: PYUSD (EVM-based stablecoin) or ERC20 mock for testing
* **Backend / Scripts**: Node.js + Ethers.js for deployment, deposit, fraud marking, release, and refund interactions
* **Explorer**: Blockscout or Etherscan for event monitoring
* **Frontend**: Optional React/Tailwind dashboard for visual flow

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

## How it Works


`SafeSendContract`

1. **Deposit Funds** – Buyer deposits PYUSD into the escrow contract specifying the seller.
2. **Transaction Flow** – Seller requests release normally.
3. **Fraud Detection** – Fraud oracle or attestation flags the transaction if fraudulent.
4. **Contract Enforcement** – Contract automatically allows `refund()` for buyer or blocks `release()` for seller.
5. **Event Transparency** – All actions are logged and verifiable on-chain.

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

**The fraud oracle is configured per deployment of the SafeSendContract.** This means each instance of the contract has a single, global fraud oracle address that handles all escrows within that contract deployment.

### Key Design Decisions:

1. **Global Oracle Model** – One fraud oracle per contract deployment, not per individual escrow
2. **Constructor Configuration** – The oracle address is set during contract deployment and cannot be changed afterward
3. **Shared Authority** – The designated oracle can mark any escrow as fraudulent within the contract instance
4. **Business Flexibility** – Different businesses can deploy their own contract instances with their preferred oracle

### Deployment Options:

- **Self-Managed Oracle**: Deploy with your own oracle address for full control
- **Third-Party Oracle**: Use a trusted external fraud detection service
- **Multi-Sig Oracle**: Deploy with a multi-signature wallet as the oracle for distributed decision-making
- **Demo Mode**: Deploy with a test address for development and testing

### Business Implications:

This architecture allows businesses to:
- Choose their preferred fraud detection method
- Maintain control over dispute resolution
- Scale without per-escrow oracle complexity
- Integrate with existing fraud prevention systems

The oracle address is publicly visible and auditable, ensuring transparency in the fraud detection process. Users can verify which oracle is responsible for fraud decisions before participating in escrows.

## Why this can be trusted

Code is open and verifiable – The smart contract is fully deployed and auditable on Blockscout or Etherscan. Users can see exactly how funds are handled.

Fraud protection is automated – Funds are only released or refunded based on verifiable fraud attestations or trusted oracle signatures, not arbitrary admin decisions.

Immutable rules – The contract enforces escrow logic and fraud resolution automatically, eliminating human error or bias.

Stablecoin-backed – Transactions use PYUSD, a regulated stablecoin, ensuring real-world value and predictable settlement.

Transparent event logs – Every deposit, release, refund, and fraud flag emits an event for anyone to verify.

Users don’t have to trust the developer—they trust the contract, the attestation, and the oracle.

---

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/cbonoz/ethonline25.git
```

2. Install dependencies:

```bash
npm install
```

3. Deploy contracts using Hardhat:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

4. Simulate a transaction:

   * Deposit: `node scripts/deposit.js`
   * Mark Fraud: `node scripts/markFraud.js`
   * Refund Buyer: `node scripts/refund.js`
   * Release Funds: `node scripts/release.js` (if no fraud flagged)

---

## Demo Flow

* Deposit PYUSD → show `Deposited` event
* Fraud oracle flags transaction → show `FraudFlagged` event
* Refund executed → show `Refunded` event
* Release executed (normal transaction) → show `Released` event

This flow demonstrates **on-chain consumer protection with verifiable fraud attestations**.
