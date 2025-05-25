export type JwtPayload = {
    sub: string; // User ID
    exp: number; // Expiration timestamp
    iat: number; // Issued at timestamp
    [key: string]: any; // Additional claims
};

export const AuthStatus = {
    IDLE: 'idle',
    LOADING: 'loading',
    AUTHENTICATED: 'authenticated',
    UNAUTHENTICATED: 'unauthenticated',
} as const;

export type AuthStatusType = typeof AuthStatus[keyof typeof AuthStatus];

export type AuthState = {
    status: AuthStatusType;
    user: JwtPayload | null;
    error: string | null;
};

export type AuthAction =
    | { type: 'INITIALIZED' }
    | { type: 'LOADING' }
    | { type: 'LOGIN_SUCCESS'; payload: JwtPayload }
    | { type: 'LOGIN_FAILURE'; error: string }
    | { type: 'LOGOUT' }
    | { type: 'SET_ERROR'; error: string };