import Cookies from 'js-cookie';

export const authService = {
    getToken: () => Cookies.get('token'),
    setToken: (token: string) => {
        Cookies.set('token', token, {
            expires: 7, // expires in 7 days
            secure: true, // use true if using HTTPS
            sameSite: 'Strict', // or 'Lax' or 'None'
        });
    },
    clearToken: () => Cookies.remove('token'),
};
