'use client';

import { 
    readContract, 
    writeContract,
    formatUnits,
    parseUnits,
    createPublicClient,
    http
} from 'viem';
import { handleContractError, formatDate } from '.';
import { PYUSD_TOKEN_ADDRESS, ACTIVE_CHAIN, siteConfig } from '../constants';
import { SAFESEND_CONTRACT } from './metadata';

// Create a public client for reading from the chain
const publicClient = createPublicClient({
    chain: ACTIVE_CHAIN,
    transport: http()
});

// Helper function to check if SafeSend contract is deployed and available
export const isContractAvailable = () => {
    return !!siteConfig.contractAddress;
};

// Get contract address with validation
export const getContractAddress = () => {
    if (!isContractAvailable()) {
        throw new Error('SafeSendContract address not configured. Running in demo mode.');
    }
    return siteConfig.contractAddress;
};

// Enum for escrow status (matching Solidity enum)
export const EscrowStatus = {
    Active: 0,
    Released: 1,
    Refunded: 2,
    FraudFlagged: 3
};

export const getStatusText = (status) => {
    switch (status) {
        case EscrowStatus.Active: return 'Active';
        case EscrowStatus.Released: return 'Released';
        case EscrowStatus.Refunded: return 'Refunded';
        case EscrowStatus.FraudFlagged: return 'Fraud Flagged';
        default: return 'Unknown';
    }
};

// Create a new escrow deposit
export const createEscrow = async (walletClient, seller, amount, description) => {
    try {
        if (!isContractAvailable()) {
            throw new Error('Contract not available - running in demo mode');
        }

        const contractAddress = getContractAddress();
        const amountInWei = parseUnits(amount.toString(), 6); // PYUSD has 6 decimals

        console.log('Creating escrow:', {
            seller,
            amount,
            amountInWei: amountInWei.toString(),
            description,
            contractAddress
        });

        // First, approve PYUSD spending
        await approveToken(walletClient, amountInWei);

        // Then create the escrow
        const hash = await writeContract(walletClient, {
            address: contractAddress,
            abi: SAFESEND_CONTRACT.abi,
            functionName: 'deposit',
            args: [seller, amountInWei, description]
        });

        return hash;
    } catch (error) {
        console.error('Error creating escrow:', error);
        handleContractError(error, 'create escrow');
        throw error;
    }
};

