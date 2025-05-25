import {TokenService} from './TokenService';
import {AuthValidator} from './AuthValidator';
import {AuthStore} from './AuthStore';
import {AuthApi} from '../../api/AuthApi';
import {AuthState} from '../../types/auth/authTypes';


export class AuthService {
    private static instance: AuthService;
    private authStore = AuthStore.getInstance();

    private constructor() {
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    public async checkAuth(): Promise<void> {
        this.authStore.dispatch({type: 'LOADING'});

        try {
            const accessToken = TokenService.getAccessToken();
            const refreshToken = TokenService.getRefreshToken();

            if (!accessToken || !refreshToken) {
                this.authStore.dispatch({type: 'LOGOUT'});
                return;
            }

            if (AuthValidator.validateToken(accessToken)) {
                const user = AuthValidator.decodeToken(accessToken);
                if (user) {
                    this.authStore.dispatch({type: 'LOGIN_SUCCESS', payload: user});
                    return;
                }
            }

            await this.refreshToken(refreshToken);
        } catch (error) {
            console.error('Auth check failed:', error);
            this.authStore.dispatch({type: 'LOGIN_FAILURE', error: 'Failed to authenticate'});
        }
    }

    private async refreshToken(refreshToken: string): Promise<void> {
        try {
            const {accessToken: newAccessToken} = await AuthApi.refresh(refreshToken);
            TokenService.setTokens(newAccessToken, refreshToken);
            const user = AuthValidator.decodeToken(newAccessToken);
            if (user) {
                this.authStore.dispatch({type: 'LOGIN_SUCCESS', payload: user});
            } else {
                throw new Error('Invalid token after refresh');
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            TokenService.clearTokens();
            this.authStore.dispatch({type: 'LOGOUT'});
        }
    }

    public async login(email: string, password: string): Promise<void> {
        this.authStore.dispatch({type: 'LOADING'});

        try {
            const {accessToken, refreshToken} = await AuthApi.login(email, password);
            TokenService.setTokens(accessToken, refreshToken);
            const user = AuthValidator.decodeToken(accessToken);
            if (user) {
                this.authStore.dispatch({type: 'LOGIN_SUCCESS', payload: user});
            } else {
                throw new Error('Invalid token received');
            }
        } catch (error) {
            console.error('Login failed:', error);
            TokenService.clearTokens();
            this.authStore.dispatch({type: 'LOGIN_FAILURE', error: 'Login failed'});
            throw error;
        }
    }

    public async register(username: string, email: string, password: string): Promise<void> {
        this.authStore.dispatch({type: 'LOADING'});

        try {
            await AuthApi.register({username, email, password});
            await this.login(email, password);
        } catch (error) {
            console.error('Registration failed:', error);
            this.authStore.dispatch({type: 'LOGIN_FAILURE', error: 'Registration failed'});
            throw error;
        }
    }

    public async logout(): Promise<void> {
        try {
            this.authStore.dispatch({type: 'LOADING'});
            await AuthApi.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            TokenService.clearTokens();
            this.authStore.dispatch({type: 'LOGOUT'});
        }
    }

    public getAuthState(): AuthState {
        return this.authStore.getState();
    }

    public subscribe(listener: (state: AuthState) => void): () => void {
        return this.authStore.subscribe(listener);
    }
}