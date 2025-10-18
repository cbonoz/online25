# Fraud Oracle Architecture

## Current Implementation

### Global Fraud Oracle Model
The SafeSendContract currently implements a **single global fraud oracle** architecture:

```solidity
contract SafeSendContract {
    address public fraudOracle;  // Single oracle for entire contract
    
    modifier onlyFraudOracle() {
        require(fraudOracle != address(0), "No fraud oracle configured");
        require(msg.sender == fraudOracle, "Only fraud oracle can call this");
        _;
    }
}
```

### Key Features
1. **Oracle Configuration**: Set during deployment or updated by contract owner
2. **Fraud Detection**: Oracle can call `markFraud(escrowId)` to flag fraudulent transactions
3. **Automatic Refunds**: Fraud flagging triggers immediate refund to buyer
4. **Oracle Refunds**: Oracle can initiate refunds on behalf of buyers

## Deployment Configuration

### Fraud Oracle as Constructor Parameter
The fraud oracle address is set during contract deployment via constructor parameter:

```solidity
constructor(address _pyusdToken, address _fraudOracle) Ownable(msg.sender) {
    require(_pyusdToken != address(0), "Invalid PYUSD token address");
    // Note: _fraudOracle can be address(0) to disable oracle functionality
    
    pyusdToken = IERC20(_pyusdToken);
    fraudOracle = _fraudOracle;
}
```

### Deployment Options

#### Option 1: Deploy without Fraud Oracle (Default)
```bash
cd contracts
yarn deploy:oracle:sepolia
# Deploys with fraud oracle disabled (0x0000...)
```

#### Option 2: Deploy with Specific Fraud Oracle
```bash
cd contracts
yarn deploy:oracle:sepolia --oracle 0x1234567890abcdef1234567890abcdef12345678
```

#### Option 3: Deploy with Oracle from Environment
```bash
cd contracts
FRAUD_ORACLE=0x1234567890abcdef1234567890abcdef12345678 yarn deploy:oracle:sepolia
```

#### Option 4: Use Hardhat Ignition Parameters
```bash
cd contracts
npx hardhat ignition deploy --network sepolia ignition/modules/SafeSendContract.ts \
  --parameters '{"SafeSendContractModule":{"fraudOracle":"0x1234567890abcdef1234567890abcdef12345678"}}'
```

### Deployment Script Features

The `deploy-with-oracle.js` script provides:

- **Network Selection**: Deploy to sepolia, mainnet, etc.
- **Oracle Configuration**: Optional fraud oracle address
- **Validation**: Checks for valid Ethereum addresses
- **Dry Run Mode**: Preview deployment parameters
- **Flexible Input**: Command line args, environment variables

#### Usage Examples

```bash
# Preview deployment parameters
node scripts/deploy-with-oracle.js --network sepolia --dry-run

# Deploy without oracle (fraud protection disabled)
node scripts/deploy-with-oracle.js --network sepolia

# Deploy with oracle
node scripts/deploy-with-oracle.js --network sepolia --oracle 0xYourOracleAddress

# Deploy to mainnet with oracle
node scripts/deploy-with-oracle.js --network mainnet --oracle 0xYourOracleAddress
```

## Oracle Management

### Updating Fraud Oracle (Owner Only)
```javascript
// Only contract owner can update
await updateFraudOracle(walletClient, newOracleAddress);
```

### Checking Oracle Status
```javascript
// Check if oracle is configured
const isConfigured = await isFraudOracleConfigured();

// Get current oracle address  
const oracleAddress = await getFraudOracle();

// Check if wallet is the oracle
const isOracle = await isFraudOracle(walletAddress);
```

## Business Integration Models

### Option 1: Centralized Oracle Service
- **Single trusted oracle** serves all businesses
- Oracle monitors transactions across all escrows
- Suitable for platform-controlled environments

### Option 2: Business-Specific Oracles (Future Enhancement)
Would require contract modification to support per-escrow oracles:

```solidity
struct Escrow {
    // ... existing fields
    address fraudOracle;  // Per-escrow oracle
}

function deposit(
    address seller,
    uint256 amount, 
    string memory description,
    address _fraudOracle  // Optional oracle for this escrow
) external returns (uint256) {
    // Set oracle during escrow creation
}
```

### Option 3: Multi-Oracle Consensus (Advanced)
- Multiple oracles vote on fraud detection
- Requires threshold consensus for fraud flagging
- Higher security but more complex implementation

## Oracle Implementation Examples

