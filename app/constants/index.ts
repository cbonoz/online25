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
    }
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
export const ACTIVE_CHAIN = sepolia;

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

// PYUSD token address (replace with actual addresses)
export const PYUSD_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_NETWORK === 'mainnet'
    ? '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8' // mainnet address
    : '0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9'; // testnet address (default)

export const IPFS_BASE_URL = 'https://ipfs.example.com';

export const MAX_FILE_SIZE_BYTES = 5000000; // 5MB
// Dynamic, Nora, ENS, and other integrations (add more as needed)
export const DYNAMIC_AUTH_URL = 'https://dynamic.xyz'; // Example placeholder
export const NORA_AI_URL = 'https://nora.example.com'; // Example placeholder
export const ENS_RESOLVER_URL = 'https://app.ens.domains'; // Example placeholder
