# SafeSendContract



### Running Tests

To run all the tests in the project, execute the following command:

```shell
yarn test
```


### Make a deployment to Sepolia

This project includes Ignition modules to deploy the SafeSendContract with automatic PYUSD address detection based on the network.

## Local Testing with Mock Token

For local testing with a mock PYUSD token:

```shell
yarn deploy:test
```

## Production Deployment 

The deployment modules automatically use the correct PYUSD addresses for each network:

### Sepolia Testnet:
```shell
yarn deploy:sepolia
```

### Mainnet:
```shell
yarn deploy:mainnet
```

## Environment Variables

Set these environment variables for production deployments:

```bash
# Optional: Your fraud oracle address (leave unset or set to 0x0000... to disable oracle)
export FRAUD_ORACLE_ADDRESS="0xYourFraudOracleAddress"

# Optional: Override network detection
export NEXT_PUBLIC_NETWORK="mainnet" # or "sepolia"
```

## Fraud Oracle Configuration

The SafeSendContract supports optional fraud oracle functionality:

- **With Oracle**: Set `FRAUD_ORACLE_ADDRESS` to a valid address to enable fraud protection
- **Without Oracle**: Leave `FRAUD_ORACLE_ADDRESS` unset or set to `0x0000000000000000000000000000000000000000` to disable oracle functionality

When oracle is disabled:
- Only buyers can initiate refunds
- `markFraud()` function becomes unavailable
- Contract operates as a simple buyer-controlled escrow

## PYUSD Addresses Used

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
