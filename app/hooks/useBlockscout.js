'use client';

import { useNotification, useTransactionPopup } from '@blockscout/app-sdk';
import { ACTIVE_CHAIN } from '../constants';

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
            await openTxToast(customChainId, txHash);
        } catch (error) {
            console.error('Failed to show transaction toast:', error);
        }
    };

    /**
     * Show transaction history popup for a specific address
     * @param {string} address - Address to show transactions for
     * @param {string} customChainId - Optional custom chain ID (defaults to current chain)
     */
    const showAddressTransactions = (address, customChainId = chainId) => {
        try {
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
     * Show transactions for the escrow contract
     * @param {string} contractAddress - Contract address
     */
    const showContractTransactions = (contractAddress) => {
        showAddressTransactions(contractAddress);
    };

    /**
     * Show transactions for PYUSD token contract
     * @param {string} tokenAddress - PYUSD token address
     */
    const showTokenTransactions = (tokenAddress) => {
        showAddressTransactions(tokenAddress);
    };

    return {
        chainId,
        showTransactionToast,
        showAddressTransactions,
        showChainTransactions,
        showContractTransactions,
        showTokenTransactions,
        // Raw functions for advanced usage
        openTxToast,
        openPopup
    };
}