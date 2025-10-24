# Fraud Oracle Integration Guide

## Architecture Overview

The SafeSend system now includes automatic fraud detection through the `SimpleFraudOracle` contract using a standardized interface.

## How It Works

### 1. Interface (`IFraudOracle.sol`)

The `IFraudOracle` interface defines the standard contract for fraud detection:

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

### 2. SafeSendContract Integration

The `SafeSendContract` now:

1. **Imports the interface**: `import "./IFraudOracle.sol";`
2. **Calls oracle during deposit**: Automatically checks each new escrow
3. **Auto-refunds flagged transactions**: If fraud detected, immediately refunds buyer
4. **Handles oracle failures gracefully**: Contract continues if oracle is down

#### Deposit Flow with Oracle

```
User calls deposit()
    ↓
Transfer PYUSD to contract
    ↓
Create escrow record
    ↓
Call oracle.checkEscrow()
    ↓
If flagged:
  - Mark as FraudFlagged
  - Refund buyer automatically
  - Revert with reason
    ↓
If not flagged or oracle fails:
  - Continue with escrow
  - Return escrowId
```

### 3. SimpleFraudOracle Implementation

The `SimpleFraudOracle` performs these checks:

1. **Blacklist check**: Buyer or seller on blacklist
2. **Amount limit**: Transaction exceeds max amount (default 5000 PYUSD)
3. **Same address**: Buyer and seller cannot be the same
4. **Manual flags**: Owner can manually flag escrows
5. **Dispute window**: 7-day dispute period tracking

## Deployment Process

### Option 1: Using the Deployment Script (Recommended)

```bash
# Deploy to Sepolia with oracle
cd contracts
yarn deploy:oracle:sepolia

# Deploy to Mainnet with oracle
yarn deploy:oracle:mainnet

# Use existing oracle address
node scripts/deploy-with-oracle.js --network sepolia --oracle-address 0x...
```

The script will:
1. Deploy `SimpleFraudOracle`
2. Deploy `SafeSendContract` with oracle address
3. Output environment variables for your `.env` file

### Option 2: Using Hardhat Ignition

```bash
# Deploy using Ignition module
yarn deploy:ignition:oracle:sepolia

# Or for mainnet
yarn deploy:ignition:oracle:mainnet
```

### After Deployment

Add to your `.env` file:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS="0x..." # SafeSendContract address
NEXT_PUBLIC_FRAUD_ORACLE_ADDRESS="0x..." # SimpleFraudOracle address
NEXT_PUBLIC_NETWORK="sepolia" # or "mainnet"
```

## Frontend Integration

The frontend utilities in `app/util/safeSendContract.js` now include:

### New Functions

```javascript
// Check if oracle is configured
const isConfigured = await isFraudOracleConfigured();

// Query oracle status for an escrow
const { isFlagged, reason } = await queryOracleStatus(escrowId);

// Get oracle address
const oracleAddress = await getFraudOracle();

// Check if current wallet is the oracle
const isOracle = await isFraudOracle(walletAddress);
```

### Usage Example

```javascript
// When creating an escrow, the oracle is automatically checked
try {
  const escrowId = await createEscrow(walletClient, seller, amount, description);
  // Success - escrow created and passed fraud checks
} catch (error) {
  if (error.message.includes('Fraud detected')) {
    // Transaction was flagged and refunded
    console.error('Fraud reason:', error.message);
  }
}

// Check oracle status after creation
const status = await queryOracleStatus(escrowId);
if (status.isFlagged) {
  console.log('Escrow flagged:', status.reason);
}
```

## Oracle Management

### Contract Owner Functions

```javascript
// Update oracle address (owner only)
await updateFraudOracle(walletClient, newOracleAddress);
```

### Oracle Owner Functions

The oracle owner can:

1. **Manually flag escrows**:
   ```solidity
   fraudOracle.flagEscrow(escrowId, flaggedAddress, "Reason");
   ```

2. **Blacklist addresses**:
   ```solidity
   fraudOracle.blacklistAddress(address, "Reason");
   ```

3. **Update limits**:
   ```solidity
   fraudOracle.setMaxTransactionAmount(10000 * 10**6); // 10k PYUSD
   fraudOracle.setDisputeWindow(14 days);
   ```

4. **Clear flags**:
   ```solidity
   fraudOracle.clearFlag(escrowId);
   fraudOracle.whitelistAddress(address);
   ```

## Testing

After deployment, compile your contracts to update the ABI:

```bash
cd contracts
yarn build
```

This will update `contracts/artifacts/contracts/SafeSendContract.sol/SafeSendContract.json` with the new functions.

Then copy the updated ABI to your frontend:

```bash
# Update the ABI in app/util/metadata.js with the compiled artifact
```

## Security Considerations

1. **Oracle Failure Handling**: Contract continues if oracle call fails
2. **Automatic Refunds**: Flagged escrows are immediately refunded
3. **No Oracle Lock-in**: Can be updated by contract owner
4. **View-only Query**: `queryOracleStatus()` doesn't modify state
5. **Event Logging**: All fraud flags are logged on-chain

## Upgrading from Non-Oracle Setup

If you already have a SafeSendContract deployed without an oracle:

1. Deploy `SimpleFraudOracle`
2. Call `updateFraudOracle(oracleAddress)` on existing contract (as owner)
3. Existing escrows continue to function
4. New escrows will be checked by oracle

## Summary

The fraud oracle integration:
- ✅ **Automatic**: Checks run during deposit
- ✅ **Safe**: Failures don't break the contract
- ✅ **Transparent**: All flags logged as events
- ✅ **Flexible**: Oracle can be updated
- ✅ **User-friendly**: Flagged transactions auto-refund
- ✅ **Standardized**: Uses `IFraudOracle` interface
