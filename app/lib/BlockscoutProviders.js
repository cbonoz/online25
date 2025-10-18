'use client';

import React from 'react';
import { NotificationProvider, TransactionPopupProvider } from '@blockscout/app-sdk';

/**
 * Blockscout SDK providers wrapper
 * Provides transaction notifications and transaction history popup functionality
 */
export default function BlockscoutProviders({ children }) {
    return (
        <NotificationProvider>
            <TransactionPopupProvider>
                {children}
            </TransactionPopupProvider>
        </NotificationProvider>
    );
}