import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SafeSendContractModule", (m) => {
  // Get network from environment or default to sepolia
  const network = process.env.HARDHAT_NETWORK || process.env.NEXT_PUBLIC_NETWORK || 'sepolia';
  
  // PYUSD token addresses
  const defaultPyusdAddress = network === 'mainnet'
    ? '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8' // mainnet address
    : '0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9'; // sepolia address
  
  // Get PYUSD token address from parameters (with network-appropriate default)
  const pyusdTokenAddress = m.getParameter("pyusdToken", defaultPyusdAddress);
  
  // Set fraud oracle address (defaults to zero address if not provided)
  const fraudOracle = m.getParameter("fraudOracle", "0x0000000000000000000000000000000000000000");
  
  // Deploy SafeSend contract with the configured addresses
  const safeSendContract = m.contract("SafeSendContract", [pyusdTokenAddress, fraudOracle]);

  return { 
    safeSendContract
  };
});