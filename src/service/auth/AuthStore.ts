import {AuthAction, AuthState, AuthStatus} from '../../types/auth/authTypes';

export class AuthStore {
    private static instance: AuthStore;
    private state: AuthState;
    private listeners: Array<(state: AuthState) => void> = [];

    private constructor(initialState: AuthState) {
        this.state = initialState;
    }

    public static getInstance(): AuthStore {
        if (!AuthStore.instance) {
            AuthStore.instance = new AuthStore({
                status: AuthStatus.IDLE,
                user: null,
                error: null,
            });
        }
        return AuthStore.instance;
    }

    public getState(): AuthState {
        return this.state;
    }

    public dispatch(action: AuthAction): void {
        this.state = this.reduce(this.state, action);
        this.notifyListeners();
    }

    private reduce(state: AuthState, action: AuthAction): AuthState {
        switch (action.type) {
            case 'INITIALIZED':
                return {...state, status: AuthStatus.IDLE};
            case 'LOADING':
                return {...state, status: AuthStatus.LOADING, error: null};
            case 'LOGIN_SUCCESS':
                return {status: AuthStatus.AUTHENTICATED, user: action.payload, error: null};
            case 'LOGIN_FAILURE':
                return {status: AuthStatus.UNAUTHENTICATED, user: null, error: action.error};
            case 'LOGOUT':
                return {status: AuthStatus.UNAUTHENTICATED, user: null, error: null};
            case 'SET_ERROR':
                return {...state, error: action.error};
            default:
                return state;
        }
    }

    public subscribe(listener: (state: AuthState) => void): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.state));
    }
}