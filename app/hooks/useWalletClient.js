'use client';

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { createWalletClient, custom } from "viem";
import { ACTIVE_CHAIN } from "../constants";
import { useMemo, useEffect, useState } from "react";

export function useWalletClient() {
    const { primaryWallet, user } = useDynamicContext();
    const [asyncProvider, setAsyncProvider] = useState(null);
    
    // Extract only stable primitive values for useMemo dependencies
    const walletAddress = primaryWallet?.address || user?.walletAddress || '';
    const connectorKey = primaryWallet?.connector?.key || '';
    const hasWallet = !!primaryWallet;
    const hasConnector = !!primaryWallet?.connector;

    // Handle async provider retrieval
    useEffect(() => {
        if (primaryWallet?.connector?.getWalletProvider) {
            primaryWallet.connector.getWalletProvider()
                .then(provider => {
                    console.log('Got async provider for:', connectorKey);
                    setAsyncProvider(provider);
                })
                .catch(error => {
                    console.warn('Failed to get async provider:', error);
                    setAsyncProvider(null);
                });
        } else {
            setAsyncProvider(null);
        }
    }, [primaryWallet?.connector, connectorKey]);

    const walletClient = useMemo(() => {
        console.log('Creating wallet client:', {
            hasWallet,
            hasConnector,
            walletAddress,
            connectorKey,
            hasAsyncProvider: !!asyncProvider
        });

        if (!hasWallet) {
            console.log('No wallet available');
            return null;
        }
        
        if (!hasConnector) {
            console.log('No connector available');
            return null;
        }
        
        // Get provider - different wallets expose this differently
        let provider;
        try {
            // Try multiple methods to get the provider from Dynamic.xyz
            provider = primaryWallet.connector.provider || 
                      primaryWallet.connector.getProvider?.() ||
                      primaryWallet.connector.ethereum ||
                      primaryWallet.connector._provider ||
                      asyncProvider;
            
            // For Coinbase wallet, sometimes we need to get it from window.ethereum
            if (!provider && connectorKey === 'coinbasewallet') {
                console.log('Trying Coinbase wallet fallback detection...');
                if (typeof window !== 'undefined' && window.ethereum) {
                    console.log('Window ethereum available:', {
                        isCoinbaseWallet: !!window.ethereum.isCoinbaseWallet,
                        hasSelectedProvider: !!window.ethereum.selectedProvider,
                        selectedProviderIsCoinbase: !!window.ethereum.selectedProvider?.isCoinbaseWallet
                    });
                    // Check if this is Coinbase wallet
                    if (window.ethereum.isCoinbaseWallet || window.ethereum.selectedProvider?.isCoinbaseWallet) {
                        provider = window.ethereum.isCoinbaseWallet ? window.ethereum : window.ethereum.selectedProvider;
                        console.log('Found Coinbase provider via window.ethereum');
                    }
                } else {
                    console.log('Window.ethereum not available for Coinbase fallback');
                }
            }
            
            // Additional Coinbase wallet detection methods
            if (!provider && connectorKey === 'coinbasewallet') {
                console.log('Trying additional Coinbase detection methods...');
                // Try getting provider from connector methods
                const connector = primaryWallet.connector;
                if (connector) {
                    const potentialProviders = [
                        connector.provider,
                        connector.getProvider?.(),
                        connector.ethereum,
                        connector._provider,
                        connector.wallet?.provider,
                        connector.sdk?.provider
                    ];
                    
                    for (let i = 0; i < potentialProviders.length; i++) {
                        const potentialProvider = potentialProviders[i];
                        if (potentialProvider) {
                            console.log(`Found potential provider at index ${i}:`, typeof potentialProvider);
                            provider = potentialProvider;
                            break;
                        }
                    }
                }
            }
            
            if (!provider) {
                console.log('No provider available for wallet:', connectorKey, {
                    connector: !!primaryWallet.connector,
                    hasProvider: !!primaryWallet.connector.provider,
                    hasGetProvider: !!primaryWallet.connector.getProvider,
                    hasEthereum: !!primaryWallet.connector.ethereum,
                    hasPrivateProvider: !!primaryWallet.connector._provider,
                    hasAsyncProvider: !!asyncProvider
                });
                return null;
            }
            
            console.log('Found provider for wallet:', connectorKey, typeof provider);
        } catch (error) {
            console.error('Error getting provider:', error);
            return null;
        }

        try {
            const client = createWalletClient({
                account: walletAddress,
                chain: ACTIVE_CHAIN,
                transport: custom(provider),
            });
            
            console.log('Wallet client created successfully for:', connectorKey);
            return client;
        } catch (error) {
            console.error('Error creating wallet client:', error);
            return null;
        }
    }, [walletAddress, connectorKey, hasWallet, hasConnector, asyncProvider]);

    return walletClient;
}
