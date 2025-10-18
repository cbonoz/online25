'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Space, Button, Alert, Tag, Descriptions, Steps, Timeline, message } from 'antd';
import { 
    DollarOutlined, 
    UserOutlined, 
    SafetyCertificateTwoTone,
    CheckCircleOutlined,
    WarningOutlined,
    ArrowLeftOutlined,
    EyeOutlined,
    ExclamationCircleOutlined,
    HistoryOutlined,
    LinkOutlined
} from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import { 
    getEscrow, 
    releaseEscrow, 
    refundEscrow, 
    isContractAvailable,
    EscrowStatus,
    getStatusText as getContractStatusText,
    getFraudOracle,
    markFraud,
    isFraudOracle,
    isFraudOracleConfigured
} from '../../util/safeSendContract';
import { useWalletClient } from '../../hooks/useWalletClient';
import { useWalletAddress } from '../../hooks/useWalletAddress';
import { useBlockscout } from '../../hooks/useBlockscout';
import DemoModeAlert from '../../lib/DemoModeAlert';
import { siteConfig, PYUSD_TOKEN_ADDRESS } from '../../constants';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

export default function EscrowDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true); // Start with loading true
    const [escrowData, setEscrowData] = useState(null);
    const [error, setError] = useState(null);
    const [fraudOracleAddress, setFraudOracleAddress] = useState(null);
    const [isUserFraudOracle, setIsUserFraudOracle] = useState(false);
    const [isFraudOracleActive, setIsFraudOracleActive] = useState(false);
    const walletClient = useWalletClient();
    const { address: walletAddress } = useWalletAddress();
    const { 
        showTransactionToast, 
        showContractTransactions, 
        showAddressTransactions,
        showTokenTransactions 
    } = useBlockscout();
    const mountedRef = useRef(true);

    // Cleanup function to prevent memory leaks
    useEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

    // Load escrow data from contract or mock data
    useEffect(() => {
        // Don't load if no escrow ID
        if (!params.id) {
            console.log('No params.id, skipping load');
            return;
        }

        // Prevent multiple concurrent loads for the same ID
        let isCancelled = false;

        const loadEscrowData = async () => {
            if (mountedRef.current && !isCancelled) {
                setLoading(true);
                setError(null);
            }
            
            if (!isContractAvailable()) {
                // Use mock data in demo mode
                setTimeout(() => {
                    if (mountedRef.current && !isCancelled) {
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
                    }
                    if (mountedRef.current && !isCancelled) {
                        setLoading(false);
                    }
                }, 1000);
                return;
            }

            // Try to load from contract
            try {
                const escrowId = parseInt(params.id);
                
                if (isNaN(escrowId) || escrowId <= 0) {
                    throw new Error(`Invalid escrow ID: ${params.id}. Please provide a valid numeric escrow ID.`);
                }
                
                const data = await getEscrow(escrowId);
                
                if (mountedRef.current && !isCancelled) {
                    setEscrowData(data);
                    setError(null);
                }
            } catch (error) {
                // Handle specific error types
                let errorMessage = 'Failed to load escrow data';
                
                if (error.message.includes('Escrow does not exist')) {
                    errorMessage = `Escrow #${params.id} does not exist. Please check the escrow ID and try again.`;
                } else if (error.message.includes('Invalid escrow ID')) {
                    errorMessage = error.message;
                } else if (error.message.includes('Contract not available')) {
                    errorMessage = 'Contract is not available. Please try again later.';
                } else {
                    errorMessage = `Error loading escrow: ${error.message}`;
                }
                
                if (mountedRef.current && !isCancelled) {
                    setError(errorMessage);
                    setEscrowData(null);
                }
            } finally {
                if (mountedRef.current && !isCancelled) {
                    setLoading(false);
                }
            }
        };

        loadEscrowData();
        
        // Return cleanup function
        return () => {
            isCancelled = true;
        };
    }, [params.id]); // Only depend on params.id

    // Load fraud oracle information
    useEffect(() => {
        const loadFraudOracleInfo = async () => {
            if (!isContractAvailable() || !walletAddress) {
                // Demo mode - mock fraud oracle
                setFraudOracleAddress('0x9876543210fedcba9876543210fedcba98765432');
                setIsUserFraudOracle(false);
                setIsFraudOracleActive(true);
                return;
            }

            try {
                const isConfigured = await isFraudOracleConfigured();
                setIsFraudOracleActive(isConfigured);
                
                if (isConfigured) {
                    const oracleAddress = await getFraudOracle();
                    setFraudOracleAddress(oracleAddress);
                    
                    const isOracle = await isFraudOracle(walletAddress);
                    setIsUserFraudOracle(isOracle);
                } else {
                    setFraudOracleAddress(null);
                    setIsUserFraudOracle(false);
                }
            } catch (error) {
                console.error('Error loading fraud oracle info:', error);
                setIsFraudOracleActive(false);
                setFraudOracleAddress(null);
                setIsUserFraudOracle(false);
            }
        };

        loadFraudOracleInfo();
    }, [walletAddress]);

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
            
            // Show transaction notification in Blockscout
            if (hash) {
                await showTransactionToast(hash);
            }
            
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
            
            // Show transaction notification in Blockscout
            if (hash) {
                await showTransactionToast(hash);
            }
            
            // Refresh escrow data
            window.location.reload();
        } catch (error) {
            console.error('Refund failed:', error);
            message.error(error.message || 'Failed to process refund');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkFraud = async () => {
        if (!isContractAvailable()) {
            message.info('Running in demo mode - would mark fraud in production');
            return;
        }

        if (!walletClient) {
            message.error('Please connect your wallet first');
            return;
        }

        if (!isUserFraudOracle) {
            message.error('Only the fraud oracle can mark escrows as fraudulent');
            return;
        }

        setLoading(true);
        try {
            console.log('Marking fraud for escrow:', params.id);
            const hash = await markFraud(walletClient, parseInt(params.id));
            message.success('Escrow marked as fraudulent and funds refunded to buyer!');
            console.log('Transaction hash:', hash);
            
            // Show transaction notification in Blockscout
            if (hash) {
                await showTransactionToast(hash);
            }
            
            // Refresh escrow data
            window.location.reload();
        } catch (error) {
            console.error('Mark fraud failed:', error);
            message.error(error.message || 'Failed to mark fraud');
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
            // Legacy string format for mock data
            switch (status) {
                case 'active': return 'blue';
                case 'pending_release': return 'orange';
                case 'completed': return 'green';
                default: return 'default';
            }
        }
    };

    // Helper functions to determine user roles
    const isBuyer = () => {
        return walletAddress && escrowData && 
               walletAddress.toLowerCase() === escrowData.buyer.toLowerCase();
    };

    const isSeller = () => {
        return walletAddress && escrowData && 
               walletAddress.toLowerCase() === escrowData.seller.toLowerCase();
    };

    const canRelease = () => {
        return isBuyer() && escrowData && 
               (escrowData.status === EscrowStatus.Active || escrowData.status === 'active') &&
               !escrowData.fraudFlagged;
    };

    const canRefund = () => {
        return (isBuyer() || isUserFraudOracle) && escrowData && 
               (escrowData.status === EscrowStatus.Active || escrowData.status === 'active');
    };

    const canMarkFraud = () => {
        return isUserFraudOracle && escrowData && 
               (escrowData.status === EscrowStatus.Active || escrowData.status === 'active') &&
               !escrowData.fraudFlagged;
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

    // Handle loading state
    if (loading) {
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
                </div>
                <Card loading={true} style={{ minHeight: '400px' }} />
            </div>
        );
    }

    // Handle error state
    if (error) {
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
                </div>
                
                <Card>
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <ExclamationCircleOutlined 
                            style={{ fontSize: '64px', color: '#ff4d4f', marginBottom: '24px' }} 
                        />
                        <Title level={3} type="danger">Escrow #{params.id} Not Found</Title>
                        <Paragraph style={{ fontSize: '16px', marginBottom: '24px' }}>
                            {error}
                        </Paragraph>
                        
                        {error.includes('Escrow does not exist') && (
                            <Alert
                                message="Escrow ID Not Found"
                                description="This escrow ID may not exist yet, or it might have been created on a different network. Make sure you're on the correct network and the escrow ID is valid."
                                type="info"
                                showIcon
                                style={{ marginBottom: '24px', textAlign: 'left' }}
                            />
                        )}
                        
                        <Space>
                            <Button 
                                type="primary" 
                                onClick={() => router.push('/my-escrows')}
                                icon={<ArrowLeftOutlined />}
                            >
                                View My Escrows
                            </Button>
                            <Button 
                                onClick={() => router.push('/escrow')}
                                icon={<DollarOutlined />}
                            >
                                Create New Escrow
                            </Button>
                            <Button 
                                onClick={() => window.location.reload()}
                                loading={loading}
                            >
                                Retry
                            </Button>
                        </Space>
                    </div>
                </Card>
            </div>
        );
    }

    // Handle case where no data and no error (shouldn't happen, but safety check)
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
                {/* <Text code style={{ fontSize: '16px' }}>{escrowData.id}</Text> */}
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
                                <Space>
                                    <Text code>{escrowData.buyer}</Text>
                                    {isBuyer() && <Tag color="blue" size="small">You</Tag>}
                                </Space>
                            </Descriptions.Item>
                            <Descriptions.Item label="Seller">
                                <Space>
                                    <Text code>{escrowData.seller}</Text>
                                    {isSeller() && <Tag color="green" size="small">You</Tag>}
                                </Space>
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
                            {canMarkFraud() && (
                                <Button 
                                    danger 
                                    size="large" 
                                    block
                                    onClick={handleMarkFraud}
                                    loading={loading}
                                    icon={<WarningOutlined />}
                                    type="dashed"
                                >
                                    Mark as Fraud
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
                            
                            {/* Blockscout Integration Buttons */}
                            {isContractAvailable() && siteConfig.contractAddress && (
                                <Button 
                                    size="large" 
                                    block
                                    onClick={() => showContractTransactions(siteConfig.contractAddress)}
                                    icon={<HistoryOutlined />}
                                    type="dashed"
                                >
                                    Contract Transactions
                                </Button>
                            )}
                            
                            <Button 
                                size="large" 
                                block
                                onClick={() => showTokenTransactions(PYUSD_TOKEN_ADDRESS)}
                                icon={<LinkOutlined />}
                                type="dashed"
                            >
                                PYUSD Transactions
                            </Button>
                            
                            {walletAddress && (
                                <Button 
                                    size="large" 
                                    block
                                    onClick={() => showAddressTransactions(walletAddress)}
                                    icon={<UserOutlined />}
                                    type="dashed"
                                >
                                    My Transactions
                                </Button>
                            )}
                        </Space>
                    </Card>

                    <Card title="Fraud Protection" size="small">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <SafetyCertificateTwoTone 
                                    twoToneColor={isFraudOracleActive ? "#52c41a" : "#d9d9d9"} 
                                    style={{ fontSize: '16px' }} 
                                />
                                <Text>
                                    {isFraudOracleActive ? 'Oracle monitoring active' : 'No fraud oracle configured'}
                                </Text>
                                {isUserFraudOracle && (
                                    <Tag color="blue" size="small">You are the fraud oracle</Tag>
                                )}
                            </div>
                            {isFraudOracleActive && fraudOracleAddress && (
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    Fraud oracle: <Text code>{fraudOracleAddress.slice(0, 6)}...{fraudOracleAddress.slice(-4)}</Text>
                                </Text>
                            )}
                            {!isFraudOracleActive && (
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    Contract owner has not configured a fraud oracle. Fraud protection disabled.
                                </Text>
                            )}
                            {isFraudOracleActive && (
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    Automatic refund if fraud detected
                                </Text>
                            )}
                            {escrowData.fraudFlagged && (
                                <Alert
                                    message="Fraud Detected"
                                    description="This escrow has been flagged as fraudulent by the oracle"
                                    type="error"
                                    showIcon
                                    size="small"
                                />
                            )}
                        </Space>
                    </Card>
                </div>
            </div>
        </div>
    );
}