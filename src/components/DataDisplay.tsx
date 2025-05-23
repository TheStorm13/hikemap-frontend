import React from 'react';
import {ApiResponse} from '../api/fetchData';
import {Card, Empty} from 'antd';

interface DataDisplayProps {
    data: ApiResponse | null;
    isLoading: boolean;
    error: string | null;
}

export const DataDisplay: React.FC<DataDisplayProps> = ({
                                                            data,
                                                            isLoading,
                                                            error
                                                        }) => {

    if (isLoading || error) return null; // Уже обработано в App.tsx

    return (
        <Card title="Результат" style={{marginTop: 16}}>
            {data ? (
                <pre style={{whiteSpace: 'pre-wrap'}}>
          {JSON.stringify(data, null, 2)}
        </pre>
            ) : (
                <Empty description="Данные не загружены"/>
            )}
        </Card>
    );
};