
'use client';

import React, { useState, useEffect, useMemo } from 'react';

export default function useOwnerOffers(shouldFetch = false, userAddress = null) {
    const [loading, setLoading] = useState(false);
    const [offers, setOffers] = useState([]);
    const stableUserAddress = useMemo(() => userAddress ? userAddress.toLowerCase() : null, [userAddress]);

    useEffect(() => {
        // Only run if explicitly enabled and we have a stable user address
        if (!shouldFetch || !stableUserAddress) {
            setOffers([]);
            setLoading(false);
            return;
        }

        let cancelled = false;
        const fetchOffers = () => {
            try {
                setLoading(true);
                // Get offers from localStorage
                const storedOffers = JSON.parse(localStorage.getItem('userOffers') || '[]');
                const userOffers = storedOffers.filter(offer =>
                    offer.owner && offer.owner.toLowerCase() === stableUserAddress
                );
                // Only update state if offers actually changed
                setOffers(prev => {
                    if (JSON.stringify(prev) !== JSON.stringify(userOffers)) {
                        return userOffers;
                    }
                    return prev;
                });
                setLoading(false);
            } catch (error) {
                if (!cancelled) {
                    setOffers([]);
                    setLoading(false);
                }
            }
        };

        fetchOffers();
        return () => { cancelled = true; };
    }, [shouldFetch, stableUserAddress]);

    return {
        loading,
        offers,
        refreshOffers: () => {
            if (shouldFetch && userAddress) {
                setLoading(true);
                const storedOffers = JSON.parse(localStorage.getItem('userOffers') || '[]');
                const userOffers = storedOffers.filter(offer => 
                    offer.owner && offer.owner.toLowerCase() === userAddress.toLowerCase()
                );
                setOffers(userOffers);
                setLoading(false);
            }
        }
    };
}
