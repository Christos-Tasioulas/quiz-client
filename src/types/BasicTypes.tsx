export type Theme = 'LIGHT' | 'DARK';

export type UserRole = 'ADMIN' | 'USER'

export interface User {
    id?: number;
    username: string;
    password?: string;
    firstName: string;
    lastName: string;
    email: string,
    role: UserRole;
    preferredTheme: Theme;
}

export interface UserCredentials {
    username: string;
    password: string;
}

export interface BaseFormData {
    username: string;
    password: string;
}

export interface TextInputProps {
    id: number;
    type: string;
    placeholder: string;
    className: string;
    name: string;
    value: string;
}
