'use client';

import { 
    readContract, 
    writeContract, 
    getContract,
    formatUnits,
    parseUnits,
    createPublicClient,
    http
} from 'viem';
import { handleContractError, formatDate, executeApprovalWithRetry } from '.';
import { PYUSD_TOKEN_ADDRESS, ACTIVE_CHAIN } from '../constants';
import { SAFESEND_CONTRACT } from './metadata';


// Create a simple public client
const publicClient = createPublicClient({
    chain: ACTIVE_CHAIN,
    transport: http()
});

// Add a simple delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Track concurrent requests to avoid overwhelming RPC
let activeRequests = 0;
const MAX_CONCURRENT_REQUESTS = 2;

// Combined metadata and status fetch (simplified)
export const getMetadata = async (walletClient, address) => {
    console.log('🔍 getMetadata function called with:', { 
        walletClient: !!walletClient, 
        address,
        publicClient: !!publicClient,
        activeRequests,
        chainId: ACTIVE_CHAIN.id,
        chainName: ACTIVE_CHAIN.name
    });
    
    // Wait if too many concurrent requests
    while (activeRequests >= MAX_CONCURRENT_REQUESTS) {
        console.log('⏳ Waiting for available request slot...');
        await delay(500);
    }
    
    activeRequests++;
    
    try {
        console.log('Fetching metadata for contract:', address);
        console.log('Using public client:', !!publicClient);
        console.log('Chain info:', { id: ACTIVE_CHAIN.id, name: ACTIVE_CHAIN.name });
        
        // Validate contract address format
        if (!address || !address.startsWith('0x') || address.length !== 42) {
            throw new Error(`Invalid contract address format: ${address}`);
        }

        // Get offer metadata with timeout
        console.log('📞 Calling publicClient.readContract for getOfferMetadata...');
        const metadata = await Promise.race([
            publicClient.readContract({
                address: address,
                abi: SAFESEND_CONTRACT.abi,
                functionName: 'getOfferMetadata',
            }),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Metadata read timeout after 10 seconds')), 10000)
            )
        ]);
        
        console.log('✅ Metadata result:', metadata);

        // Validate metadata structure
        if (!metadata || !metadata.title) {
            throw new Error('Invalid metadata structure - missing required fields');
        }

        // Get offer status with timeout and error handling
        console.log('📞 Calling publicClient.readContract for getOfferStatus...');
        let status;
        try {
            status = await Promise.race([
                publicClient.readContract({
                    address: address,
                    abi: SAFESEND_CONTRACT.abi,
                    functionName: 'getOfferStatus',
                }),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Status read timeout after 10 seconds')), 10000)
                )
            ]);
            console.log('✅ Status result:', status);
        } catch (statusError) {
            console.warn('⚠️ Could not fetch offer status, using defaults:', statusError.message);
            
            // Check if this is a known problematic contract
            if (statusError.message.includes('Position') && statusError.message.includes('out of bounds')) {
                console.warn('🔍 This appears to be a contract with incomplete state data');
            }
            
            // Provide default status if getOfferStatus fails
            status = {
                owner: metadata.owner || '0x0000000000000000000000000000000000000000',
                client: '0x0000000000000000000000000000000000000000',
                isAccepted: false,
                isFunded: false,
                isCompleted: false
            };
        }

        // Format amount from Wei (6 decimals for PYUSD)
        const formattedAmount = formatUnits(metadata.amount, 6);
        console.log('Formatted amount:', formattedAmount);
        
        const result = {
            title: metadata.title,
            description: metadata.description, 
            serviceType: metadata.serviceType,
            category: metadata.serviceType, // Map serviceType to category for frontend compatibility
            deliverables: metadata.deliverables,
            amount: formattedAmount,
            deadline: new Date(Number(metadata.deadline) * 1000).toLocaleDateString(),
            isActive: metadata.isActive,
            createdAt: formatDate(new Date(Number(metadata.createdAt) * 1000)),
            owner: status.owner,
            client: status.client,
            isAccepted: status.isAccepted,
            isFunded: status.isFunded,
            isCompleted: status.isCompleted
        };
        
        console.log('Final processed result:', result);
        
        return result;
    } catch (error) {
        console.error('❌ Error fetching metadata:', error);
        console.error('Error details:', error.message, error.stack);
        handleContractError(error, 'fetch metadata');
        return null;
    } finally {
        activeRequests--;
        console.log('Active requests:', activeRequests);
    }
};

// Get offer metadata using viem
export const getOfferMetadata = async (walletClient, contractAddress) => {
    try {
        const metadata = await publicClient.readContract({
            address: contractAddress,
            abi: SAFESEND_CONTRACT.abi,
            functionName: 'getOfferMetadata',
        });

        return {
            title: metadata.title,
            description: metadata.description,
            serviceType: metadata.serviceType,
            deliverables: metadata.deliverables,
            amount: formatUnits(metadata.amount, 6),
            deadline: formatDate(new Date(Number(metadata.deadline) * 1000)),
            isActive: metadata.isActive,
            createdAt: formatDate(new Date(Number(metadata.createdAt) * 1000))
        };
    } catch (error) {
        console.error('Error fetching offer metadata:', error);
        handleContractError(error, 'fetch offer metadata');
        return null;
    }
};

