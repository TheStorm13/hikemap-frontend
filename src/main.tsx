import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
//@ts-ignore
import './index.css'
import {AuthProvider} from "./service/auth/AuthContext.tsx";
import {ErrorBoundary} from "./service/ErrorBoundary.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary>
            <AuthProvider>
                <App/>
            </AuthProvider>
        </ErrorBoundary>
    </StrictMode>,
)
