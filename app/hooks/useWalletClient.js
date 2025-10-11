'use client';

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { createWalletClient, custom } from "viem";
import { ACTIVE_CHAIN } from "../constants";
import { useMemo } from "react";

export function useWalletClient() {
    const { primaryWallet } = useDynamicContext();
    
    // Extract only stable primitive values for useMemo dependencies
    const walletAddress = primaryWallet?.address || '';
    const connectorKey = primaryWallet?.connector?.key || '';
    const hasWallet = !!primaryWallet;
    const hasConnector = !!primaryWallet?.connector;

    const walletClient = useMemo(() => {
        if (!hasWallet) return null;
        if (!hasConnector) return null;
        const provider = primaryWallet.connector.provider || primaryWallet.connector.getProvider?.();
        if (!provider) return null;
        try {
            return createWalletClient({
                account: walletAddress,
                chain: ACTIVE_CHAIN,
                transport: custom(provider),
            });
        } catch (error) {
            return null;
        }
    }, [walletAddress, connectorKey, hasWallet, hasConnector]);

    return walletClient;
}
