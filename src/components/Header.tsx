import {Avatar, Button, Dropdown, Layout, MenuProps, Space, theme, Typography} from 'antd';
import {LoginOutlined, LogoutOutlined, SettingOutlined, UserOutlined} from '@ant-design/icons';
import {useState} from 'react';
import {AuthModal} from './AuthModal';
import {useAuth} from '../service/auth/AuthContext';
import {useNavigate} from 'react-router-dom';

const {Header: AntHeader} = Layout;
const {Title, Text} = Typography;

export const Header = () => {
    const [authModalVisible, setAuthModalVisible] = useState(false);
    const [activeAuthTab, setActiveAuthTab] = useState<'login' | 'register'>('login');
    const {state, logout} = useAuth();
    const {token: {colorBgContainer, boxShadow}} = theme.useToken();
    const navigate = useNavigate();

    const isAuthenticated = state.status === 'authenticated';
    const user = state.user;

    const handleAuthSuccess = () => {
        setAuthModalVisible(false);
    };

    const showAuthModal = (tab: 'login' | 'register') => {
        setActiveAuthTab(tab);
        setAuthModalVisible(true);
    };

    const handleLogout = async () => {
        try {
            await logout();
            // Optional: Redirect after logout
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <UserOutlined/>,
            label: 'Profile',
            onClick: () => navigate('/profile'),
        },
        {
            key: 'settings',
            icon: <SettingOutlined/>,
            label: 'Settings',
            onClick: () => navigate('/settings'),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined/>,
            label: 'Logout',
            onClick: handleLogout,
            danger: true,
        },
    ];

    return (
        <>
            <AntHeader
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: colorBgContainer,
                    boxShadow,
                    padding: '0 24px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    height: '64px',
                }}
            >
                <Space>
                    <Title level={4} style={{margin: 0, fontWeight: 600, cursor: 'pointer'}}
                           onClick={() => navigate('/')}>
                        HikeMap Route Map
                    </Title>
                </Space>

                <Space size="middle">
                    {state.status === 'loading' ? (
                        <Button type="text" loading/>
                    ) : isAuthenticated ? (
                        <Dropdown menu={{items: userMenuItems}} trigger={['click']} placement="bottomRight">
                            <Space style={{cursor: 'pointer'}}>
                                <Avatar
                                    size="small"
                                    icon={<UserOutlined/>}
                                    style={{backgroundColor: '#87d068'}}
                                />
                                {user?.username && (
                                    <Text strong style={{marginLeft: 8}}>
                                        {user.username}
                                    </Text>
                                )}
                            </Space>
                        </Dropdown>
                    ) : (
                        <>
                            <Button
                                type="text"
                                icon={<UserOutlined/>}
                                onClick={() => showAuthModal('register')}
                            >
                                Register
                            </Button>
                            <Button
                                type="primary"
                                icon={<LoginOutlined/>}
                                onClick={() => showAuthModal('login')}
                            >
                                Login
                            </Button>
                        </>
                    )}
                </Space>
            </AntHeader>

            <AuthModal
                visible={authModalVisible}
                onClose={() => setAuthModalVisible(false)}
                onLoginSuccess={handleAuthSuccess}
                defaultActiveTab={activeAuthTab}
                loading={state.status === 'loading'}
                error={state.error}
            />
        </>
    );
};