'use client';

import { APP_DESC, APP_NAME, EXAMPLE_DATASETS, siteConfig } from '../constants';
import Logo from '../lib/Logo';
import { Button, Card, Row, Col, Divider, Space, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { CheckCircleTwoTone, RocketOutlined, CodeOutlined, SafetyCertificateTwoTone, DollarOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function About() {
    const router = useRouter();

    const features = [
        {
            icon: <SafetyCertificateTwoTone twoToneColor="#00aef2" style={{ fontSize: '24px' }} />,
            title: 'Decentralized & Trustless',
            description: 'All form submissions, offers, and payments are recorded on-chain using smart contracts. No centralized escrow or third-party platforms.'
        },
        {
            icon: <DollarOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
            title: 'Stablecoin Payments (PYUSD)',
            description: 'Accept stablecoin payments for deposits, milestones, or offers—no volatility, no banking fees.'
        },
        {
            icon: <CheckCircleTwoTone twoToneColor="#00aef2" style={{ fontSize: '24px' }} />,
            title: 'Smart Contract Automation',
            description: 'Hardhat-powered smart contracts handle form validation, offer generation, and automated payment releases.'
        },
        {
            icon: <RocketOutlined style={{ fontSize: '24px', color: '#00aef2' }} />,
            title: 'One-Click Form + Payment',
            description: 'Collect structured client info and payment in a single, seamless flow. No accounts or complex onboarding required.'
        }
    ];    

    const useCases = [
        'Freelancers and service providers collecting offers or deposits',
        'Anyone looking to simplify client onboarding and payment',
        'Agencies or consultants issuing milestone-based contracts',
        'Teams wanting full audibility of actions with on-chain payout logic'
    ];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                {/* <Logo style={{ marginBottom: '24px' }} /> */}
                <Title level={1} style={{ marginBottom: '16px', fontSize: '48px' }}>
                    About {APP_NAME}
                </Title>
                <Paragraph style={{ fontSize: '20px', color: '#666', maxWidth: '700px', margin: '0 auto 32px' }}>
                    <b>SafeSend</b> is a decentralized form + payment system for any service or service provider. Collect structured client info, generate offers, and manage payments—all on-chain, with wallet-based authentication and smart contract automation.
                </Paragraph>
                
                {/* Hackathon Notice */}
                <Card 
                    style={{ 
                        background: '#fafafa',
                        border: '1px solid #d9d9d9',
                        marginBottom: '32px'
                    }}
                >
                    <Space>
                        <CodeOutlined style={{ fontSize: '16px', color: '#8c8c8c' }} />
                        <Text style={{ color: '#595959', fontSize: '14px' }}>
                            Hackathon Prototype
                        </Text>
                    </Space>
                    <Paragraph style={{ marginTop: '8px', marginBottom: 0, color: '#8c8c8c', fontSize: '14px' }}>
                        This application is a hackathon prototype built for demonstration purposes. 
                        It is provided "as-is" without warranties. Only accept offers or submit payments to trusted recipients and businesses.
                    </Paragraph>
                </Card>

                <Button 
                    type="primary" 
                    size="large"
                    onClick={() => router.push('/create')}
                    style={{ 
                        height: '48px', 
                        padding: '0 32px', 
                        fontSize: '18px',
                        fontWeight: '600'
                    }}
                >
                    {siteConfig.cta.primary}
                </Button>
            </div>

            {/* Features Section */}
            <div style={{ marginBottom: '60px' }}>
                <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
                    Key Features
                </Title>
                <Row gutter={[32, 32]}>
                    {features.map((feature, index) => (
                        <Col key={index} xs={24} md={12}>
                            <Card style={{ height: '100%', border: '1px solid #f0f0f0' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <div style={{ 
                                        width: '48px', 
                                        height: '48px', 
                                        background: '#f8f9fa', 
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <Title level={4} style={{ marginBottom: '8px' }}>
                                            {feature.title}
                                        </Title>
                                        <Paragraph style={{ marginBottom: 0, color: '#666' }}>
                                            {feature.description}
                                        </Paragraph>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* How It Works Section */}
            <div style={{ marginBottom: '60px' }}>
                <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
                    How It Works
                </Title>
                <Row gutter={[32, 32]}>
                    <Col xs={24} md={4}></Col>
                    <Col xs={24} md={16}>
                        <ol style={{ fontSize: '18px', color: '#444', lineHeight: '2', paddingLeft: '24px' }}>
                            <li>Connect wallet via Dynamic to authenticate as client or service provider.</li>
                            <li>Client submits a service request form with payment details.</li>
                            <li>Smart contract is deployed via Hardhat; PYUSD payment is deposited.</li>
                            <li>Service provider reviews request and generates an offer.</li>
                            <li>Client approves; contract releases payment automatically.</li>
                            <li>Both parties receive confirmation and transaction records on-chain.</li>
                        </ol>
                    </Col>
                    <Col xs={24} md={4}></Col>
                </Row>
            </div>

            {/* Use Cases Section */}
            <div style={{ marginBottom: '60px' }}>
                <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
                    Perfect For
                </Title>
                <Card>
                    <Row gutter={[16, 16]}>
                        {useCases.map((useCase, index) => (
                            <Col key={index} xs={24} sm={12}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: '16px' }} />
                                    <Text>{useCase}</Text>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Card>
            </div>

            {/* Technical Details Section */}
            <div style={{ marginBottom: '60px' }}>
                <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
                    Technical Implementation
                </Title>
                <Row gutter={[32, 32]}>
                    <Col xs={24} md={12}>
                        <Card title="Core Infrastructure" style={{ height: '100%' }}>
                            <ul style={{ paddingLeft: '20px', color: '#666' }}>
                                <li>Dynamic: wallet-based authentication for clients and providers</li>
                                <li>Hardhat: smart contract development, deployment, and on-chain automation</li>
                                <li>PYUSD: stablecoin payments for deposits, milestones, and offers</li>
                                <li>Vercel: open-source hosting and deployment</li>
                            </ul>
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card title="Frontend & Integration" style={{ height: '100%' }}>
                            <ul style={{ paddingLeft: '20px', color: '#666' }}>
                                <li>Next.js React application with modern UI components</li>
                                <li>Wagmi hooks for seamless Web3 wallet integration</li>
                                <li>Ethers.js for blockchain interactions and transaction handling</li>
                                <li>Ant Design for professional, responsive user interface</li>
                            </ul>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Open Source & Future Work Section */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <Card style={{ background: '#f8f9fa' }}>
                    <Title level={3}>Open Source & Future Work</Title>
                    <Paragraph style={{ fontSize: '16px', color: '#666', marginBottom: '24px' }}>
                        {APP_NAME} is open source and built for the hackathon community. Future enhancements could include:
                        <ul style={{ textAlign: 'left', margin: '16px auto', maxWidth: '600px', color: '#666' }}>
                            <li>Recurring subscriptions or retainers (automated PYUSD payments)</li>
                            <li>Cross-chain support for broader ecosystem compatibility</li>
                            <li>Document attachment verification with decentralized storage</li>
                            <li>Multi-party escrow and milestone-based releases</li>
                            <li>Integration with fiat on-ramps for easier adoption</li>
                        </ul>
                        The complete source code, smart contracts, and documentation are available on GitHub.
                    </Paragraph>
                    <Space size="middle">
                        <Button 
                            type="default" 
                            size="large"
                            href="https://github.com/cbonoz/ethnyc25" 
                            target="_blank"
                            icon={<CodeOutlined />}
                        >
                            View Source Code
                        </Button>
                        <Button 
                            type="primary" 
                            size="large"
                            onClick={() => router.push('/create')}
                        >
                            Try the Demo
                        </Button>
                    </Space>
                </Card>
            </div>
        </div>
    );
}
