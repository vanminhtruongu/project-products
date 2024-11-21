import { toast } from "react-toastify";
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Tạo instance axios với cấu hình mặc định
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

const setCookie = (name, value, days = 7) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
};

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const removeCookie = (name) => {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
};

export const authService = {
    async register(userData) {
        const registerData = {
            username: userData.name,
            email: userData.email,
            password: userData.password,
            password_confirmation: userData.password_confirmation
        };

        try {
            const response = await axiosInstance.post('/register', registerData);
            const data = response.data;
            
            if (data.access_token) {
                setCookie('token', data.access_token);
                setCookie('username', userData.name);
                window.dispatchEvent(new Event('auth_change'));
                toast.success("Đăng nhập thành công!");
            }
            
            return data;
        } catch (error) {
            if (error.response?.data?.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat();
                throw new Error(errorMessages.join('\n'));
            }
            throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
        }
    },

    async login(credentials) {
        try {
            const response = await axiosInstance.post('/login', credentials);
            const data = response.data;

            if (data.access_token) {
                setCookie('token', data.access_token);
                setCookie('username', credentials.email);
                window.dispatchEvent(new Event('auth_change'));
            }
            return data;
        } catch (error) {
            if (error.response?.data?.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat();
                throw new Error(errorMessages.join('\n'));
            }
            throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
        }
    },

    async logout() {
        const token = getCookie('token');
        if (!token) return;

        try {
            const decodedToken = decodeURIComponent(token);
            
            await axiosInstance.post('/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${decodedToken}`
                },
                withCredentials: true
            });
            
            removeCookie('token');
            removeCookie('username');
            window.dispatchEvent(new Event('auth_change'));
            toast.success("Đăng xuất thành công!");
        } catch (error) {
            console.error('Logout error:', error);
            if (!error.response?.data?.message?.includes('Unauthorized')) {
                toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đăng xuất');
            }
        }
    },

    async deleteAccount() {
        const token = getCookie('token');
        if (!token) {
            toast.error('Bạn chưa đăng nhập');
            return false;
        }

        const decodedToken = decodeURIComponent(token);
        console.log('Using decoded token:', decodedToken);

        try {
            const response = await axiosInstance.delete('/user/delete-account', {
                headers: {
                    'Authorization': `Bearer ${decodedToken}`
                },
                withCredentials: true
            });

            console.log('Response status:', response.status);
            console.log('Success response:', response.data);
            removeCookie('token');
            removeCookie('username');
            window.dispatchEvent(new Event('auth_change'));
            toast.success('Tài khoản đã được xóa thành công');
            return true;
        } catch (error) {
            console.error('Delete account error:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa tài khoản');
            return false;
        }
    },

    isAuthenticated() {
        return !!getCookie('token');
    },

    getCurrentUser() {
        return {
            username: getCookie('username') || ''
        };
    }
};