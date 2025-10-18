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

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

export default function MyEscrowsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

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
        switch (status) {
            case 'active': return 'blue';
            case 'pending_release': return 'orange';
            case 'completed': return 'green';
            case 'refunded': return 'red';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active': return 'Active Escrow';
            case 'pending_release': return 'Pending Release';
            case 'completed': return 'Completed';
            case 'refunded': return 'Refunded';
            default: return status;
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
            render: (record) => (
                <Text code>
                    {record.role === 'buyer' ? record.seller : record.buyer}
                </Text>
            )
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <Tag color={role === 'buyer' ? 'blue' : 'green'}>
                    {role.toUpperCase()}
                </Tag>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {getStatusText(status)}
                </Tag>
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

    const activeEscrows = mockEscrows.filter(e => e.status === 'active' || e.status === 'pending_release');
    const completedEscrows = mockEscrows.filter(e => e.status === 'completed' || e.status === 'refunded');

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
            <div style={{ marginBottom: '32px' }}>
                <Title level={1}>My Escrows</Title>
                <Paragraph style={{ fontSize: '16px', color: '#666' }}>
                    Manage your PYUSD escrow transactions with built-in fraud protection
                </Paragraph>
            </div>

            <Alert
                message="Demo Mode"
                description="This shows sample escrow data. In production, this would display your actual on-chain escrow transactions."
                type="info"
                showIcon
                style={{ marginBottom: '24px' }}
            />

            <Tabs defaultActiveKey="active" size="large">
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
            </Tabs>

            <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <Space size="large">
                    <Button 
                        type="primary" 
                        size="large"
                        onClick={() => router.push('/escrow')}
                    >
                        Create New Escrow
                    </Button>
                    <Button 
                        size="large"
                        onClick={() => router.push('/about')}
                    >
                        Learn More
                    </Button>
                </Space>
            </div>
        </div>
    );
}