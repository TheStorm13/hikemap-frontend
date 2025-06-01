// pages/ErrorPage.tsx
//@ts-ignore
import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-4xl font-bold text-red-600">Что-то пошло не так</h1>
            <p className="mt-4 text-lg">Попробуйте перезагрузить страницу или вернуться назад.</p>
            <button
                onClick={() => navigate("/")}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                На главную
            </button>
        </div>
    );
};

export default ErrorPage;
