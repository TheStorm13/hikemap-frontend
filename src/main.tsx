import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
//@ts-ignore
import './index.css'
import {AuthProvider} from "./service/auth/AuthContext.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <App/>
        </AuthProvider>
    </StrictMode>,
)
