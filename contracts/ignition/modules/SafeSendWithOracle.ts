import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * SafeSend with Fraud Oracle Deployment Module
 * 
 * This module:
 * 1. Deploys SimpleFraudOracle
 * 2. Deploys SafeSendContract with the oracle address
 * 
 * Usage:
 *   npx hardhat ignition deploy ignition/modules/SafeSendWithOracle.ts --network sepolia
 */
export default buildModule("SafeSendWithOracleModule", (m) => {
  // Get network from environment or default to sepolia
  const network = process.env.HARDHAT_NETWORK || process.env.NEXT_PUBLIC_NETWORK || 'sepolia';
  
  // PYUSD token addresses
  const defaultPyusdAddress = network === 'mainnet'
    ? '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8' // mainnet address
    : '0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9'; // sepolia address
  
  // Get PYUSD token address from parameters (with network-appropriate default)
  const pyusdTokenAddress = m.getParameter("pyusdToken", defaultPyusdAddress);
  
  // Step 1: Deploy SimpleFraudOracle
  const fraudOracle = m.contract("SimpleFraudOracle");
  
  // Step 2: Deploy SafeSendContract with the oracle address
  const safeSendContract = m.contract("SafeSendContract", [
    pyusdTokenAddress,
    fraudOracle
  ]);

  return { 
    fraudOracle,
    safeSendContract
  };
});
