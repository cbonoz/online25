// Define sepolia chain object directly to avoid wagmi import issues in client components
import { sepolia, mainnet } from 'viem/chains';

export const siteConfig = {
    title: 'SafeSend | PYUSD Consumer Protection On-Chain',
    name: 'SafeSend',
    description: 'Bringing PayPal-like consumer protection to on-chain stablecoin payments using fraud attestations and transparent oracles',
    cta: {
        primary: 'Create Escrow',
        secondary: 'Learn More'
    },
    logo: {
        url : '/logo.png',
        width: 180,
        height: 37,
        alt: 'SafeSend Logo'
    },
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || undefined,
    useCases: [
        'Freelancers and service providers collecting offers or deposits',
        'Anyone looking to simplify client onboarding and payment',
        'Agencies or consultants issuing milestone-based contracts',
        'Teams wanting full audibility of actions with on-chain payout logic'
    ]
};

// Demo data for testing
export const DEMO_DATA = {
    sellerAddress: '0x81e9aA254Ff408458A7267Df3469198f5045A561',
    amount: 0.1, // PYUSD
    description: 'Website design project'
};

// Legacy exports for backward compatibility
export const APP_NAME = siteConfig.name;
export const APP_DESC = siteConfig.description;


// Chain configuration with explorer URLs
export const CHAIN_OPTIONS = [sepolia, mainnet];
export const CHAIN_MAP = {
    [sepolia.id]: sepolia,
    [mainnet.id]: mainnet
};

export const NETWORK = process.env.NEXT_PUBLIC_NETWORK
export const ACTIVE_CHAIN =  NETWORK === 'mainnet' ? mainnet : sepolia;

// Helper function to get explorer URL for current chain
export const getExplorerUrl = (chainId = ACTIVE_CHAIN.id) => {
    const chain = CHAIN_MAP[chainId] || sepolia;
    return chain.blockExplorers?.default?.url || sepolia.blockExplorers.default.url;
};

// Helper function to generate explorer links
export const getExplorerLink = (address, type = 'address', chainId = ACTIVE_CHAIN.id) => {
    const baseUrl = getExplorerUrl(chainId);
    return `${baseUrl}/${type}/${address}`;
};

// Blockscout SDK configuration
export const BLOCKSCOUT_CONFIG = {
    // Current chain ID as string (Blockscout expects string format)
    chainId: ACTIVE_CHAIN.id.toString(),
    // Supported chain IDs for Blockscout
    supportedChains: ['1', '137', '42161', '10', '11155111'], // mainnet, polygon, arbitrum, optimism, sepolia
    // Check if current chain is supported
    isSupported: () => {
        const currentChainId = ACTIVE_CHAIN.id.toString();
        return BLOCKSCOUT_CONFIG.supportedChains.includes(currentChainId);
    }
};

// PYUSD token address (replace with actual addresses)
export const PYUSD_TOKEN_ADDRESS = NETWORK === 'mainnet'
    ? '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8' // mainnet address
    : '0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9'; // testnet address (sepolia default)

export const IPFS_BASE_URL = 'https://ipfs.io/ipfs';

// Dynamic and other integrations (add more as needed)
export const DYNAMIC_AUTH_URL = 'https://dynamic.xyz'; // Example placeholder

// Escrow creation steps configuration
export const ESCROW_CREATION_STEPS = [
    {
        title: 'Escrow Details',
        description: 'Set up the escrow parameters'
    },
    {
        title: 'Deposit Funds',
        description: 'Deposit PYUSD into escrow'
    },
    {
        title: 'Confirmation',
        description: 'Review and confirm transaction'
    }
];
