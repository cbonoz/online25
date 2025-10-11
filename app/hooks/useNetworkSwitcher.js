'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { ACTIVE_CHAIN } from '../constants';

export const useNetworkSwitcher = () => {
  const { primaryWallet } = useDynamicContext();
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true); // Start with true to prevent initial flash
  const [isChecking, setIsChecking] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const checkTimeoutRef = useRef(null);

  const checkNetwork = useCallback(async () => {
    if (!primaryWallet) {
      console.log('No primary wallet connected');
      setIsCorrectNetwork(true); // Set to true when no wallet to hide network switcher
      setHasChecked(true);
      return true; // Return true so network switcher doesn't show
    }
    
    try {
      const network = await primaryWallet.connector.getNetwork();
      console.log('Current network from wallet:', network);
      console.log('Required network:', ACTIVE_CHAIN);
      
      // Handle different network response formats
      let currentChainId;
      if (typeof network === 'number') {
        // If network is just a number (chain ID)
        currentChainId = network;
      } else if (network.chain?.id) {
        // If network has a chain object with id
        currentChainId = network.chain.id;
      } else if (network.chainId) {
        // If network has chainId property
        currentChainId = network.chainId;
      } else if (network.id) {
        // If network has id property
        currentChainId = network.id;
      } else {
        console.error('Unable to determine chain ID from network object:', network);
        setIsCorrectNetwork(false);
        setHasChecked(true);
        return false;
      }
      
      console.log('Current chain ID:', currentChainId, 'Required chain ID:', ACTIVE_CHAIN.id);
      
      const isCorrect = currentChainId === ACTIVE_CHAIN.id;
      console.log('Network is correct:', isCorrect);
      
      // Only update state if the value actually changed to prevent unnecessary re-renders
      setIsCorrectNetwork(prev => prev !== isCorrect ? isCorrect : prev);
      setHasChecked(true);
      return isCorrect;
    } catch (error) {
      console.error('Error checking network:', error);
      setIsCorrectNetwork(false);
      setHasChecked(true);
      setIsCorrectNetwork(false);
      setHasChecked(true);
      return false;
    }
  }, [primaryWallet]); // Add primaryWallet as dependency

  const switchToRequiredNetwork = useCallback(async () => {
    if (!primaryWallet) {
      throw new Error('No wallet connected');
    }

    setIsChecking(true);
    try {
      const targetChainId = ACTIVE_CHAIN.id;
      console.log('Attempting to switch to network:', targetChainId);
      
      if (primaryWallet.connector.supportsNetworkSwitching()) {
        // Try different approaches for network switching
        try {
          await primaryWallet.switchNetwork(targetChainId);
          console.log(`Success! Network switched to ${ACTIVE_CHAIN.name} (${targetChainId})`);
        } catch (switchError) {
          console.log('First switch attempt failed, trying alternative method:', switchError);
          
          // Alternative: try using the connector directly
          if (primaryWallet.connector.switchNetwork) {
            try {
              await primaryWallet.connector.switchNetwork(targetChainId);
              console.log(`Success! Network switched via connector to ${ACTIVE_CHAIN.name} (${targetChainId})`);
            } catch (connectorError) {
              console.log('Connector switch also failed:', connectorError);
              throw new Error(`Unable to switch networks automatically. Please manually switch your wallet to ${ACTIVE_CHAIN.name} (Chain ID: ${targetChainId})`);
            }
          } else {
            throw new Error(`Your wallet doesn't support automatic network switching. Please manually switch to ${ACTIVE_CHAIN.name} (Chain ID: ${targetChainId})`);
          }
        }
        
        // Wait a moment for the network to settle
        await new Promise(resolve => setTimeout(resolve, 1000));
        await checkNetwork();
        return true;
      } else {
        throw new Error(`Your wallet doesn't support network switching. Please manually switch to ${ACTIVE_CHAIN.name} (Chain ID: ${targetChainId})`);
      }
    } catch (error) {
      console.error('Error switching network:', error);
      throw error;
    } finally {
      setIsChecking(false);
    }
  }, [primaryWallet, checkNetwork]);

  const ensureCorrectNetwork = useCallback(async () => {
    const isCorrect = await checkNetwork();
    if (!isCorrect) {
      console.log('Network is incorrect, attempting to switch...');
      try {
        await switchToRequiredNetwork();
        // Check again after switching
        const isNowCorrect = await checkNetwork();
        if (!isNowCorrect) {
          throw new Error(`Please manually switch your wallet to ${ACTIVE_CHAIN.name} (Chain ID: ${ACTIVE_CHAIN.id}) to continue.`);
        }
      } catch (switchError) {
        console.log('Auto-switch failed:', switchError);
        throw new Error(`Please switch your wallet to ${ACTIVE_CHAIN.name} (Chain ID: ${ACTIVE_CHAIN.id}) to continue. Auto-switch failed: ${switchError.message}`);
      }
    }
    return isCorrectNetwork;
  }, [checkNetwork, switchToRequiredNetwork, isCorrectNetwork]);

  // Only check network when wallet changes and we haven't checked yet
  useEffect(() => {
    if (primaryWallet && !hasChecked) {
      // Add a small delay to prevent rapid state changes
      const timeoutId = setTimeout(() => {
        checkNetwork();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [primaryWallet, hasChecked, checkNetwork]);

  // Reset hasChecked when wallet changes
  useEffect(() => {
    if (!primaryWallet) {
      setHasChecked(false);
      setIsCorrectNetwork(true); // Default to true when no wallet to hide switcher
    }
  }, [primaryWallet]);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, []);

  return {
    isCorrectNetwork,
    isChecking,
    switchToRequiredNetwork,
    ensureCorrectNetwork,
    checkNetwork,
    requiredNetwork: ACTIVE_CHAIN
  };
};
