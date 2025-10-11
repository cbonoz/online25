'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { getMetadata, getOfferRequests } from '../../util/appContractViem';

// Simple cache to prevent re-fetching
const dataCache = new Map();

export default function useOfferData(offerId) {
    const { primaryWallet } = useDynamicContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [offerData, setOfferData] = useState(null);

    // Add a state to force refetch
    const [fetchIndex, setFetchIndex] = useState(0);

    useEffect(() => {
        let cancelled = false;
        if (!offerId) {
            setLoading(false);
            return;
        }

        // Check cache first
        if (dataCache.has(offerId)) {
            const cachedData = dataCache.get(offerId);
            setOfferData(cachedData);
            setLoading(false);
            return;
        }


        const fetchData = async () => {
            try {
                console.log('Fetching offer data for contract:', offerId);
                const [metadata, requests] = await Promise.all([
                    getMetadata(null, offerId),
                    getOfferRequests(null, offerId)
                ]);
                if (!metadata) {
                    throw new Error('No metadata returned from contract');
                }
                const data = {
                    contractAddress: offerId,
                    title: metadata.title,
                    description: metadata.description,
                    category: metadata.category || metadata.serviceType,
                    serviceType: metadata.serviceType,
                    deliverables: metadata.deliverables,
                    amount: metadata.amount,
                    deadline: metadata.deadline,
                    isActive: metadata.isActive,
                    createdAt: metadata.createdAt,
                    owner: metadata.owner,
                    client: metadata.client,
                    isAccepted: metadata.isAccepted,
                    isFunded: metadata.isFunded,
                    isCompleted: metadata.isCompleted,
                    claimCount: Array.isArray(requests) ? requests.length : 0
                };
                if (!cancelled) {
                    dataCache.set(offerId, data);
                    setOfferData(data);
                    setLoading(false);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error('Error fetching offer data:', error);
                    setError(error.message || 'Failed to load offer data');
                    setLoading(false);
                }
            }
        };

        fetchData();
        return () => { cancelled = true; };
    }, [offerId, fetchIndex]);

    // Memoize userAddress to avoid unnecessary rerenders
    const userAddress = useMemo(() => primaryWallet?.address || null, [primaryWallet?.address]);
    
    // Memoize isOwner to avoid unnecessary rerenders
    const isOwner = useMemo(() => {
        return userAddress && offerData && userAddress.toLowerCase() === offerData.owner?.toLowerCase();
    }, [userAddress, offerData?.owner]);

    // Debug logging (only log when values change)
    useEffect(() => {
        if (userAddress && offerData) {
            console.log('🔍 Ownership check:', {
                userAddress: userAddress.toLowerCase(),
                offerOwner: offerData.owner?.toLowerCase(),
                isOwner: isOwner,
                contractAddress: offerData.contractAddress
            });
        }
    }, [userAddress, offerData, isOwner]);

    // Memoize refetch so it doesn't change on every render
    const refetch = useCallback(() => {
        dataCache.delete(offerId);
        setLoading(true);
        setError(null);
        setFetchIndex(idx => idx + 1);
    }, [offerId]);

    return {
        loading,
        error,
        offerData,
        userAddress,
        isOwner,
        refetch
    };
}