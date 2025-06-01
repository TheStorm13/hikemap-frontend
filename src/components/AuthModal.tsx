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
                message.success('Успешный вход!');
                onLoginSuccess?.();
                onClose();
            } else {
                await register(values.username, values.email, values.password);
                message.success('Регистрация прошла успешно!');
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
            title="Авторизация"
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
                <TabPane tab="Войти" key="login" disabled={loading}>
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        layout="vertical"
                        initialValues={{remember: true}}
                    >
                        <Form.Item
                            name="email"
                            label="Почта"
                            rules={[
                                {required: true, message: 'Введите вашу почту'},
                                {type: 'email', message: 'Введите корректный почту'},
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined/>}
                                placeholder="Почта"
                                autoComplete="email"
                                disabled={loading}
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Пароль"
                            rules={[
                                {required: true, message: 'Пожалуйста, введите пароль'},
                                {min: 6, message: 'Минимум 6 символов'},
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined/>}
                                placeholder="Пароль"
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
                                Войти
                            </Button>
                        </Form.Item>
                    </Form>
                </TabPane>

                <TabPane tab="Регистрация" key="register" disabled={loading}>
                    <Form form={form} onFinish={handleSubmit} layout="vertical">
                        <Form.Item
                            name="username"
                            label="Имя пользователя"
                            rules={[
                                {required: true, message: 'Пожалуйста, введите имя пользователя'},
                                {min: 3, message: 'Имя пользователя должно быть минимум 3 символа'},
                                {max: 100, message: 'Имя пользователя не может превышать 100 символов'},
                                {
                                    pattern: /^[a-zA-Z0-9_]+$/,
                                    message: 'Имя пользователя может содержать только буквы, цифры и подчеркивания',
                                },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined/>}
                                placeholder="Имя пользователя"
                                autoComplete="username"
                                disabled={loading}
                            />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Почта"
                            rules={[
                                {required: true, message: 'Пожалуйста, введите почту'},
                                {type: 'email', message: 'Введите корректный почту'},
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined/>}
                                placeholder="Почта"
                                autoComplete="email"
                                disabled={loading}
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Пароль"
                            rules={[
                                {required: true, message: 'Пожалуйста, введите пароль'},
                                {min: 6, message: 'Минимум 6 символов'},
                            ]}
                            hasFeedback
                        >
                            <Input.Password
                                prefix={<LockOutlined/>}
                                placeholder="Пароль"
                                autoComplete="new-password"
                                disabled={loading}
                            />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            label="Подтверждение пароля"
                            dependencies={['password']}
                            rules={[
                                {required: true, message: 'Пожалуйста, подтвердите пароль'},
                                ({getFieldValue}) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Пароли не совпадают'));
                                    },
                                }),
                            ]}
                            hasFeedback
                        >
                            <Input.Password
                                prefix={<LockOutlined/>}
                                placeholder="Подтверждение пароля"
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
                                Зарегистрироваться
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