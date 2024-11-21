import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

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

        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(registerData),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            if (data.errors) {
                const errorMessages = Object.values(data.errors).flat();
                throw new Error(errorMessages.join('\n'));
            }
            throw new Error(data.message || 'Đăng ký thất bại');
        }
        
        if (data.access_token) {
            setCookie('token', data.access_token);
            setCookie('username', userData.name);
            window.dispatchEvent(new Event('auth_change'));
            toast.success("Đăng nhập thành công!");
        }
        
        return data;
    },

    async login(credentials) {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();
        
        if (!response.ok) {
            if (data.errors) {
                const errorMessages = Object.values(data.errors).flat();
                throw new Error(errorMessages.join('\n'));
            }
            throw new Error(data.message || 'Đăng nhập thất bại');
        }

        if (data.access_token) {
            setCookie('token', data.access_token);
            setCookie('username', credentials.email);
            window.dispatchEvent(new Event('auth_change'));
        }
        return data;
    },

    async logout() {
        const token = getCookie('token');
        if (!token) return;

        try {
            const decodedToken = decodeURIComponent(token);
            
            const response = await fetch(`${API_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${decodedToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include'
            });
            
            removeCookie('token');
            removeCookie('username');
            window.dispatchEvent(new Event('auth_change'));
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Đăng xuất thất bại');
            }
            
            toast.success("Đăng xuất thành công!");
        } catch (error) {
            console.error('Logout error:', error);
            if (!error.message.includes('Unauthorized')) {
                toast.error(error.message || 'Có lỗi xảy ra khi đăng xuất');
            }
        }
    },

    async deleteAccount() {
        const token = getCookie('token');
        if (!token) {
            toast.error('Bạn chưa đăng nhập');
            return false;
        }

        // Decode token
        const decodedToken = decodeURIComponent(token);
        console.log('Using decoded token:', decodedToken);

        try {
            const response = await fetch(`${API_URL}/user/delete-account`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${decodedToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include'
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const data = await response.json();
                console.log('Error response:', data);
                throw new Error(data.message || 'Không thể xóa tài khoản');
            }

            const data = await response.json();
            console.log('Success response:', data);

            // Chỉ xóa cookies và dispatch event nếu thành công
            removeCookie('token');
            removeCookie('username');
            window.dispatchEvent(new Event('auth_change'));
            toast.success('Tài khoản đã được xóa thành công');
            return true;
        } catch (error) {
            console.error('Delete account error:', error);
            toast.error(error.message || 'Có lỗi xảy ra khi xóa tài khoản');
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