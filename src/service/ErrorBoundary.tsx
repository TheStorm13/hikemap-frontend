// components/ErrorBoundary.tsx
//@ts-ignore
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        // Здесь можно логировать ошибку в систему мониторинга
    }

    render() {
        if (this.state.hasError) {
            return <Navigate to="/error" replace />;
        }

        return this.props.children;
    }
}
