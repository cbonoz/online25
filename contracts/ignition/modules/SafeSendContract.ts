import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { getDeploymentParams } from "../../config/deployment.js";

export default buildModule("SafeSendContractModule", (m) => {
  // Get deployment parameters based on current network
  const deployParams = getDeploymentParams();
  
  // Get PYUSD token address from config (can still be overridden via parameters)
  const pyusdTokenAddress = m.getParameter("pyusdToken", deployParams.pyusdToken);
  
  // Set fraud oracle address (can be set via environment variable or parameter)
  const fraudOracle = m.getParameter("fraudOracle", deployParams.fraudOracle);
  
  // Deploy SafeSend contract with the configured addresses
  const safeSendContract = m.contract("SafeSendContract", [pyusdTokenAddress, fraudOracle]);

  return { 
    safeSendContract
  };
});