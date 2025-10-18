'use client';

import React, { useState, useEffect } from 'react';
import { Card, Typography, Space, Button, Alert, Tag, Descriptions, Steps, Timeline } from 'antd';
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

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

export default function EscrowDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [escrowData, setEscrowData] = useState(null);

    // Mock escrow data - in production this would come from blockchain
    useEffect(() => {
        // Simulate loading escrow data
        setTimeout(() => {
            setEscrowData({
                id: params.id || 'escrow-1',
                amount: '500.00',
                buyer: '0x1234567890abcdef1234567890abcdef12345678',
                seller: '0x742d35Cc6635C0532925a3b8D9C1aCb4d3D9b123',
                status: 'active',
                description: 'Website development project - Full stack e-commerce platform',
                createdAt: '2025-01-10T14:30:00Z',
                lastUpdated: '2025-01-10T14:30:00Z',
                txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
                oracleAddress: '0x9876543210fedcba9876543210fedcba98765432',
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
    }, [params.id]);

    const handleRelease = async () => {
        setLoading(true);
        try {
            // TODO: Implement release logic
            console.log('Releasing funds...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Update status or refresh data
        } catch (error) {
            console.error('Release failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefund = async () => {
        setLoading(true);
        try {
            // TODO: Implement refund logic
            console.log('Processing refund...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Update status or refresh data
        } catch (error) {
            console.error('Refund failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'blue';
            case 'pending_release': return 'orange';
            case 'completed': return 'green';
            case 'refunded': return 'red';
            case 'fraud_flagged': return 'red';
            default: return 'default';
        }
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

            <Alert
                message="Demo Mode"
                description="This shows sample escrow details. In production, this would display real-time blockchain data."
                type="info"
                showIcon
                style={{ marginBottom: '24px' }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                {/* Main Content */}
                <div>
                    <Card title="Escrow Information" style={{ marginBottom: '24px' }}>
                        <Descriptions column={1} size="large">
                            <Descriptions.Item label="Status">
                                <Tag color={getStatusColor(escrowData.status)} style={{ fontSize: '14px', padding: '4px 12px' }}>
                                    {escrowData.status.replace('_', ' ').toUpperCase()}
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
                            {escrowData.events.map((event, index) => (
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
                            {escrowData.status === 'active' && (
                                <>
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
                                </>
                            )}
                            <Button 
                                size="large" 
                                block
                                href={`https://sepolia.etherscan.io/address/${escrowData.txHash}`}
                                target="_blank"
                                icon={<EyeOutlined />}
                            >
                                View Contract
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