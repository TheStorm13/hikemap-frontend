import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage.tsx';
import ErrorPage from "./pages/ErrorPage.tsx";

const App: React.FC = () => {

    useEffect(() => {
        document.body.style.overflow = 'hidden'; // Отключение прокрутки страницы
        return () => {
            document.body.style.overflow = ''; // Восстановление прокрутки при размонтировании
        };
    }, []);
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/error" element={<ErrorPage />} />
            </Routes>
        </Router>
    );
};

export default App;