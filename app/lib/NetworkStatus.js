'use client';

import { Alert, Button, Spin } from 'antd';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useNetworkSwitcher } from '../hooks/useNetworkSwitcher';
import { useState, useEffect } from 'react';

const NetworkStatus = ({ showSwitcher = true, style = {} }) => {
  const { primaryWallet } = useDynamicContext();
  const { 
    isCorrectNetwork, 
    isChecking, 
    switchToRequiredNetwork, 
    requiredNetwork 
  } = useNetworkSwitcher();
  
  // Add local state to prevent flashing
  const [isVisible, setIsVisible] = useState(false);

  // Only show component after initial check is complete
  useEffect(() => {
    if (primaryWallet) {
      // Small delay to let network check complete
      const timer = setTimeout(() => setIsVisible(true), 200);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [primaryWallet]);

  // Don't show anything if no wallet is connected or not yet visible
  if (!primaryWallet || !isVisible) {
    return null;
  }

  const handleSwitchNetwork = async () => {
    try {
      await switchToRequiredNetwork();
    } catch (error) {
      console.error('Network switch failed:', error);
      // Show user-friendly error message
      alert(`Unable to switch networks automatically. Please manually switch your wallet to ${requiredNetwork.name} (Chain ID: ${requiredNetwork.id})`);
    }
  };

  if (isCorrectNetwork) {
    return (
      <div style={style}>
        <Alert 
          message={`Connected to ${requiredNetwork.name}`}
          type="success" 
          showIcon 
          size="small"
        />
      </div>
    );
  }

  return (
    <div style={style}>
      <Alert 
        message={`Please switch to ${requiredNetwork.name} (Chain ID: ${requiredNetwork.id})`}
        description={showSwitcher ? "Click the button below to switch networks, or manually switch in your wallet." : "Please manually switch your wallet network."}
        type="warning" 
        showIcon
        action={showSwitcher && (
          <Button 
            size="small" 
            type="primary" 
            onClick={handleSwitchNetwork}
            loading={isChecking}
          >
            {isChecking ? 'Switching...' : 'Switch Network'}
          </Button>
        )}
      />
    </div>
  );
};

export default NetworkStatus;
