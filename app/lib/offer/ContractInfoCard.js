'use client';

import React from 'react';
import { 
    Card, 
    Typography, 
    Space
} from 'antd';

const { Text } = Typography;

export default function ContractInfoCard({ offerData }) {
    if (!offerData) return null;

    return (
        <Card title="Contract Information" style={{ marginBottom: 24 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                    <Text strong>Contract Address:</Text>
                    <br />
                    <Text code copyable style={{ fontSize: '12px' }}>
                        {offerData.contractAddress}
                    </Text>
                </div>
                <div>
                    <Text strong>Owner:</Text>
                    <br />
                    <Text code copyable style={{ fontSize: '12px' }}>
                        {offerData.owner}
                    </Text>
                </div>
                <div>
                    <Text strong>Status:</Text>
                    <br />
                    <Text type={offerData.isActive ? 'success' : 'danger'}>
                        {offerData.isActive ? 'Active' : 'Inactive'}
                    </Text>
                </div>
            </Space>
        </Card>
    );
}
