import type {BaseFormData} from './BasicTypes.tsx';

export interface SignupFormData extends BaseFormData {
    username: string;
    password: string;
    passwordConfirm: string;
    firstName: string;  // Should be camelCase, consistent with the input name
    lastName: string;
    email: string;
}