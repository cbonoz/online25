'use client';

import React, { useState, useEffect } from 'react';
import { 
    Card, 
    Typography, 
    Button, 
    Space, 
    Divider,
    message,
    Statistic,
    Row,
    Col,
    Modal
} from 'antd';
import { 
    DollarOutlined,
    ShareAltOutlined,
    SettingOutlined,
    WalletOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    UserOutlined
} from '@ant-design/icons';
import { 
    completeOffer, 
    withdrawFunds, 
    getContractBalance,
    getOfferRequests,
    approveOfferRequest,
    rejectOfferRequest,
    deactivateOffer
} from '../../util/appContractViem';
import { useWalletClient } from '../../hooks/useWalletClient';

const { Title, Text, Paragraph } = Typography;

function OwnerActionsCard({ offerData, onUpdate }) {
    if (!offerData) return null;
    const walletClient = useWalletClient();
    const [loadingComplete, setLoadingComplete] = useState(false);
    const [loadingDeactivate, setLoadingDeactivate] = useState(false);
    const [loadingReject, setLoadingReject] = useState(null); // clientAddress or null
    const [loading, setLoading] = useState(false); // For Withdraw Funds and general actions
    const [contractBalance, setContractBalance] = useState('0');
    const [offerRequests, setOfferRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [modal, setModal] = useState({ open: false, title: '', content: '', tx: '' });
    const [canCheckStatus, setCanCheckStatus] = useState(false);
    const [refreshTimeout, setRefreshTimeout] = useState(null);

    // Fetch contract balance and offer requests only once on mount or when explicitly refreshed
    const [refreshKey, setRefreshKey] = useState(0);
    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            if (!walletClient || !offerData?.contractAddress) return;
            try {
                setLoadingRequests(true);
                const [balance, requests] = await Promise.all([
                    getContractBalance(walletClient, offerData.contractAddress),
                    getOfferRequests(walletClient, offerData.contractAddress)
                ]);
                if (!isMounted) return;
                setContractBalance(balance);
                setOfferRequests(requests);
                setLoadingRequests(false);
            } catch (error) {
                if (isMounted) {
                    console.error('Error fetching data:', error);
                    setLoadingRequests(false);
                }
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, [refreshKey]);

    // Call this to manually refresh data after actions
    const refreshData = () => setRefreshKey(k => k + 1);

    // No approve action; replaced by mark complete at the offer level

    const handleRejectRequest = async (clientAddress) => {
        if (!walletClient) {
            message.error('Please connect your wallet');
            return;
        }
        try {
            setLoadingReject(clientAddress);
            const tx = await rejectOfferRequest(walletClient, offerData.contractAddress, clientAddress);
            setModal({
                open: true,
                title: 'Offer Rejected',
                content: 'Offer request rejected. Funds can now be withdrawn by the requester.\n\nThis action is being confirmed on-chain. This may take a few minutes. You can check the status now or wait for an automatic refresh.',
                tx: tx || ''
            });
            setCanCheckStatus(true);
            if (refreshTimeout) clearTimeout(refreshTimeout);
            const timeout = setTimeout(() => {
                setCanCheckStatus(false);
                if (onUpdate) onUpdate();
                refreshData();
            }, 10000);
            setRefreshTimeout(timeout);
        } catch (error) {
            console.error('Error rejecting request:', error);
            message.error(`Failed to reject request: ${error.message}`);
        } finally {
            // loadingReject will be reset after modal closes
        }
    };

    const handleCompleteOffer = async () => {
        if (!walletClient) {
            message.error('Please connect your wallet');
            return;
        }
        try {
            setLoadingComplete(true);
            const tx = await completeOffer(walletClient, offerData.contractAddress);
            setModal({
                open: true,
                title: 'Offer Marked as Completed',
                content: 'Offer marked as completed successfully!\n\nThis action is being confirmed on-chain. This may take a few minutes. You can check the status now or wait for an automatic refresh.',
                tx: tx || ''
            });
            setCanCheckStatus(true);
            if (refreshTimeout) clearTimeout(refreshTimeout);
            const timeout = setTimeout(() => {
                setCanCheckStatus(false);
                if (onUpdate) onUpdate();
                refreshData();
            }, 10000);
            setRefreshTimeout(timeout);
        } catch (error) {
            console.error('Error completing offer:', error);
            message.error(`Failed to complete offer: ${error.message}`);
        } finally {
            // loadingComplete will be reset after modal closes
        }
    };
    const handleModalClose = () => {
        setModal({ open: false, title: '', content: '', tx: '' });
        setLoadingComplete(false);
        setLoadingReject(null);
        setCanCheckStatus(false);
        if (refreshTimeout) clearTimeout(refreshTimeout);
    };

    const handleWithdrawFunds = async () => {
        if (!walletClient) {
            message.error('Please connect your wallet');
            return;
        }

        if (!offerData.isCompleted) {
            message.warning('You can only withdraw funds after completing the offer');
            return;
        }

        try {
            setLoading(true);
            await withdrawFunds(walletClient, offerData.contractAddress);
            message.success('Funds withdrawn successfully!');
            if (onUpdate) onUpdate();
            refreshData();
        } catch (error) {
            console.error('Error withdrawing funds:', error);
            message.error(`Failed to withdraw funds: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleShareOffer = () => {
        const offerUrl = `${window.location.origin}/offer/${offerData.contractAddress}`;
        navigator.clipboard.writeText(offerUrl);
        message.success('Offer link copied to clipboard!');
    };

    const handleDeactivateOffer = async () => {
        if (!walletClient) {
            message.error('Please connect your wallet first');
            return;
        }
        setLoadingDeactivate(true);
        try {
            await deactivateOffer(walletClient, offerData.contractAddress);
            message.success('Offer deactivated successfully! No new clients can request this offer.');
            if (onUpdate) onUpdate();
            refreshData();
        } catch (error) {
            console.error('Error deactivating offer:', error);
            message.error(`Failed to deactivate offer: ${error.message}`);
        } finally {
            setLoadingDeactivate(false);
        }
    };

    // Helper function to get status info
    const getStatusInfo = () => {
        if (!offerData.isAccepted) {
            return { text: 'Waiting for client requests', color: 'orange' };
        } else if (offerData.isAccepted && !offerData.isFunded) {
            return { text: 'Accepted - waiting for payment', color: 'blue' };
        } else if (offerData.isFunded && !offerData.isCompleted) {
            return { text: 'Funded - complete the work', color: 'green' };
        } else if (offerData.isCompleted) {
            return { text: 'Work completed - ready to withdraw', color: 'purple' };
        } else {
            return { text: 'In progress', color: 'green' };
        }
    };

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (refreshTimeout) clearTimeout(refreshTimeout);
        };
    }, [refreshTimeout]);

    const statusInfo = getStatusInfo();

    return (
        <Card 
            title={
                <Space>
                    <SettingOutlined />
                    Manage Offers
                </Space>
            } 
            style={{ position: 'sticky', top: '24px' }}
        >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                {/* Deactivated Status Warning */}
                {!offerData.isActive && (
                    <div style={{ 
                        padding: '12px', 
                        backgroundColor: '#fff2f0', 
                        borderRadius: '6px', 
                        textAlign: 'center',
                        border: '1px solid #ffccc7'
                    }}>
                        <Text strong style={{ color: '#ff4d4f', fontSize: '14px' }}>
                            ⚠️ This offer is deactivated - no new clients can request it
                        </Text>
                    </div>
                )}

                {/* Contract Status */}
                <div style={{ textAlign: 'center' }}>
                    <Title level={3} style={{ color: '#ec348b', margin: 0 }}>
                        Offer & Requests
                    </Title>
                    <Paragraph type="secondary">
                        Status: <Text strong style={{ color: statusInfo.color }}>{statusInfo.text}</Text>
                    </Paragraph>
                </div>

                {/* Contract Balance */}
                <div style={{ textAlign: 'center' }}>
                    <Title level={4} style={{ margin: 0 }}>
                        Contract Balance: <Text strong style={{ fontSize: '18px' }}>{contractBalance} PYUSD</Text>
                    </Title>
                </div>

                <Divider />
                <Modal
                    open={modal.open}
                    title={modal.title}
                    onCancel={handleModalClose}
                    footer={null}
                >
                    <p style={{ whiteSpace: 'pre-line' }}>{modal.content}</p>
                    {modal.tx && (
                        <div style={{ marginTop: 12 }}>
                            <span style={{ fontSize: 12, color: '#888' }}>Tx Hash:</span>
                            <div style={{ wordBreak: 'break-all', fontSize: 13 }}>{typeof modal.tx === 'string' ? modal.tx : JSON.stringify(modal.tx)}</div>
                        </div>
                    )}
                    <div style={{ marginTop: 16, textAlign: 'center' }}>
                        {canCheckStatus ? (
                            <Button 
                                type="primary" 
                                size="large" 
                                style={{ marginTop: 12 }}
                                onClick={() => {
                                    setCanCheckStatus(false);
                                    if (refreshTimeout) clearTimeout(refreshTimeout);
                                    if (onUpdate) onUpdate();
                                    refreshData();
                                }}
                            >
                                Check Status
                            </Button>
                        ) : (
                            <Button 
                                type="primary" 
                                size="large" 
                                style={{ marginTop: 12 }}
                                onClick={handleModalClose}
                            >
                                Close
                            </Button>
                        )}
                    </div>


                </Modal>

                {/* Offer Requests */}
                <div>
                    <Title level={4} style={{ margin: 0, marginBottom: '12px' }}>
                        <UserOutlined style={{ marginRight: '8px' }} />
                        Offer Requests ({offerRequests.length})
                    </Title>
                    
                    {loadingRequests ? (
                        <Text type="secondary">Loading requests...</Text>
                    ) : offerRequests.length === 0 ? (
                        <div style={{ 
                            padding: '16px', 
                            backgroundColor: '#f6f6f6', 
                            borderRadius: '6px', 
                            textAlign: 'center' 
                        }}>
                            <Text type="secondary">No requests yet</Text>
                        </div>
                    ) : (
                        <Space direction="vertical" style={{ width: '100%' }} size="small">
                            {offerRequests.map((request, index) => (
                                <Card 
                                    key={request.clientAddress} 
                                    size="small" 
                                    style={{ backgroundColor: '#fafafa', maxWidth: 480, margin: '0 auto 16px auto' }}
                                    title={
                                        <Text strong>
                                            Request #{index + 1}
                                        </Text>
                                    }
                                    extra={
                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                            {request.requestedAt}
                                        </Text>
                                    }
                                >
                                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                                        <div>
                                            <Text strong>Client: </Text>
                                            <Text code style={{ fontSize: '11px' }}>
                                                {request.clientAddress.slice(0, 8)}...{request.clientAddress.slice(-6)}
                                            </Text>
                                        </div>
                                        
                                        <div>
                                            <Text strong>Message: </Text>
                                            <Paragraph style={{ margin: 0, marginTop: '4px' }}>
                                                {request.message}
                                            </Paragraph>
                                        </div>


                                        {/* Show Mark as Completed only for the accepted client if offer is completed */}
                                        {offerData.isCompleted && offerData.client && request.clientAddress &&
                                            request.clientAddress.toLowerCase() === offerData.client.toLowerCase() ? (
                                            <div style={{ 
                                                padding: '6px 12px', 
                                                backgroundColor: '#f6ffed', 
                                                borderRadius: '4px', 
                                                marginTop: '8px' 
                                            }}>
                                                <Text style={{ color: '#52c41a', fontSize: '12px' }}>
                                                    ✅ Marked Complete
                                                </Text>
                                            </div>
                                        ) :
                                        // Only show actions if not rejected and not completed
                                        (!request.isRejected && (!offerData.isCompleted || !offerData.client || request.clientAddress.toLowerCase() !== offerData.client.toLowerCase())) && (
                                            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <Button 
                                                    type="primary"
                                                    size="small"
                                                    icon={<CheckCircleOutlined />}
                                                    onClick={handleCompleteOffer}
                                                    loading={loadingComplete}
                                                    disabled={loadingComplete || loadingDeactivate || loadingReject}
                                                    style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', width: '100%' }}
                                                >
                                                    Mark as Completed
                                                </Button>
                                                <Button 
                                                    danger
                                                    size="small"
                                                    icon={<CloseCircleOutlined />}
                                                    onClick={() => handleRejectRequest(request.clientAddress)}
                                                    loading={loadingReject === request.clientAddress}
                                                    disabled={loadingReject === request.clientAddress || loadingComplete || loadingDeactivate}
                                                    style={{ width: '100%' }}
                                                >
                                                    Reject (Refund Client)
                                                </Button>
                                            </div>
                                        )}

                                        {request.isRejected && (
                                            <div style={{ 
                                                padding: '6px 12px', 
                                                backgroundColor: '#fff2f0', 
                                                borderRadius: '4px', 
                                                marginTop: '8px' 
                                            }}>
                                                <Text style={{ color: '#ff4d4f', fontSize: '12px' }}>
                                                    ❌ Rejected
                                                </Text>
                                            </div>
                                        )}
                                    </Space>
                                </Card>
                            ))}
                        </Space>
                    )}
                </div>

                <Divider />


                {/* Removed quick stats for Accepted, Funded, Completed as requested */}
                <Divider />

                {/* Action Buttons */}
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Button 
                        type="primary" 
                        size="large" 
                        icon={<ShareAltOutlined />}
                        onClick={handleShareOffer}
                        style={{ minWidth: 160 }}
                    >
                        Share Offer Link
                    </Button>

                    {/* Deactivate Offer Button - only show for active offers that haven't been accepted */}
                    {offerData.isActive && !offerData.isAccepted && (
                        <Button 
                            type="default"
                            size="large" 
                            icon={<CloseCircleOutlined />}
                            onClick={handleDeactivateOffer}
                            loading={loadingDeactivate}
                            disabled={loadingDeactivate || loadingComplete || loadingReject}
                            danger
                            style={{ minWidth: 160 }}
                        >
                            Deactivate Offer
                        </Button>
                    )}

                    {/* Mark as Completed now handled per request card */}

                    {offerData.isCompleted && parseFloat(contractBalance) > 0 && (
                        <Button 
                            size="large" 
                            icon={<WalletOutlined />}
                            onClick={handleWithdrawFunds}
                            loading={loading}
                            style={{ backgroundColor: '#722ed1', borderColor: '#722ed1', color: 'white', minWidth: 180 }}
                        >
                            Withdraw Funds ({contractBalance} PYUSD)
                        </Button>
                    )}

                    {!offerData.isAccepted && (
                        <div style={{ padding: '16px', backgroundColor: '#f6f6f6', borderRadius: '6px', textAlign: 'center' }}>
                            <Text type="secondary">
                                Waiting for client requests. Share the link to get started!
                            </Text>
                        </div>
                    )}

                    {offerData.isAccepted && !offerData.isFunded && (
                        <div style={{ padding: '16px', backgroundColor: '#e6f7ff', borderRadius: '6px', textAlign: 'center' }}>
                            <Text style={{ color: '#1890ff' }}>
                                ✅ Offer accepted! Waiting for client payment.
                            </Text>
                        </div>
                    )}

                    {offerData.isFunded && !offerData.isCompleted && (
                        <div style={{ padding: '16px', backgroundColor: '#f6ffed', borderRadius: '6px', textAlign: 'center' }}>
                            <Text style={{ color: '#52c41a' }}>
                                💰 Payment received! Complete the work and mark as finished to withdraw payment.
                            </Text>
                        </div>
                    )}
                </Space>

                <Divider />

                <div style={{ textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        Simplified workflow: Client requests → You mark complete or reject (refund) → Withdraw funds
                    </Text>
                </div>
            </Space>
        </Card>
    );
}
export default OwnerActionsCard;
