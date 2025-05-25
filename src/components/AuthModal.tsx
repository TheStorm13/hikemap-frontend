import React, {useEffect, useState} from 'react';
import {Button, Form, Input, message, Modal, Tabs, Typography} from 'antd';
import {LockOutlined, MailOutlined, UserOutlined} from '@ant-design/icons';
import {useAuth} from '../service/auth/AuthContext';

const {TabPane} = Tabs;
const {Text} = Typography;

interface AuthModalProps {
    visible: boolean;
    onClose: () => void;
    onLoginSuccess?: () => void;
    defaultActiveTab?: 'login' | 'register';
    loading?: boolean;
    error?: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
                                                        visible,
                                                        onClose,
                                                        onLoginSuccess,
                                                        defaultActiveTab = 'login',
                                                        loading: propLoading = false,
                                                        error: propError = null,
                                                    }) => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultActiveTab);
    const [form] = Form.useForm();
    const [internalLoading, setInternalLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {login, register} = useAuth();

    const loading = propLoading || internalLoading;
    const displayError = propError || error;

    useEffect(() => {
        if (!visible) {
            // Reset form and state when modal closes
            form.resetFields();
            setError(null);
        } else {
            // Reset to default tab when modal opens
            setActiveTab(defaultActiveTab);
        }
    }, [visible, defaultActiveTab, form]);

    useEffect(() => {
        if (displayError) {
            message.error(displayError);
        }
    }, [displayError]);

    const handleTabChange = (key: string) => {
        setActiveTab(key as 'login' | 'register');
        form.resetFields();
        setError(null);
    };

    const handleSubmit = async (values: any) => {
        try {
            setInternalLoading(true);
            setError(null);

            if (activeTab === 'login') {
                await login(values.email, values.password);
                message.success('Login successful!');
                onLoginSuccess?.();
                onClose();
            } else {
                await register(values.username, values.email, values.password);
                message.success('Registration successful! Please log in.');
                setActiveTab('login');
                form.resetFields(['email', 'password']);
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
            setError(errorMessage);
            console.error('Authentication error:', err);
        } finally {
            setInternalLoading(false);
        }
    };

    return (
        <Modal
            title="Authentication"
            open={visible}
            onCancel={onClose}
            footer={null}
            destroyOnHidden
            width={400}
            centered
            maskClosable={!loading}
            keyboard={!loading}
        >
            <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                centered
                animated
                tabBarStyle={{marginBottom: 24}}
            >
                <TabPane tab="Login" key="login" disabled={loading}>
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        layout="vertical"
                        initialValues={{remember: true}}
                    >
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {required: true, message: 'Please enter your email'},
                                {type: 'email', message: 'Please enter a valid email'},
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined/>}
                                placeholder="Email"
                                autoComplete="email"
                                disabled={loading}
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                {required: true, message: 'Please enter your password'},
                                {min: 6, message: 'Password must be at least 6 characters'},
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined/>}
                                placeholder="Password"
                                autoComplete="current-password"
                                disabled={loading}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                                size="large"
                            >
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </TabPane>

                <TabPane tab="Register" key="register" disabled={loading}>
                    <Form form={form} onFinish={handleSubmit} layout="vertical">
                        <Form.Item
                            name="username"
                            label="Username"
                            rules={[
                                {required: true, message: 'Please choose a username'},
                                {min: 3, message: 'Username must be at least 3 characters'},
                                {max: 20, message: 'Username cannot exceed 20 characters'},
                                {
                                    pattern: /^[a-zA-Z0-9_]+$/,
                                    message: 'Only letters, numbers and underscores',
                                },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined/>}
                                placeholder="Username"
                                autoComplete="username"
                                disabled={loading}
                            />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {required: true, message: 'Please enter your email'},
                                {type: 'email', message: 'Please enter a valid email'},
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined/>}
                                placeholder="Email"
                                autoComplete="email"
                                disabled={loading}
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                {required: true, message: 'Please enter a password'},
                                {min: 6, message: 'Minimum 6 characters'},
                            ]}
                            hasFeedback
                        >
                            <Input.Password
                                prefix={<LockOutlined/>}
                                placeholder="Password"
                                autoComplete="new-password"
                                disabled={loading}
                            />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            label="Confirm Password"
                            dependencies={['password']}
                            rules={[
                                {required: true, message: 'Please confirm your password'},
                                ({getFieldValue}) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords do not match'));
                                    },
                                }),
                            ]}
                            hasFeedback
                        >
                            <Input.Password
                                prefix={<LockOutlined/>}
                                placeholder="Confirm Password"
                                disabled={loading}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                                size="large"
                            >
                                Register
                            </Button>
                        </Form.Item>
                    </Form>
                </TabPane>
            </Tabs>
            {displayError && (
                <Text type="danger" style={{display: 'block', textAlign: 'center'}}>
                    {displayError}
                </Text>
            )}
        </Modal>
    );
};