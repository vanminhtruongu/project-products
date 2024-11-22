'use client';
import { useState, useEffect } from 'react';
import { authService } from '~/app/services/authService';
import { rememberMeService } from '~/app/services/rememberMeService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function Login() {
    const router = useRouter();
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [error, setError] = useState('');

    // Kiểm tra và điền thông tin từ localStorage khi component được mount
    useEffect(() => {
        const storedCredentials = rememberMeService.getStoredCredentials();
        if (storedCredentials) {
            setCredentials(storedCredentials);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        const newCredentials = {
            ...credentials,
            [name]: newValue
        };


        setCredentials(newCredentials);

        // Xử lý Remember me
        if (name === 'rememberMe') {
            if (checked) {
                rememberMeService.saveCredentials(newCredentials);
            } else {
                rememberMeService.clearCredentials();
            }
        } else if (newCredentials.rememberMe) {
            // Cập nhật thông tin nếu Remember me đang bật
            rememberMeService.updateCredentialsIfRemembered(newCredentials);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.login(credentials);
            toast.success("Đăng nhập thành công");
            console.log("Đăng nhập thành công");
            router.push('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 animate-gradient-x">
            <div className="max-w-md w-full space-y-8 p-10 bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="relative">
                    <h2 className="mt-6 text-center text-4xl font-extrabold text-white drop-shadow-lg">
                        Đăng nhập
                    </h2>
                    <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                </div>
                
                {error && (
                    <div className="bg-red-100/80 backdrop-blur-sm border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md animate-shake" role="alert">
                        <span className="block sm:inline font-medium">{error}</span>
                    </div>
                )}

                <form className="mt-8 space-y-6 relative" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="group">
                            <input
                                name="email"
                                type="email"
                                required
                                className="block w-full px-4 py-3 bg-white/20 border border-transparent rounded-lg text-white placeholder-gray-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/30"
                                placeholder="Email"
                                value={credentials.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="group">
                            <input
                                name="password"
                                type="password"
                                required
                                className="block w-full px-4 py-3 bg-white/20 border border-transparent rounded-lg text-white placeholder-gray-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/30"
                                placeholder="Mật khẩu"
                                value={credentials.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                name="rememberMe"
                                type="checkbox"
                                checked={credentials.rememberMe}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 transition-all duration-300"
                            />
                            <label className="ml-2 block text-sm text-white">Ghi nhớ đăng nhập</label>
                        </div>
                        <div className="text-sm">
                            <Link href="/forgot-password" className="font-medium text-purple-200 hover:text-white transition-colors duration-300">
                                Quên mật khẩu?
                            </Link>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <svg className="h-5 w-5 text-purple-300 group-hover:text-purple-100 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </span>
                            Đăng nhập
                        </button>
                    </div>

                    <div className="text-center">
                        <span className="text-white">Chưa có tài khoản? </span>
                        <Link href="/register" className="font-medium text-purple-200 hover:text-white transition-colors duration-300">
                            Đăng ký ngay
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
} 