### Simple Fraud Oracle Service
```javascript
class FraudOracleService {
    constructor(privateKey, contractAddress) {
        this.wallet = new ethers.Wallet(privateKey);
        this.contract = new ethers.Contract(contractAddress, abi, this.wallet);
    }
    
    async monitorEscrow(escrowId) {
        // Implement fraud detection logic
        const escrow = await this.contract.getEscrow(escrowId);
        
        if (await this.detectFraud(escrow)) {
            await this.contract.markFraud(escrowId);
            console.log(`Fraud detected and flagged for escrow ${escrowId}`);
        }
    }
    
    async detectFraud(escrow) {
        // Custom fraud detection logic
        // - Check transaction patterns
        // - Verify seller reputation 
        // - Analyze dispute history
        // - External data sources
        return false;
    }
}
```

### Oracle Integration with External Services
```javascript
class AdvancedFraudOracle {
    async detectFraud(escrow) {
        // Check multiple data sources
        const checks = await Promise.all([
            this.checkSellerReputation(escrow.seller),
            this.analyzeTransactionPattern(escrow),
            this.checkExternalBlacklists(escrow.seller),
            this.verifyBusinessLegitimacy(escrow.description)
        ]);
        
        return checks.some(check => check.isFraudulent);
    }
}
```

## Current UI Features

### Fraud Oracle Dashboard
- **Oracle Status Indicator**: Shows if oracle is configured
- **Oracle Permissions**: Special UI for oracle wallets
- **Fraud Flagging**: One-click fraud marking for oracles
- **Oracle Information**: Display oracle address and status

### User Experience
1. **Regular Users**: See oracle protection status
2. **Oracle Wallets**: Access to fraud management functions
3. **Contract Owner**: Can update oracle address

## Security Considerations

### Oracle Trust Model
- Oracle has significant power (can trigger refunds)
- Single point of failure if oracle is compromised
- Oracle actions are irreversible

### Mitigation Strategies
1. **Multi-sig Oracle**: Use multi-signature wallet for oracle
2. **Time Delays**: Add delays for fraud flagging
3. **Appeal Process**: Allow disputes of fraud decisions
4. **Audit Trails**: Log all oracle actions

## Future Enhancements

### Per-Business Oracle Support
```solidity
mapping(address => address) public businessOracles;  // business -> oracle
mapping(uint256 => address) public escrowOracles;    // escrow -> oracle

function setBusinessOracle(address oracle) external {
    businessOracles[msg.sender] = oracle;
}
```

### Oracle Reputation System
```solidity
struct OracleStats {
    uint256 totalDecisions;
    uint256 successfulDecisions;
    uint256 disputedDecisions;
    uint256 reputationScore;
}

mapping(address => OracleStats) public oracleReputation;
```

### Programmable Fraud Detection
```solidity
interface IFraudDetector {
    function checkFraud(uint256 escrowId) external view returns (bool);
}

contract SafeSendContract {
    IFraudDetector public fraudDetector;
    
    function autoCheckFraud(uint256 escrowId) external {
        if (fraudDetector.checkFraud(escrowId)) {
            markFraud(escrowId);
        }
    }
}
```

## Getting Started

### 1. Deploy Contract with Oracle
```bash
cd contracts

# Option A: Deploy without oracle (fraud protection disabled)
yarn deploy:oracle:sepolia

# Option B: Deploy with oracle address
yarn deploy:oracle:sepolia --oracle 0xYourOracleAddress

# Option C: Deploy with oracle from environment
FRAUD_ORACLE=0xYourOracleAddress yarn deploy:oracle:sepolia
```

### 2. Verify Oracle Setup
```javascript
// In browser console or script
const oracleConfigured = await isFraudOracleConfigured();
const oracleAddress = await getFraudOracle();
console.log('Oracle configured:', oracleConfigured);
console.log('Oracle address:', oracleAddress);
```

### 3. Test Oracle Functions
```javascript
// As oracle wallet
await markFraud(walletClient, escrowId);

// As contract owner (to update oracle)
await updateFraudOracle(walletClient, newOracleAddress);
```

### 4. Oracle Service Implementation
```javascript
// Example oracle service
class FraudOracleService {
    constructor(privateKey, contractAddress) {
        this.wallet = new ethers.Wallet(privateKey);
        this.contract = new ethers.Contract(contractAddress, abi, this.wallet);
    }
    
    async monitorEscrows() {
        // Monitor active escrows
        const activeEscrows = await this.getActiveEscrows();
        
        for (const escrow of activeEscrows) {
            if (await this.detectFraud(escrow)) {
                await this.contract.markFraud(escrow.id);
                console.log(`Fraud flagged for escrow ${escrow.id}`);
            }
        }
    }
}
```

## Conclusion

The current implementation provides a solid foundation for fraud protection with a global oracle model. For businesses requiring more granular control, the architecture can be extended to support per-business or per-escrow oracles while maintaining the core security and functionality.