import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SafeSendContractTestModule", (m) => {
  // Deploy Mock PYUSD token for testing
  const mockPYUSD = m.contract("MockERC20", ["PayPal USD", "PYUSD", 6]);
  
  // Set fraud oracle address for testing
  const fraudOracle = m.getParameter("fraudOracle", "0x0000000000000000000000000000000000000000");
  
  // Deploy SafeSend contract with mock token
  const safeSendContract = m.contract("SafeSendContract", [mockPYUSD, fraudOracle]);

  return { 
    safeSendContract,
    mockPYUSD
  };
});