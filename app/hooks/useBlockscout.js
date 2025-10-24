'use client';

import { useNotification, useTransactionPopup } from '@blockscout/app-sdk';
import { ACTIVE_CHAIN, siteConfig, getExplorerLink } from '../constants';
import { message } from 'antd';

/**
 * Custom hook that wraps Blockscout SDK functionality with app-specific chain configuration
 */
export function useBlockscout() {
    const { openTxToast } = useNotification();
    const { openPopup } = useTransactionPopup();

    // Get the current chain ID as a string (Blockscout expects string)
    const chainId = ACTIVE_CHAIN.id.toString();

    /**
     * Show transaction notification toast with proper chain ID
     * @param {string} txHash - Transaction hash
     * @param {string} customChainId - Optional custom chain ID (defaults to current chain)
     */
    const showTransactionToast = async (txHash, customChainId = chainId) => {
        try {
            // Don't await - let it run in background to avoid blocking
            // Blockscout indexing can take time on testnets
            openTxToast(customChainId, txHash).catch(err => {
                console.warn('Transaction toast failed (non-critical):', err);
            });
        } catch (error) {
            console.error('Failed to show transaction toast:', error);
        }
    };

    /**
     * Show transaction history popup for a specific address
     * This will show all transactions TO and FROM the specified address
     * @param {string} address - Address to show transactions for
     * @param {string} customChainId - Optional custom chain ID (defaults to current chain)
     * @param {string} label - Optional label to display in info message (e.g., "My Wallet")
     */
    const showAddressTransactions = (address, customChainId = chainId, label = null) => {
        try {
            if (label) {
                const explorerLink = getExplorerLink(address, 'address', customChainId);
                message.info({
                    content: (
                        <div>
                            <div style={{ fontWeight: 600, marginBottom: 4 }}>
                                {label} Transactions
                            </div>
                            <div style={{ fontSize: '12px', opacity: 0.8 }}>
                                Viewing transaction history
                            </div>
                            <a 
                                href={explorerLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ fontSize: '11px', marginTop: 4, display: 'block' }}
                            >
                                View on block explorer →
                            </a>
                        </div>
                    ),
                    duration: 4,
                    style: { marginTop: '60px' }
                });
            }
            
            openPopup({
                chainId: customChainId,
                address: address
            });
        } catch (error) {
            console.error('Failed to open transaction popup:', error);
        }
    };

    /**
     * Show transaction history popup for the entire chain
     * This will show ALL recent transactions on the chain (not filtered)
     * @param {string} customChainId - Optional custom chain ID (defaults to current chain)
     */
    const showChainTransactions = (customChainId = chainId) => {
        try {
            openPopup({
                chainId: customChainId
            });
        } catch (error) {
            console.error('Failed to open chain transaction popup:', error);
        }
    };

    /**
     * Show transactions for the SafeSend escrow contract
     * This displays all transactions involving the contract (deposits, releases, refunds, etc.)
     * Shows a friendly message with the app name and provides a link to the contract
     * @param {string} contractAddress - SafeSend contract address
     * @param {boolean} showMessage - Whether to show an info message (default: true)
     */
    const showContractTransactions = (contractAddress, showMessage = true) => {
        if (showMessage) {
            // Show a friendly message with app name and contract link
            const explorerLink = getExplorerLink(contractAddress, 'address');
            message.info({
                content: (
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>
                            {siteConfig.name} Contract Transactions
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>
                            Viewing all transactions for the escrow contract
                        </div>
                        <a 
                            href={explorerLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ fontSize: '11px', marginTop: 4, display: 'block' }}
                        >
                            View full contract on explorer →
                        </a>
                    </div>
                ),
                duration: 4,
                style: { marginTop: '60px' }
            });
        }
        
        showAddressTransactions(contractAddress);
    };

    /**
     * Show transactions for PYUSD token contract
     * This displays all PYUSD token transfers on the chain
     * @param {string} tokenAddress - PYUSD token address
     * @param {boolean} showMessage - Whether to show an info message (default: true)
     */
    const showTokenTransactions = (tokenAddress, showMessage = true) => {
        if (showMessage) {
            const explorerLink = getExplorerLink(tokenAddress, 'token');
            message.info({
                content: (
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>
                            PYUSD Token Transactions
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>
                            Viewing all PYUSD transfers on the network
                        </div>
                        <a 
                            href={explorerLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ fontSize: '11px', marginTop: 4, display: 'block' }}
                        >
                            View PYUSD token on explorer →
                        </a>
                    </div>
                ),
                duration: 4,
                style: { marginTop: '60px' }
            });
        }
        
        showAddressTransactions(tokenAddress);
    };

    /**
     * Show transactions for user's wallet with friendly labeling
     * @param {string} walletAddress - User's wallet address
     */
    const showMyTransactions = (walletAddress) => {
        showAddressTransactions(walletAddress, chainId, 'My Wallet');
    };

    return {
        chainId,
        showTransactionToast,
        showAddressTransactions,
        showChainTransactions,
        showContractTransactions,
        showTokenTransactions,
        showMyTransactions,
        // Raw functions for advanced usage
        openTxToast,
        openPopup
    };
}