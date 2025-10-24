# SafeSendContract

## Deployment Options

SafeSend can be deployed with or without fraud oracle protection:

### Option 1: Deploy with Fraud Oracle (Recommended)

This automatically deploys both the SimpleFraudOracle AND SafeSendContract, linking them together:

```shell
# Deploy to Sepolia with oracle
yarn deploy:with-oracle

# Or to mainnet
HARDHAT_NETWORK=mainnet npx hardhat ignition deploy --network mainnet ignition/modules/SafeSendWithOracle.ts
```

**What this does:**
1. Deploys SimpleFraudOracle contract
2. Deploys SafeSendContract with the oracle address as a constructor parameter
3. The contracts are permanently linked - SafeSendContract knows its oracle address
4. Outputs both contract addresses for your `.env` file

### Option 2: Deploy without Oracle

Deploy SafeSendContract standalone (oracle disabled):

```shell
# Sepolia
yarn deploy:sepolia

# Mainnet  
yarn deploy:mainnet
```

---

## Running Tests

To run all the tests in the project, execute the following command:

```shell
yarn test
```

---

## How Oracle Integration Works

When using `deploy:with-oracle`, the deployment process:

1. **Deploys SimpleFraudOracle** - Creates the fraud detection contract
2. **Deploys SafeSendContract** - Passes the oracle address to the constructor:
   ```solidity
   constructor(address _pyusdToken, address _fraudOracle) {
       pyusdToken = IERC20(_pyusdToken);
       fraudOracle = _fraudOracle;  // Oracle address stored on deployment
   }
   ```
3. **Returns both addresses** - Use these in your frontend `.env`:
   ```bash
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x...  # SafeSendContract address
   NEXT_PUBLIC_FRAUD_ORACLE_ADDRESS=0x...  # SimpleFraudOracle address
   ```

The oracle can be updated later by the contract owner using `updateFraudOracle(newAddress)`.

---

## Local Testing with Mock Token

For local testing with a mock PYUSD token:

```shell
yarn deploy:test
```

---

## Environment Variables for Frontend

After deployment, add these to your frontend `.env` file:

```bash
# Required: Your deployed SafeSendContract address
NEXT_PUBLIC_CONTRACT_ADDRESS="0xYourSafeSendContractAddress"

# Optional: Your SimpleFraudOracle address (if deployed with oracle)
NEXT_PUBLIC_FRAUD_ORACLE_ADDRESS="0xYourFraudOracleAddress"

# Network selection
NEXT_PUBLIC_NETWORK="sepolia" # or "mainnet"
```

---

## Oracle Behavior

When oracle is **enabled** (deployed with `deploy:with-oracle`):
- Automatic fraud checks on every escrow deposit
- Oracle owner can manually flag suspicious transactions
- Flagged escrows automatically refund the buyer

When oracle is **disabled** (deployed without oracle):
- Only buyers can initiate refunds
- `markFraud()` function unavailable
- Contract operates as simple buyer-controlled escrow

---## PYUSD Addresses Used

- **Ethereum Mainnet**: `0x6c3ea9036406852006290770BEdFcAbA0e23A0e8`
- **Sepolia Testnet**: `0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9`

These addresses are automatically selected based on the deployment network and match your frontend configuration.

To run the deployment to Sepolia, you need an account with funds to send the transaction. The provided Hardhat configuration includes a Configuration Variable called `SEPOLIA_PRIVATE_KEY`, which you can use to set the private key of the account you want to use.

You can set the `SEPOLIA_PRIVATE_KEY` variable using the `hardhat-keystore` plugin or by setting it as an environment variable.

To set the `SEPOLIA_PRIVATE_KEY` config variable using `hardhat-keystore`:

```shell
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

After setting the variable, you can run the deployment with the Sepolia network:

```shell
npx hardhat ignition deploy --network sepolia ignition/modules/SafeSendContract.ts
```
