'use client';

import { useState, useEffect, useRef } from 'react';
import { useWalletClient } from './useWalletClient';

export function useWalletAddress() {
    const walletClient = useWalletClient();
    const [address, setAddress] = useState(null);
    const [prevAddress, setPrevAddress] = useState(null);
    const [hasChanged, setHasChanged] = useState(false);
    const lastAddressRef = useRef(null);

    useEffect(() => {
        const getAddress = () => {
            let newAddress = null;
            
            if (walletClient) {
                try {
                    newAddress = walletClient.account?.address || walletClient.address;
                } catch (error) {
                    console.error('Error getting wallet address:', error);
                    newAddress = null;
                }
            }
            
            // Only update if the address actually changed
            if (newAddress !== lastAddressRef.current) {
                console.log('Address change detected:', lastAddressRef.current, '->', newAddress);
                setPrevAddress(lastAddressRef.current);
                setAddress(newAddress);
                setHasChanged(lastAddressRef.current !== null); // Only mark as changed if we had a previous address
                lastAddressRef.current = newAddress;
            }
        };

        getAddress();
    }, [walletClient]);

    // Reset the change flag after it's been consumed
    const resetHasChanged = () => {
        console.log('Resetting hasChanged flag');
        setHasChanged(false);
    };

    return {
        address,
        prevAddress,
        hasChanged,
        resetHasChanged,
        isConnected: !!address
    };
}