// Get offer status using viem
export const getOfferStatus = async (walletClient, contractAddress) => {
    try {
        const status = await publicClient.readContract({
            address: contractAddress,
            abi: SAFESEND_CONTRACT.abi,
            functionName: 'getOfferStatus',
        });

        return {
            owner: status.owner,
            client: status.client,
            isAccepted: status.isAccepted,
            isFunded: status.isFunded,
            isCompleted: status.isCompleted
        };
    } catch (error) {
        console.error('Error fetching offer status:', error);
        handleContractError(error, 'fetch offer status');
        return null;
    }
};

// Get contract balance using viem
export const getContractBalance = async (walletClient, contractAddress) => {
    try {
        const balance = await publicClient.readContract({
            address: contractAddress,
            abi: SAFESEND_CONTRACT.abi,
            functionName: 'getContractBalance',
        });

        return formatUnits(balance, 6);
    } catch (error) {
        console.error('Error fetching contract balance:', error);
        return '0';
    }
};

// Get all offer requests using viem
export const getOfferRequests = async (walletClient, contractAddress) => {
    try {
        const requests = await publicClient.readContract({
            address: contractAddress,
            abi: SAFESEND_CONTRACT.abi,
            functionName: 'getAllOfferRequests',
        });

        return requests.map(request => ({
            clientAddress: request.clientAddress,
            message: request.message,
            requestedAt: formatDate(new Date(Number(request.requestedAt) * 1000)),
            isRejected: request.isRejected
        }));
    } catch (error) {
        console.error('Error fetching offer requests:', error);
        return [];
    }
};

// Request and fund offer in one transaction using viem
export const requestAndFundOffer = async (walletClient, contractAddress, message) => {
    try {
        // Get the offer amount for approval
        const metadata = await publicClient.readContract({
            address: contractAddress,
            abi: SAFESEND_CONTRACT.abi,
            functionName: 'getOfferMetadata',
        });
        
        const amount = metadata.amount;

        // First approve PYUSD spending
        const approvalTx = await walletClient.writeContract({
            address: PYUSD_TOKEN_ADDRESS,
            abi: [
                {
                    "name": "approve",
                    "type": "function",
                    "stateMutability": "nonpayable",
                    "inputs": [
                        {"name": "spender", "type": "address"},
                        {"name": "amount", "type": "uint256"}
                    ],
                    "outputs": [{"name": "", "type": "bool"}]
                }
            ],
            functionName: 'approve',
            args: [contractAddress, amount],
        });

        console.log('Approval transaction:', approvalTx);

        // Then request and fund the offer
        const requestTx = await walletClient.writeContract({
            address: contractAddress,
            abi: SAFESEND_CONTRACT.abi,
            functionName: 'requestAndFundOffer',
            args: [message],
        });

        console.log('Request and fund transaction:', requestTx);
        return requestTx;
    } catch (error) {
        console.error('Error requesting and funding offer:', error);
        handleContractError(error, 'request and fund offer');
        throw error;
    }
};

// Complete offer (owner only) using viem
export const completeOffer = async (walletClient, contractAddress) => {
    try {
        const tx = await walletClient.writeContract({
            address: contractAddress,
            abi: SAFESEND_CONTRACT.abi,
            functionName: 'completeOffer',
        });
        
        console.log('Offer completed successfully:', tx);
        return tx;
    } catch (error) {
        console.error('Error completing offer:', error);
        handleContractError(error, 'complete offer');
        throw error;
    }
};

// Withdraw funds (owner only) using viem
export const withdrawFunds = async (walletClient, contractAddress) => {
    try {
        const tx = await walletClient.writeContract({
            address: contractAddress,
            abi: SAFESEND_CONTRACT.abi,
            functionName: 'withdrawFunds',
        });
        
        console.log('Funds withdrawn successfully:', tx);
        return tx;
    } catch (error) {
        console.error('Error withdrawing funds:', error);
        handleContractError(error, 'withdraw funds');
        throw error;
    }
};


// Reject offer request (owner only) using viem
export const rejectOfferRequest = async (walletClient, contractAddress, clientAddress) => {
    try {
        const tx = await walletClient.writeContract({
            address: contractAddress,
            abi: SAFESEND_CONTRACT.abi,
            functionName: 'rejectOfferRequest',
            args: [clientAddress],
        });
        
        console.log('Request rejected successfully:', tx);
        return tx;
    } catch (error) {
        console.error('Error rejecting request:', error);
        handleContractError(error, 'reject request');
        throw error;
    }
};

// Deactivate offer (owner only) using viem
export const deactivateOffer = async (walletClient, contractAddress) => {
    try {
        const tx = await walletClient.writeContract({
            address: contractAddress,
            abi: SAFESEND_CONTRACT.abi,
            functionName: 'deactivateOffer',
        });
        
        console.log('Offer deactivated successfully:', tx);
        return tx;
    } catch (error) {
        console.error('Error deactivating offer:', error);
        handleContractError(error, 'deactivate offer');
        throw error;
    }
};

