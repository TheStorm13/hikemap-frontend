import {jwtDecode} from 'jwt-decode';
import {JwtPayload} from '../../types/auth/authTypes';

export class AuthValidator {
    static validateToken(token: string): boolean {
        if (!token) return false;

        try {
            const {exp} = jwtDecode<JwtPayload>(token);
            return exp ? exp * 1000 > Date.now() : false;
        } catch (error) {
            console.error('Token validation failed:', error);
            return false;
        }
    }

    static decodeToken(token: string): JwtPayload | null {
        try {
            return jwtDecode<JwtPayload>(token);
        } catch (error) {
            console.error('Token decoding failed:', error);
            return null;
        }
    }
}