// Approve PYUSD token spending
export const approveToken = async (walletClient, amount) => {
    try {
        if (!isContractAvailable()) {
            throw new Error('Contract not available - running in demo mode');
        }

        const contractAddress = getContractAddress();
        
        // ERC20 ABI for approve function
        const ERC20_ABI = [
            {
                "inputs": [
                    {"internalType": "address", "name": "spender", "type": "address"},
                    {"internalType": "uint256", "name": "amount", "type": "uint256"}
                ],
                "name": "approve",
                "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ];

        const hash = await writeContract(walletClient, {
            address: PYUSD_TOKEN_ADDRESS,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [contractAddress, amount]
        });

        console.log('Token approval hash:', hash);
        return hash;
    } catch (error) {
        console.error('Error approving token:', error);
        handleContractError(error, 'approve token');
        throw error;
    }
};

// Release escrow funds to seller
export const releaseEscrow = async (walletClient, escrowId) => {
    try {
        if (!isContractAvailable()) {
            throw new Error('Contract not available - running in demo mode');
        }

        const contractAddress = getContractAddress();
        
        const hash = await writeContract(walletClient, {
            address: contractAddress,
            abi: SAFESEND_CONTRACT.abi,
            functionName: 'release',
            args: [escrowId]
        });

        return hash;
    } catch (error) {
        console.error('Error releasing escrow:', error);
        handleContractError(error, 'release escrow');
        throw error;
    }
};

// Refund escrow to buyer
export const refundEscrow = async (walletClient, escrowId) => {
    try {
        if (!isContractAvailable()) {
            throw new Error('Contract not available - running in demo mode');
        }

        const contractAddress = getContractAddress();
        
        const hash = await writeContract(walletClient, {
            address: contractAddress,
            abi: SAFESEND_CONTRACT.abi,
            functionName: 'refund',
            args: [escrowId]
        });

        return hash;
    } catch (error) {
        console.error('Error refunding escrow:', error);
        handleContractError(error, 'refund escrow');
        throw error;
    }
};

// Get escrow details by ID
export const getEscrow = async (escrowId) => {
    try {
        if (!isContractAvailable()) {
            throw new Error('Contract not available - running in demo mode');
        }

        const contractAddress = getContractAddress();
        
        const escrow = await readContract(publicClient, {
            address: contractAddress,
            abi: SAFESEND_CONTRACT.abi,
            functionName: 'getEscrow',
            args: [escrowId]
        });

        return {
            id: Number(escrow.id),
            buyer: escrow.buyer,
            seller: escrow.seller,
            amount: formatUnits(escrow.amount, 6),
            description: escrow.description,
            status: escrow.status,
            statusText: getStatusText(escrow.status),
            createdAt: formatDate(new Date(Number(escrow.createdAt) * 1000)),
            fraudFlagged: escrow.fraudFlagged
        };
    } catch (error) {
        console.error('Error getting escrow:', error);
        handleContractError(error, 'get escrow');
        throw error;
    }
};

// Get all escrows for a buyer
export const getBuyerEscrows = async (buyerAddress) => {
    try {
        if (!isContractAvailable()) {
            throw new Error('Contract not available - running in demo mode');
        }

        const contractAddress = getContractAddress();
        
        const escrowIds = await readContract(publicClient, {
            address: contractAddress,
            abi: SAFESEND_CONTRACT.abi,
            functionName: 'getBuyerEscrows',
            args: [buyerAddress]
        });

        // Fetch details for each escrow
        const escrows = await Promise.all(
            escrowIds.map(id => getEscrow(Number(id)))
        );

        return escrows;
    } catch (error) {
        console.error('Error getting buyer escrows:', error);
        handleContractError(error, 'get buyer escrows');
        throw error;
    }
};

// Get all escrows for a seller
export const getSellerEscrows = async (sellerAddress) => {
    try {
        if (!isContractAvailable()) {
            throw new Error('Contract not available - running in demo mode');
        }

        const contractAddress = getContractAddress();
        
        const escrowIds = await readContract(publicClient, {
            address: contractAddress,
            abi: SAFESEND_CONTRACT.abi,
            functionName: 'getSellerEscrows',
            args: [sellerAddress]
        });

        // Fetch details for each escrow
        const escrows = await Promise.all(
            escrowIds.map(id => getEscrow(Number(id)))
        );

        return escrows;
    } catch (error) {
        console.error('Error getting seller escrows:', error);
        handleContractError(error, 'get seller escrows');
        throw error;
    }
};

// Get total escrow count
export const getEscrowCounter = async () => {
    try {
        if (!isContractAvailable()) {
            throw new Error('Contract not available - running in demo mode');
        }

        const contractAddress = getContractAddress();
        
        const counter = await readContract(publicClient, {
            address: contractAddress,
            abi: SAFESEND_CONTRACT.abi,
            functionName: 'escrowCounter'
        });

        return Number(counter);
    } catch (error) {
        console.error('Error getting escrow counter:', error);
        handleContractError(error, 'get escrow counter');
        throw error;
    }
};

// Get PYUSD token address from contract
export const getPyusdTokenAddress = async () => {
    try {
        if (!isContractAvailable()) {
            return PYUSD_TOKEN_ADDRESS; // fallback to constant
        }

        const contractAddress = getContractAddress();
        
        const tokenAddress = await readContract(publicClient, {
            address: contractAddress,
            abi: SAFESEND_CONTRACT.abi,
            functionName: 'pyusdToken'
        });

        return tokenAddress;
    } catch (error) {
        console.error('Error getting PYUSD token address:', error);
        return PYUSD_TOKEN_ADDRESS; // fallback to constant
    }
};

// Get fraud oracle address
export const getFraudOracle = async () => {
    try {
        if (!isContractAvailable()) {
            throw new Error('Contract not available - running in demo mode');
        }

        const contractAddress = getContractAddress();
        
        const oracleAddress = await readContract(publicClient, {
            address: contractAddress,
            abi: SAFESEND_CONTRACT.abi,
            functionName: 'fraudOracle'
        });

        return oracleAddress;
    } catch (error) {
        console.error('Error getting fraud oracle:', error);
        handleContractError(error, 'get fraud oracle');
        throw error;
    }
};