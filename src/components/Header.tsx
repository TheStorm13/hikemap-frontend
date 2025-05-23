import { Layout, Button, Space, Typography } from 'antd';
import { UserOutlined, LoginOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

export const Header = () => {
    return (
        <AntHeader style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#fff', // Белый фон
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // Тень
            padding: '0 16px', // Отступы
        }}>
            {/* Логотип / Название сайта */}
            <Title level={4} style={{ margin: 0 }}>
                Карта маршрутов HikeMap
            </Title>

            {/* Кнопки справа */}
            <Space>
                <Button type="text" icon={<UserOutlined />}>
                    Регистрация
                </Button>
                <Button type="primary" icon={<LoginOutlined />}>
                    Войти
                </Button>
            </Space>
        </AntHeader>
    );
};