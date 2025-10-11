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

1. PyUSD – Provides the stablecoin for secure, real-world-value payments in the escrow system, enabling consumer payment use cases.
2. Hardhat – Handles smart contract deployment, testing, and verification, ensuring reproducibility and developer productivity.
3. Blockscout – Offers blockchain explorer functionality and SDK support for viewing contract events, token balances, and auditing escrow transactions in real time.

---

## How it Works


`SafeSendContract`

1. **Deposit Funds** – Buyer deposits PYUSD into the escrow contract specifying the seller.
2. **Transaction Flow** – Seller requests release normally.
3. **Fraud Detection** – Fraud oracle or attestation flags the transaction if fraudulent.
4. **Contract Enforcement** – Contract automatically allows `refund()` for buyer or blocks `release()` for seller.
5. **Event Transparency** – All actions are logged and verifiable on-chain.

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
