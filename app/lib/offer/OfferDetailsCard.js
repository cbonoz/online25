'use client';

import React from 'react';
import { 
    Card, 
    Typography, 
    Space, 
    Divider,
    Tag,
    Row,
    Col,
    Statistic,
    Button,
    message
} from 'antd';
import { 
    DollarOutlined, 
    CalendarOutlined, 
    UserOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import { useWalletClient } from '../../hooks/useWalletClient';

const { Title, Paragraph, Text } = Typography;

const OfferDetailsCard = React.memo(function OfferDetailsCard({ offerData, onDeactivate }) {
    const walletClient = useWalletClient();
    const [loading, setLoading] = React.useState(false);

    const handleDeactivate = async () => {
        if (!walletClient) {
            message.error('Please connect your wallet');
            return;
        }
        setLoading(true);
        try {
            await deactivateOffer(walletClient, offerData.contractAddress);
            message.success('Offer deactivated successfully!');
            if (onDeactivate) onDeactivate();
        } catch (error) {
            message.error('Failed to deactivate offer: ' + (error.message || error));
        } finally {
            setLoading(false);
        }
    };

    if (!offerData) return null;

    return (
        <Card style={{ marginBottom: 24 }}>
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: 24 }}>
                {offerData.description}
            </Paragraph>

            {!offerData.isActive && (
                <div style={{ 
                    padding: '12px', 
                    backgroundColor: '#fff2f0', 
                    borderRadius: '6px', 
                    marginBottom: '16px',
                    border: '1px solid #ffccc7'
                }}>
                    <Text strong style={{ color: '#ff4d4f' }}>
                        ⚠️ This offer is no longer accepting new requests
                    </Text>
                </div>
            )}

            <Divider />

            <Row gutter={[24, 16]}>
                <Col xs={12} sm={6}>
                    <Statistic
                        title="Amount"
                        value={offerData.amount}
                        prefix={<DollarOutlined />}
                        suffix="PYUSD"
                        precision={2}
                    />
                </Col>
                <Col xs={12} sm={6}>
                    <Statistic
                        title="Claims"
                        value={offerData.claimCount}
                        prefix={<CheckCircleOutlined />}
                    />
                </Col>
                <Col xs={12} sm={6}>
                    <div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Created</Text>
                        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                            <CalendarOutlined style={{ marginRight: 8 }} />
                            {offerData.createdAt ? new Date(offerData.createdAt).toLocaleDateString() : ''}
                        </div>
                    </div>
                </Col>
            </Row>
        </Card>
    );
});
export default OfferDetailsCard;
