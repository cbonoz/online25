'use client';

import React, { useState } from 'react';
import { Button, Card, Form, Input, InputNumber, Typography, Space, Alert, Steps, message } from 'antd';
import { LockOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { createEscrow, isContractAvailable } from '../util/safeSendContract';
import { useWalletClient } from '../hooks/useWalletClient';
import DemoModeAlert from '../lib/DemoModeAlert';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

export default function DepositPage() {
    const router = useRouter();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const walletClient = useWalletClient();

    const handleDeposit = async (values) => {
        if (!isContractAvailable()) {
            message.info('Running in demo mode - would create escrow in production');
            // Simulate transaction for demo
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 2000));
            setLoading(false);
            router.push(`/escrow/demo-${Date.now()}`);
            return;
        }

        if (!walletClient) {
            message.error('Please connect your wallet first');
            return;
        }

        setLoading(true);
        try {
            console.log('Creating escrow with values:', values);
            
            const hash = await createEscrow(
                walletClient,
                values.seller,
                values.amount,
                values.description
            );
            
            message.success('Escrow created successfully!');
            console.log('Transaction hash:', hash);
            
            // Navigate to a transaction status page or back to my-escrows
            router.push('/my-escrows');
        } catch (error) {
            console.error('Deposit failed:', error);
            message.error(error.message || 'Failed to create escrow');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        {
            title: 'Escrow Details',
            description: 'Set up the escrow parameters'
        },
        {
            title: 'Deposit Funds',
            description: 'Deposit PYUSD into escrow'
        },
        {
            title: 'Confirmation',
            description: 'Review and confirm transaction'
        }
    ];

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <Title level={1}>Create PYUSD Escrow</Title>
                <Paragraph style={{ fontSize: '18px', color: '#666' }}>
                    Securely deposit PYUSD with built-in fraud protection and oracle verification
                </Paragraph>
            </div>

            <Steps current={currentStep} style={{ marginBottom: '40px' }}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title} description={item.description} />
                ))}
            </Steps>

            <DemoModeAlert 
                description="This is a demonstration interface. In production, this would connect to deployed SafeSend smart contracts on Ethereum."
            />

            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleDeposit}
                    size="large"
                >
                    <Form.Item
                        label="Seller Address"
                        name="sellerAddress"
                        rules={[
                            { required: true, message: 'Please enter the seller address' },
                            { pattern: /^0x[a-fA-F0-9]{40}$/, message: 'Please enter a valid Ethereum address' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="0x..."
                            style={{ borderRadius: '8px' }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="PYUSD Amount"
                        name="amount"
                        rules={[
                            { required: true, message: 'Please enter the amount' },
                            { type: 'number', min: 0.01, message: 'Amount must be greater than 0.01' }
                        ]}
                    >
                        <InputNumber
                            prefix={<DollarOutlined />}
                            placeholder="100.00"
                            style={{ width: '100%', borderRadius: '8px' }}
                            step={0.01}
                            precision={2}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Description (Optional)"
                        name="description"
                    >
                        <Input.TextArea
                            placeholder="Describe the transaction or service..."
                            rows={3}
                            style={{ borderRadius: '8px' }}
                        />
                    </Form.Item>

                    <div style={{ 
                        background: '#f8fafc', 
                        padding: '16px', 
                        borderRadius: '8px', 
                        marginBottom: '24px' 
                    }}>
                        <Title level={5}>How it works:</Title>
                        <ul style={{ color: '#666', margin: 0 }}>
                            <li>Your PYUSD will be held securely in a smart contract escrow</li>
                            <li>Fraud oracles monitor the transaction for any suspicious activity</li>
                            <li>Funds are released to seller only when transaction is verified safe</li>
                            <li>Automatic refund if fraud is detected by oracle attestation</li>
                        </ul>
                    </div>

                    <Space size="middle" style={{ width: '100%', justifyContent: 'center' }}>
                        <Button
                            size="large"
                            onClick={() => router.push('/')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            htmlType="submit"
                            loading={loading}
                            icon={<LockOutlined />}
                        >
                            {loading ? 'Creating Escrow...' : 'Create Escrow'}
                        </Button>
                    </Space>
                </Form>
            </Card>
        </div>
    );
}