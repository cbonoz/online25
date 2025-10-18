#!/usr/bin/env node

/**
 * SafeSend Contract Deployment Script
 * 
 * Deploys the SafeSend contract with optional fraud oracle configuration
 * 
 * Usage:
 *   # Deploy without fraud oracle (disabled)
 *   node scripts/deploy-with-oracle.js --network sepolia
 * 
 *   # Deploy with fraud oracle
 *   node scripts/deploy-with-oracle.js --network sepolia --oracle 0x1234567890abcdef1234567890abcdef12345678
 * 
 *   # Deploy with fraud oracle from environment
 *   FRAUD_ORACLE=0x1234... node scripts/deploy-with-oracle.js --network sepolia
 */

import { execSync } from 'child_process';
import { Command } from 'commander';
import { getDeploymentParams } from '../config/deployment.js';

const program = new Command();

program
  .name('deploy-with-oracle')
  .description('Deploy SafeSend contract with fraud oracle configuration')
  .option('-n, --network <network>', 'Network to deploy to (sepolia, mainnet)', 'sepolia')
  .option('-o, --oracle <address>', 'Fraud oracle address (optional)')
  .option('--dry-run', 'Show deployment parameters without deploying')
  .parse();

const options = program.opts();

// Get fraud oracle address from various sources
const fraudOracleAddress = 
  options.oracle || 
  process.env.FRAUD_ORACLE || 
  process.env.FRAUD_ORACLE_ADDRESS || 
  '0x0000000000000000000000000000000000000000';

// Validate network
const validNetworks = ['sepolia', 'mainnet'];
if (!validNetworks.includes(options.network)) {
  console.error(`❌ Invalid network: ${options.network}`);
  console.error(`   Valid networks: ${validNetworks.join(', ')}`);
  process.exit(1);
}

// Validate fraud oracle address if provided
if (fraudOracleAddress !== '0x0000000000000000000000000000000000000000') {
  if (!/^0x[a-fA-F0-9]{40}$/.test(fraudOracleAddress)) {
    console.error(`❌ Invalid fraud oracle address: ${fraudOracleAddress}`);
    console.error('   Address must be a valid Ethereum address (0x followed by 40 hex characters)');
    process.exit(1);
  }
}

// Get deployment parameters
const deployParams = getDeploymentParams(options.network, fraudOracleAddress);

console.log('\n🚀 SafeSend Contract Deployment Configuration');
console.log('================================================');
console.log(`Network:           ${deployParams.network} (${deployParams.chainId})`);
console.log(`PYUSD Token:       ${deployParams.pyusdToken}`);
console.log(`Fraud Oracle:      ${deployParams.fraudOracle}`);
console.log(`Oracle Status:     ${fraudOracleAddress === '0x0000000000000000000000000000000000000000' ? '❌ Disabled' : '✅ Enabled'}`);
console.log('================================================\n');

if (options.dryRun) {
  console.log('🔍 Dry run mode - deployment parameters shown above');
  console.log('💡 Remove --dry-run flag to proceed with deployment');
  process.exit(0);
}

// Prepare deployment command
const deployCommand = [
  'npx hardhat ignition deploy',
  `--network ${options.network}`,
  'ignition/modules/SafeSendContract.ts',
  `--parameters '{"SafeSendContractModule":{"fraudOracle":"${deployParams.fraudOracle}"}}'`
].join(' ');

console.log('🔧 Deployment command:');
console.log(`   ${deployCommand}\n`);

try {
  console.log('📦 Starting deployment...\n');
  
  const output = execSync(deployCommand, { 
    encoding: 'utf-8',
    cwd: process.cwd(),
    stdio: 'inherit'
  });
  
  console.log('\n✅ Deployment completed successfully!');
  
  if (fraudOracleAddress !== '0x0000000000000000000000000000000000000000') {
    console.log('\n🛡️  Fraud Oracle Configuration:');
    console.log(`   Oracle Address: ${fraudOracleAddress}`);
    console.log('   Oracle Status:  Active');
    console.log('\n📋 Next Steps:');
    console.log('   1. Verify the oracle address has sufficient ETH for gas');
    console.log('   2. Test oracle functionality with markFraud() calls');
    console.log('   3. Set up monitoring/alerting for the oracle service');
  } else {
    console.log('\n⚠️  Fraud Oracle: DISABLED');
    console.log('   To enable fraud protection:');
    console.log('   1. Deploy an oracle service');
    console.log('   2. Call updateFraudOracle() as contract owner');
    console.log('   3. Or redeploy with --oracle parameter');
  }
  
} catch (error) {
  console.error('\n❌ Deployment failed:', error.message);
  process.exit(1);
}