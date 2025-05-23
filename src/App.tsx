import React, {useState} from 'react';
import {ApiResponse, fetchData} from './api/fetchData';
import {DataDisplay} from './components/DataDisplay';
import {Alert, Button, Layout, Card, Form, Input, Spin} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import {Header} from './components/Header';

const API_URL = 'https://jsonplaceholder.typicode.com/todos/1';

const App: React.FC = () => {
    const [url, setUrl] = useState<string>(API_URL);
    const [data, setData] = useState<ApiResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await fetchData(url);
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
        } finally {
            setIsLoading(false);
        }
    };

    return (

        <Layout layout="vertical" >
            <Header/>
            <div>Left</div>
            <div>Right</div>

            <Card title="API Request Demo" style={{width: '100%', maxWidth: 800}}>
                <Form layout="vertical" onSubmitCapture={handleSubmit}>
                    <Form.Item label="API URL">
                        <Input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Введите URL API"
                            prefix={<SearchOutlined/>}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                            icon={<SearchOutlined/>}
                        >
                            Запросить
                        </Button>
                    </Form.Item>
                </Form>

                {isLoading && <Spin tip="Загрузка..." style={{display: 'block', margin: '20px 0'}}/>}
                {error && (
                    <Alert
                        message="Ошибка"
                        description={error}
                        type="error"
                        showIcon
                        style={{marginBottom: 20}}
                    />
                )}
                <DataDisplay data={data} isLoading={isLoading} error={error}/>
            </Card>
        </Layout>
    );
};

export default App;