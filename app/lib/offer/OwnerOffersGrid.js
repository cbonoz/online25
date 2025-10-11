'use client';

import React, {useState} from 'react';
import { 
    Card, 
    Row, 
    Col, 
    Tag, 
    Typography, 
    Button, 
    Space,
    Spin,
    Empty,
    Tooltip
} from 'antd';
import { 
    EyeOutlined, 
    DollarOutlined, 
    ClockCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text, Paragraph } = Typography;

const STATUS_CONFIG = {
    pending: {
        color: 'orange',
        icon: <ClockCircleOutlined />,
        text: 'Pending'
    },
    accepted: {
        color: 'blue',
        icon: <ExclamationCircleOutlined />,
        text: 'Accepted'
    },
    funded: {
        color: 'cyan',
        icon: <DollarOutlined />,
        text: 'Funded'
    },
    completed: {
        color: 'green',
        icon: <CheckCircleOutlined />,
        text: 'Completed'
    },
    inactive: {
        color: 'red',
        icon: <ExclamationCircleOutlined />,
        text: 'Inactive'
    }
};

export default function OwnerOffersGrid({ offers, loading, showEmptyState = true }) {
    const router = useRouter();
    const [loadingOffer, setLoadingOffer] = useState(null); // contractAddress of offer being acted on

    const handleViewOffer = (contractAddress) => {
        setLoadingOffer(contractAddress);
        // Simulate async navigation for demo; replace with actual async if needed
        setTimeout(() => {
            setLoadingOffer(null);
            router.push(`/offer/${contractAddress}`);
        }, 300);
    };

    const truncateText = (text, maxLength = 80) => {
        if (!text) return '';
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };

    if (loading) {
        return (
            <Card>
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Spin size="large" />
                    <Paragraph style={{ marginTop: 16 }}>Loading your offers...</Paragraph>
                </div>
            </Card>
        );
    }

    if (!offers || offers.length === 0) {
        if (!showEmptyState) {
            return null;
        }
        return (
            <Card>
                <Empty
                    description="No other offers found"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                    <Button 
                        type="primary" 
                        onClick={() => router.push('/create')}
                    >
                        Create Another Offer
                    </Button>
                </Empty>
            </Card>
        );
    }

    return (
        <div>
            <Title level={4} style={{ marginBottom: 16 }}>
                Your Offers ({offers.length})
            </Title>
            <Row gutter={[16, 16]}>
                {offers.map((offer) => {
                    const statusConfig = STATUS_CONFIG[offer.status] || STATUS_CONFIG.pending;
                    const isLoading = loadingOffer === offer.contractAddress;
                    return (
                        <Col xs={24} sm={12} lg={8} key={offer.contractAddress}>
                            <Card
                                hoverable
                                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                bodyStyle={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                            >
                                <div style={{ marginBottom: 12 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                        <Tag 
                                            color={statusConfig.color} 
                                            icon={statusConfig.icon}
                                            style={{ marginBottom: 0 }}
                                        >
                                            {statusConfig.text}
                                        </Tag>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                            {offer.createdAt}
                                        </Text>
                                    </div>
                                    <Title level={5} style={{ margin: '8px 0', lineHeight: 1.3 }}>
                                        {truncateText(offer.title, 40)}
                                    </Title>
                                    <Paragraph 
                                        type="secondary" 
                                        style={{ 
                                            margin: '8px 0',
                                            fontSize: '13px',
                                            lineHeight: 1.4,
                                            minHeight: '40px'
                                        }}
                                    >
                                        {truncateText(offer.description, 60)}
                                    </Paragraph>
                                </div>
                                <div style={{ marginTop: 'auto' }}>
                                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>
                                                ${offer.amount} PYUSD
                                            </Text>
                                            <Tag color="blue" style={{ fontSize: '11px' }}>
                                                {offer.serviceType}
                                            </Tag>
                                        </div>
                                        {offer.deadline && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <ClockCircleOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    Due: {offer.deadline}
                                                </Text>
                                            </div>
                                        )}
                                        <div style={{ fontSize: '11px', color: '#8c8c8c' }}>
                                            {offer.contractAddress.slice(0, 6)}...{offer.contractAddress.slice(-4)}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8, flexWrap: 'wrap', gap: 8 }}>
                                            <Tooltip title="View Details">
                                                <Button 
                                                    type="text" 
                                                    icon={isLoading ? <Spin size="small" /> : <EyeOutlined />} 
                                                    onClick={() => handleViewOffer(offer.contractAddress)}
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? 'Loading...' : 'View'}
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    </Space>
                                </div>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
}
