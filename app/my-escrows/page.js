'use client';

import React, { useState, useEffect } from 'react';
import { Card, Typography, Space, Button, Table, Tag, Alert, Tabs } from 'antd';
import { 
    EyeOutlined, 
    DollarOutlined, 
    SafetyCertificateTwoTone, 
    ClockCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { APP_NAME } from '../constants';
import { 
    isContractAvailable, 
    getBuyerEscrows, 
    getSellerEscrows,
    EscrowStatus,
    getStatusText as getContractStatusText,
    isFraudOracle,
    isFraudOracleConfigured
} from '../util/safeSendContract';
import { useWalletAddress } from '../hooks/useWalletAddress';
import DemoModeAlert from '../lib/DemoModeAlert';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

export default function MyEscrowsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [escrows, setEscrows] = useState([]);
    const [buyerEscrows, setBuyerEscrows] = useState([]);
    const [sellerEscrows, setSellerEscrows] = useState([]);
    const [isUserFraudOracle, setIsUserFraudOracle] = useState(false);
    const [isFraudOracleActive, setIsFraudOracleActive] = useState(false);
    const { address: walletAddress } = useWalletAddress();

    // Load escrows from contract if available
    useEffect(() => {
        const loadEscrows = async () => {
            if (!isContractAvailable() || !walletAddress) {
                // Use mock data when contract is not available
                const mockEscrows = [
                    {
                        id: 1,
                        amount: '500.00',
                        seller: '0x742d35Cc6635C0532925a3b8D9C1aCb4d3D9b123',
                        buyer: walletAddress || '0x1234567890abcdef1234567890abcdef12345678',
                        status: EscrowStatus.Active,
                        statusText: 'Active',
                        description: 'Website development project',
                        createdAt: '2025-01-10',
                        fraudFlagged: false
                    },
                    {
                        id: 2,
                        amount: '250.00',
                        buyer: '0x1234567890abcdef1234567890abcdef12345678',
                        seller: walletAddress || '0x742d35Cc6635C0532925a3b8D9C1aCb4d3D9b123',
                        status: EscrowStatus.Active,
                        statusText: 'Active',
                        description: 'Logo design services',
                        createdAt: '2025-01-08',
                        fraudFlagged: false
                    },
                    {
                        id: 3,
                        amount: '1000.00',
                        seller: '0xabcdef1234567890abcdef1234567890abcdef12',
                        buyer: walletAddress || '0x1234567890abcdef1234567890abcdef12345678',
                        status: EscrowStatus.Released,
                        statusText: 'Released',
                        description: 'Mobile app development',
                        createdAt: '2025-01-05',
                        fraudFlagged: false
                    }
                ];
                setEscrows(mockEscrows);
                setBuyerEscrows(mockEscrows.filter(e => e.buyer.toLowerCase() === (walletAddress || '0x1234567890abcdef1234567890abcdef12345678').toLowerCase()));
                setSellerEscrows(mockEscrows.filter(e => e.seller.toLowerCase() === (walletAddress || '0x742d35Cc6635C0532925a3b8D9C1aCb4d3D9b123').toLowerCase()));
                return;
            }

            setLoading(true);
            try {
                const [buyerData, sellerData] = await Promise.all([
                    getBuyerEscrows(walletAddress),
                    getSellerEscrows(walletAddress)
                ]);
                
                setBuyerEscrows(buyerData);
                setSellerEscrows(sellerData);
                setEscrows([...buyerData, ...sellerData]);
            } catch (error) {
                console.error('Error loading escrows:', error);
                // Fallback to empty arrays on error
                setBuyerEscrows([]);
                setSellerEscrows([]);
                setEscrows([]);
            } finally {
                setLoading(false);
            }
        };

        loadEscrows();
    }, [walletAddress]);

    // Check if user is fraud oracle
    useEffect(() => {
        const checkFraudOracle = async () => {
            if (!walletAddress) {
                setIsUserFraudOracle(false);
                setIsFraudOracleActive(false);
                return;
            }
            
            try {
                const isConfigured = await isFraudOracleConfigured();
                setIsFraudOracleActive(isConfigured);
                
                if (isConfigured) {
                    const isOracle = await isFraudOracle(walletAddress);
                    setIsUserFraudOracle(isOracle);
                } else {
                    setIsUserFraudOracle(false);
                }
            } catch (error) {
                console.error('Error checking fraud oracle status:', error);
                setIsUserFraudOracle(false);
                setIsFraudOracleActive(false);
            }
        };
        
        checkFraudOracle();
    }, [walletAddress]);

    // Mock escrow data - in production this would come from blockchain
    const mockEscrows = [
        {
            id: 'escrow-1',
            amount: '500.00',
            seller: '0x742d35Cc6635C0532925a3b8D9C1aCb4d3D9b123',
            status: 'active',
            description: 'Website development project',
            createdAt: '2025-01-10',
            role: 'buyer'
        },
        {
            id: 'escrow-2', 
            amount: '250.00',
            buyer: '0x1234567890abcdef1234567890abcdef12345678',
            status: 'pending_release',
            description: 'Logo design services',
            createdAt: '2025-01-08',
            role: 'seller'
        },
        {
            id: 'escrow-3',
            amount: '1000.00',
            seller: '0xabcdef1234567890abcdef1234567890abcdef12',
            status: 'completed',
            description: 'Mobile app development',
            createdAt: '2025-01-05',
            role: 'buyer'
        }
    ];

    const getStatusColor = (status) => {
        // Handle both old mock format and new contract format
        if (typeof status === 'number') {
            // Contract enum values
            switch (status) {
                case EscrowStatus.Active: return 'blue';
                case EscrowStatus.Released: return 'green';
                case EscrowStatus.Refunded: return 'red';
                case EscrowStatus.FraudFlagged: return 'red';
                default: return 'default';
            }
        } else {
            // Legacy mock format
            switch (status) {
                case 'active': return 'blue';
                case 'pending_release': return 'orange';
                case 'completed': return 'green';
                case 'refunded': return 'red';
                default: return 'default';
            }
        }
    };

    const getStatusText = (status, statusText) => {
        // Use statusText if provided (from contract), otherwise map legacy status
        if (statusText) return statusText;
        
        if (typeof status === 'number') {
            return getContractStatusText(status);
        } else {
            // Legacy mock format
            switch (status) {
                case 'active': return 'Active Escrow';
                case 'pending_release': return 'Pending Release';
                case 'completed': return 'Completed';
                case 'refunded': return 'Refunded';
                default: return status;
            }
        }
    };

    const columns = [
        {
            title: 'Escrow ID',
            dataIndex: 'id',
            key: 'id',
            render: (id) => <Text code>{id}</Text>
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => (
                <Space>
                    <DollarOutlined style={{ color: '#00aef2' }} />
                    <Text strong>${amount} PYUSD</Text>
                </Space>
            )
        },
        {
            title: 'Counterparty',
            key: 'counterparty',
            render: (record) => {
                // Determine counterparty based on wallet address
                let counterparty = '';
                let role = '';
                
                if (walletAddress && record.buyer && record.seller) {
                    if (record.buyer.toLowerCase() === walletAddress.toLowerCase()) {
                        counterparty = record.seller;
                        role = 'buyer';
                    } else if (record.seller.toLowerCase() === walletAddress.toLowerCase()) {
                        counterparty = record.buyer;
                        role = 'seller';
                    } else {
                        // Fallback to record.role if available (for mock data)
                        counterparty = record.role === 'buyer' ? record.seller : record.buyer;
                        role = record.role;
                    }
                } else {
                    // Fallback for mock data format
                    counterparty = record.role === 'buyer' ? record.seller : record.buyer;
                    role = record.role || 'buyer';
                }
                
                return <Text code>{counterparty}</Text>;
            }
        },
        {
            title: 'Role',
            key: 'role',
            render: (record) => {
                let role = '';
                
                if (walletAddress && record.buyer && record.seller) {
                    if (record.buyer.toLowerCase() === walletAddress.toLowerCase()) {
                        role = 'buyer';
                    } else if (record.seller.toLowerCase() === walletAddress.toLowerCase()) {
                        role = 'seller';
                    } else {
                        role = record.role || 'buyer';
                    }
                } else {
                    role = record.role || 'buyer';
                }
                
                return (
                    <Tag color={role === 'buyer' ? 'blue' : 'green'}>
                        {role.toUpperCase()}
                    </Tag>
                );
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Space>
                    <Tag color={getStatusColor(status)}>
                        {getStatusText(status, record.statusText)}
                    </Tag>
                    {record.fraudFlagged && (
                        <Tag color="red" icon={<ExclamationCircleOutlined />} size="small">
                            Fraud
                        </Tag>
                    )}
                </Space>
            )
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt'
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record) => (
                <Button
                    type="primary"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => router.push(`/escrow/${record.id}`)}
                >
                    View Details
                </Button>
            )
        }
    ];

    // Use the loaded escrows or filter mock data appropriately
    const activeEscrows = isContractAvailable() 
        ? escrows.filter(e => e.status === EscrowStatus.Active)
        : mockEscrows.filter(e => e.status === 'active' || e.status === 'pending_release');
        
    const completedEscrows = isContractAvailable()
        ? escrows.filter(e => e.status === EscrowStatus.Released || e.status === EscrowStatus.Refunded)
        : mockEscrows.filter(e => e.status === 'completed' || e.status === 'refunded');

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
            <div style={{ marginBottom: '32px' }}>
                <Space align="center" style={{ marginBottom: '16px' }}>
                    <Title level={1} style={{ margin: 0 }}>My Escrows</Title>
                    {isUserFraudOracle && (
                        <Tag color="purple" icon={<SafetyCertificateTwoTone />}>
                            Fraud Oracle
                        </Tag>
                    )}
                </Space>
                <Paragraph style={{ fontSize: '16px', color: '#666' }}>
                    Manage your PYUSD escrow transactions with built-in fraud protection
                </Paragraph>
            </div>

            <DemoModeAlert />

            {!isFraudOracleActive && isContractAvailable() && (
                <Alert
                    message="No Fraud Oracle Configured"
                    description="The contract owner has not configured a fraud oracle. Fraud protection features are disabled."
                    type="warning"
                    showIcon
                    style={{ marginBottom: '16px' }}
                />
            )}

            <Tabs defaultActiveKey="active" size="large"
                loading={loading}
            >
                <TabPane 
                    tab={
                        <Space>
                            <ClockCircleOutlined />
                            Active Escrows ({activeEscrows.length})
                        </Space>
                    } 
                    key="active"
                >
                    <Card>
                        <Table
                            columns={columns}
                            dataSource={activeEscrows}
                            rowKey="id"
                            pagination={false}
                            locale={{
                                emptyText: (
                                    <div style={{ textAlign: 'center', padding: '40px' }}>
                                        <SafetyCertificateTwoTone twoToneColor="#d9d9d9" style={{ fontSize: '48px', marginBottom: '16px' }} />
                                        <Title level={4} style={{ color: '#999' }}>No Active Escrows</Title>
                                        <Paragraph style={{ color: '#666' }}>
                                            You don't have any active escrow transactions.
                                        </Paragraph>
                                        <Button 
                                            type="primary" 
                                            onClick={() => router.push('/escrow')}
                                        >
                                            Create New Escrow
                                        </Button>&nbsp; 
                                            <Button 
                                            type="secondary"
                        onClick={() => router.push('/about')}
                    >
                        Learn More
                    </Button>
                                    </div>
                                )
                            }}
                        />
                    </Card>
                </TabPane>

                <TabPane 
                    tab={
                        <Space>
                            <CheckCircleOutlined />
                            Completed ({completedEscrows.length})
                        </Space>
                    } 
                    key="completed"
                >
                    <Card>
                        <Table
                            columns={columns}
                            dataSource={completedEscrows}
                            rowKey="id"
                            pagination={false}
                        />
                    </Card>
                </TabPane>

                {isUserFraudOracle && isFraudOracleActive && (
                    <TabPane 
                        tab={
                            <Space>
                                <SafetyCertificateTwoTone />
                                Oracle Functions
                            </Space>
                        } 
                        key="oracle"
                    >
                        <Card title="Fraud Oracle Dashboard" size="small">
                            <Alert
                                message="Fraud Oracle Access"
                                description="You have fraud oracle permissions. You can monitor and flag fraudulent escrows."
                                type="info"
                                showIcon
                                style={{ marginBottom: '16px' }}
                            />
                            <Paragraph>
                                As a fraud oracle, you can:
                            </Paragraph>
                            <ul>
                                <li>Monitor all escrow transactions</li>
                                <li>Mark fraudulent escrows (triggers automatic refund)</li>
                                <li>Initiate refunds on behalf of buyers</li>
                            </ul>
                            <Paragraph type="secondary">
                                All escrows with active status are available for fraud monitoring.
                                Click "View Details" on any escrow to access oracle functions.
                            </Paragraph>
                        </Card>
                    </TabPane>
                )}
            </Tabs>
        </div>
    );
}