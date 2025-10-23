'use client';

import React from 'react';
import { Button, Space, Typography } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { 
    HomeOutlined, 
    PlusOutlined, 
    InfoCircleOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import Logo from './Logo';
import { useBlockscout } from '../hooks/useBlockscout';
import { useWalletAddress } from '../hooks/useWalletAddress';

const { Text } = Typography;

export default function Navigation() {
    const router = useRouter();
    const pathname = usePathname();
    const { showChainTransactions, showContractTransactions } = useBlockscout();
    const { address: walletAddress } = useWalletAddress();

    // Hide escrow creation tabs on /escrow pages
    const isEscrowPage = pathname.startsWith('/escrow');
    const navItems = [
        !isEscrowPage && {
            key: 'escrow',
            label: 'Create Escrow',
            icon: <PlusOutlined />, 
            path: '/escrow'
        },
        !isEscrowPage && {
            key: 'my-escrows',
            label: 'My Escrows',
            icon: <HomeOutlined style={{ color: '#4f4d4c' }} />, 
            path: '/my-escrows'
        },
        {
            key: 'about',
            label: 'About',
            icon: <InfoCircleOutlined />, 
            path: '/about'
        }
    ].filter(Boolean);

    // Navigation is now always visible

    return (
        <div
            style={{
                background: '#fff',
                padding: 0,
                // borderBottom removed to avoid double border
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                minWidth: 0,
                minHeight: 56,
                height: 56,
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'nowrap',
                    gap: 12,
                    width: '100%',
                    height: 56,
                }}
            >
                <div
                    style={{ cursor: 'pointer', flex: '0 0 auto', height: 40, display: 'flex', alignItems: 'center' }}
                    onClick={() => router.push('/')}
                >
                    <Logo size="small" style={{ height: 32 }} />
                </div>
                <div
                    style={{
                        display: 'flex',
                        flex: '1 1 auto',
                        gap: 24,
                        overflowX: 'auto',
                        whiteSpace: 'nowrap',
                        minWidth: 0,
                        alignItems: 'center',
                    }}
                >
                    {navItems.map(item => (
                        <div
                            key={item.key}
                            onClick={() => router.push(item.path)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                color: pathname === item.path ? '#00aef2' : '#4b5563',
                                fontWeight: pathname === item.path ? 600 : 500,
                                fontSize: '16px',
                                opacity: pathname === item.path ? 1 : 0.85,
                                borderBottom: pathname === item.path ? '2px solid #00aef2' : '2px solid transparent',
                                padding: '8px 0',
                                transition: 'color 0.2s, border-bottom 0.2s',
                            }}
                        >
                            {item.icon}
                            <span style={{ marginLeft: 8 }}>{item.label}</span>
                        </div>
                    ))}
                    
                    {/* Blockscout Transactions Button - Shows contract txs if available, otherwise chain txs */}
                    <div
                        onClick={() => {
                            // Prefer showing contract transactions if contract is deployed
                            const contractAddress = typeof window !== 'undefined' && 
                                                  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
                            if (contractAddress) {
                                showContractTransactions(contractAddress);
                            } else {
                                showChainTransactions();
                            }
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            color: '#4b5563',
                            fontWeight: 500,
                            fontSize: '16px',
                            opacity: 0.85,
                            borderBottom: '2px solid transparent',
                            padding: '8px 0',
                            transition: 'color 0.2s, opacity 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.target.closest('div').style.opacity = '1';
                            e.target.closest('div').style.color = '#00aef2';
                        }}
                        onMouseLeave={(e) => {
                            e.target.closest('div').style.opacity = '0.85';
                            e.target.closest('div').style.color = '#4b5563';
                        }}
                        title={process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ? 'View SafeSend Contract Transactions' : 'View Chain Transactions'}
                    >
                        <HistoryOutlined />
                        <span style={{ marginLeft: 8 }}>Transactions</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
