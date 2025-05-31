import React from 'react';

interface ErrorBoundaryProps {
    fallback: string;
    children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
    state = {hasError: false};

    static getDerivedStateFromError() {
        return {hasError: true};
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <div>{this.props.fallback}</div>;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;