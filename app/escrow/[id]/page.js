'use client';

import React, { useState, useEffect } from 'react';
import { Card, Typography, Space, Button, Alert, Tag, Descriptions, Steps, Timeline, message } from 'antd';
import { 
    DollarOutlined, 
    UserOutlined, 
    SafetyCertificateTwoTone,
    CheckCircleOutlined,
    WarningOutlined,
    ArrowLeftOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import { 
    getEscrow, 
    releaseEscrow, 
    refundEscrow, 
    isContractAvailable,
    EscrowStatus,
    getStatusText as getContractStatusText
} from '../../util/safeSendContract';
import { useWalletClient } from '../../hooks/useWalletClient';
import { useWalletAddress } from '../../hooks/useWalletAddress';
import DemoModeAlert from '../../lib/DemoModeAlert';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

export default function EscrowDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [escrowData, setEscrowData] = useState(null);
    const walletClient = useWalletClient();
    const { address: walletAddress } = useWalletAddress();

    // Load escrow data from contract or mock data
    useEffect(() => {
        const loadEscrowData = async () => {
            if (!isContractAvailable()) {
                // Use mock data in demo mode
                setTimeout(() => {
                    setEscrowData({
                        id: params.id || 'escrow-1',
                        amount: '500.00',
                        buyer: '0x1234567890abcdef1234567890abcdef12345678',
                        seller: '0x742d35Cc6635C0532925a3b8D9C1aCb4d3D9b123',
                        status: EscrowStatus.Active,
                        statusText: 'Active',
                        description: 'Website development project - Full stack e-commerce platform',
                        createdAt: '2025-01-10T14:30:00Z',
                        lastUpdated: '2025-01-10T14:30:00Z',
                        txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
                        oracleAddress: '0x9876543210fedcba9876543210fedcba98765432',
                        fraudFlagged: false,
                        events: [
                            {
                                type: 'Deposited',
                                timestamp: '2025-01-10T14:30:00Z',
                                description: 'PYUSD deposited into escrow contract',
                                txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
                            }
                        ]
                    });
                }, 1000);
                return;
            }

            // Try to load from contract
            try {
                const escrowId = parseInt(params.id);
                if (isNaN(escrowId)) {
                    throw new Error('Invalid escrow ID');
                }
                
                const data = await getEscrow(escrowId);
                setEscrowData(data);
            } catch (error) {
                console.error('Error loading escrow data:', error);
                message.error('Failed to load escrow data');
            }
        };

        loadEscrowData();
    }, [params.id]);

    const handleRelease = async () => {
        if (!isContractAvailable()) {
            message.info('Running in demo mode - would release funds in production');
            return;
        }

        if (!walletClient) {
            message.error('Please connect your wallet first');
            return;
        }

        setLoading(true);
        try {
            console.log('Releasing funds for escrow:', params.id);
            const hash = await releaseEscrow(walletClient, parseInt(params.id));
            message.success('Funds released successfully!');
            console.log('Transaction hash:', hash);
            
            // Refresh escrow data
            window.location.reload();
        } catch (error) {
            console.error('Release failed:', error);
            message.error(error.message || 'Failed to release funds');
        } finally {
            setLoading(false);
        }
    };

    const handleRefund = async () => {
        if (!isContractAvailable()) {
            message.info('Running in demo mode - would process refund in production');
            return;
        }

        if (!walletClient) {
            message.error('Please connect your wallet first');
            return;
        }

        setLoading(true);
        try {
            console.log('Processing refund for escrow:', params.id);
            const hash = await refundEscrow(walletClient, parseInt(params.id));
            message.success('Refund processed successfully!');
            console.log('Transaction hash:', hash);
            
            // Refresh escrow data
            window.location.reload();
        } catch (error) {
            console.error('Refund failed:', error);
            message.error(error.message || 'Failed to process refund');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        // Handle both numeric (contract) and string (mock) status values
        if (typeof status === 'number') {
            switch (status) {
                case EscrowStatus.Active: return 'blue';
                case EscrowStatus.Released: return 'green';
                case EscrowStatus.Refunded: return 'red';
                case EscrowStatus.FraudFlagged: return 'red';
                default: return 'default';
            }
        } else {
            // Legacy string format
            switch (status) {
                case 'active': return 'blue';
                case 'completed': return 'green';
                case 'refunded': return 'red';
                case 'fraud_flagged': return 'red';
                default: return 'default';
            }
        }
    };

    const getStatusText = (status, statusText) => {
        if (statusText) return statusText;
        
        if (typeof status === 'number') {
            return getContractStatusText(status);
        } else {
            // Legacy format
            switch (status) {
                case 'active': return 'Active';
                case 'completed': return 'Completed';
                case 'refunded': return 'Refunded';
                case 'fraud_flagged': return 'Fraud Flagged';
                default: return status;
            }
        }
    };

    const canRelease = () => {
        if (!escrowData || !walletAddress) return false;
        
        // Only buyer can release funds and only if escrow is active
        const isBuyer = walletAddress.toLowerCase() === escrowData.buyer.toLowerCase();
        const isActive = (typeof escrowData.status === 'number') 
            ? escrowData.status === EscrowStatus.Active 
            : escrowData.status === 'active';
            
        return isBuyer && isActive && !escrowData.fraudFlagged;
    };

    const canRefund = () => {
        if (!escrowData || !walletAddress) return false;
        
        // Both buyer and seller can request refund if escrow is active
        const isBuyer = walletAddress.toLowerCase() === escrowData.buyer.toLowerCase();
        const isSeller = walletAddress.toLowerCase() === escrowData.seller.toLowerCase();
        const isActive = (typeof escrowData.status === 'number') 
            ? escrowData.status === EscrowStatus.Active 
            : escrowData.status === 'active';
            
        return (isBuyer || isSeller) && isActive;
    };

    if (!escrowData) {
        return (
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
                <Card loading={true} style={{ minHeight: '400px' }} />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Button 
                    icon={<ArrowLeftOutlined />} 
                    onClick={() => router.push('/my-escrows')}
                    style={{ marginBottom: '16px' }}
                >
                    Back to My Escrows
                </Button>
                <Title level={1}>Escrow Details</Title>
                <Text code style={{ fontSize: '16px' }}>{escrowData.id}</Text>
            </div>

            <DemoModeAlert 
                description="This shows sample escrow details. In production, this would display real-time blockchain data."
            />

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                {/* Main Content */}
                <div>
                    <Card title="Escrow Information" style={{ marginBottom: '24px' }}>
                        <Descriptions column={1} size="large">
                            <Descriptions.Item label="Status">
                                <Tag color={getStatusColor(escrowData.status)} style={{ fontSize: '14px', padding: '4px 12px' }}>
                                    {getStatusText(escrowData.status, escrowData.statusText)}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Amount">
                                <Space>
                                    <DollarOutlined style={{ color: '#00aef2' }} />
                                    <Text strong style={{ fontSize: '18px' }}>${escrowData.amount} PYUSD</Text>
                                </Space>
                            </Descriptions.Item>
                            <Descriptions.Item label="Buyer">
                                <Text code>{escrowData.buyer}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Seller">
                                <Text code>{escrowData.seller}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Description">
                                <Text>{escrowData.description}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Created">
                                <Text>{new Date(escrowData.createdAt).toLocaleString()}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Transaction Hash">
                                <Text code>{escrowData.txHash}</Text>
                                <Button 
                                    type="link" 
                                    size="small" 
                                    icon={<EyeOutlined />}
                                    href={`https://sepolia.etherscan.io/tx/${escrowData.txHash}`}
                                    target="_blank"
                                >
                                    View on Etherscan
                                </Button>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    <Card title="Transaction Timeline">
                        <Timeline>
                            {(escrowData?.events || []).map((event, index) => (
                                <Timeline.Item 
                                    key={index}
                                    dot={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                                >
                                    <div>
                                        <Text strong>{event.type}</Text>
                                        <br />
                                        <Text type="secondary">
                                            {new Date(event.timestamp).toLocaleString()}
                                        </Text>
                                        <br />
                                        <Text>{event.description}</Text>
                                        {event.txHash && (
                                            <>
                                                <br />
                                                <Text code style={{ fontSize: '12px' }}>{event.txHash}</Text>
                                            </>
                                        )}
                                    </div>
                                </Timeline.Item>
                            ))}
                        </Timeline>
                    </Card>
                </div>

                {/* Sidebar */}
                <div>
                    <Card title="Actions" style={{ marginBottom: '24px' }}>
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            {canRelease() && (
                                <Button 
                                    type="primary" 
                                    size="large" 
                                    block
                                    onClick={handleRelease}
                                    loading={loading}
                                    icon={<CheckCircleOutlined />}
                                >
                                    Release Funds
                                </Button>
                            )}
                            {canRefund() && (
                                <Button 
                                    danger 
                                    size="large" 
                                    block
                                    onClick={handleRefund}
                                    loading={loading}
                                    icon={<WarningOutlined />}
                                >
                                    Request Refund
                                </Button>
                            )}
                            <Button 
                                size="large" 
                                block
                                href={`https://sepolia.etherscan.io/address/${escrowData.txHash || escrowData.id}`}
                                target="_blank"
                                icon={<EyeOutlined />}
                            >
                                View on Explorer
                            </Button>
                        </Space>
                    </Card>

                    <Card title="Fraud Protection" size="small">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <SafetyCertificateTwoTone twoToneColor="#52c41a" style={{ fontSize: '16px' }} />
                                <Text>Oracle monitoring active</Text>
                            </div>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                Fraud oracle: <Text code>{escrowData.oracleAddress}</Text>
                            </Text>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                Automatic refund if fraud detected
                            </Text>
                        </Space>
                    </Card>
                </div>
            </div>
        </div>
    );
}