# SafeSend Contract Deployment Guide

## Quick Start

### Deploy without Fraud Oracle (Fraud Protection Disabled)
```bash
cd contracts
yarn deploy:oracle:sepolia
```

### Deploy with Fraud Oracle (Fraud Protection Enabled)
```bash
cd contracts
yarn deploy:oracle:sepolia --oracle 0xYourFraudOracleAddress
```

## Deployment Commands

| Command | Description |
|---------|-------------|
| `yarn deploy:oracle:sepolia` | Deploy to Sepolia testnet |
| `yarn deploy:oracle:mainnet` | Deploy to Ethereum mainnet |
| `yarn deploy:oracle --network sepolia --oracle 0x...` | Deploy with specific oracle |
| `yarn deploy:oracle --dry-run` | Preview deployment without deploying |

## Oracle Configuration

### Who Controls the Fraud Oracle?

1. **During Deployment**: Any deployer can specify the oracle address
2. **After Deployment**: Only the contract owner can update via `updateFraudOracle()`
3. **Oracle Operations**: Only the designated oracle address can mark fraud

### Oracle Address Options

- **Zero Address** (`0x0000000000000000000000000000000000000000`): Disables fraud protection
- **EOA Address**: Individual account controls fraud detection
- **Multi-sig Address**: Multiple parties control fraud detection
- **Contract Address**: Automated fraud detection logic

### Example Oracle Addresses

```bash
# Individual account
yarn deploy:oracle:sepolia --oracle 0x742d35Cc6635C0532925a3b8D9C1aCb4d3D9b123

# Multi-sig wallet (recommended for production)
yarn deploy:oracle:sepolia --oracle 0x1234567890123456789012345678901234567890

# Automated oracle contract
yarn deploy:oracle:sepolia --oracle 0xabcdefabcdefabcdefabcdefabcdefabcdefabcd
```

## Fraud Oracle Business Models

### Model 1: Platform-Controlled Oracle
- **Use Case**: Centralized marketplace (like PayPal)
- **Oracle**: Platform's internal fraud detection system
- **Benefits**: Consistent policies, automated detection
- **Setup**: Platform deploys with their oracle address

### Model 2: Third-Party Oracle Service
- **Use Case**: Independent escrow service
- **Oracle**: Professional fraud detection company
- **Benefits**: Specialized expertise, neutral party
- **Setup**: Service provider gives oracle address

### Model 3: Community Oracle
- **Use Case**: Decentralized marketplace
- **Oracle**: Multi-sig of trusted community members
- **Benefits**: Decentralized governance
- **Setup**: Deploy with multi-sig address

### Model 4: No Oracle (Self-Service)
- **Use Case**: Peer-to-peer transactions
- **Oracle**: None (0x0000...)
- **Benefits**: No intermediary needed
- **Setup**: Deploy without oracle parameter

## Post-Deployment Management

### Check Oracle Status
```javascript
const oracleAddress = await safeSendContract.fraudOracle();
const isEnabled = oracleAddress !== '0x0000000000000000000000000000000000000000';
console.log('Fraud Oracle:', isEnabled ? oracleAddress : 'Disabled');
```

### Update Oracle (Owner Only)
```javascript
// Only contract owner can do this
await safeSendContract.updateFraudOracle(newOracleAddress);
```

### Oracle Operations
```javascript
// Only designated oracle can do this
await safeSendContract.markFraud(escrowId);
```

## Security Considerations

### Oracle Trust
- Oracle has power to trigger refunds
- Choose oracle address carefully
- Consider multi-sig for production

### Owner Responsibilities
- Can change oracle at any time
- Should communicate oracle changes
- Consider timelock for oracle updates

### Oracle Responsibilities
- Monitor escrows for fraud
- Respond to fraud reports
- Maintain secure private keys

## Troubleshooting

### Common Issues

**Oracle not working?**
- Check if oracle address is configured (not 0x0000...)
- Verify oracle has ETH for gas fees
- Confirm oracle private key security

**Can't update oracle?**
- Only contract owner can update
- Check if caller is the owner address
- Verify new oracle address is valid

**Fraud marking failing?**
- Only oracle can mark fraud
- Check if escrow is still active
- Verify oracle has sufficient gas

### Support

For deployment issues or questions:
1. Check the deployment script output
2. Verify network configuration
3. Confirm oracle address format
4. Review gas settings and ETH balance