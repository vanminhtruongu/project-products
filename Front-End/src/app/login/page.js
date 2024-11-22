'use client';

// Core imports
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
// Services
import { authService } from '~/app/services/authService';
import { rememberMeService } from '~/app/services/rememberMeService';

// Constants
const FORM_STYLES = {
    input: "block w-full px-4 py-3 bg-white/20 border border-transparent rounded-lg text-white placeholder-gray-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/30",
    button: "group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform transition-all duration-300 hover:scale-105 hover:shadow-lg",
    link: "font-medium text-purple-200 hover:text-white transition-colors duration-300",
    errorAlert: "bg-red-100/80 backdrop-blur-sm border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md animate-shake"
};

const INITIAL_CREDENTIALS = {
    email: '',
    password: '',
    rememberMe: false
};

export default function Login() {
    const router = useRouter();
    const [error, setError] = useState('');
    
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: INITIAL_CREDENTIALS,
        mode: 'onSubmit'
    });

    // Watch rememberMe value để xử lý
    const rememberMe = watch('rememberMe');

    useEffect(() => {
        const storedCredentials = rememberMeService.getStoredCredentials();
        if (storedCredentials) {
            // Set giá trị cho form từ localStorage
            setValue('email', storedCredentials.email);
            setValue('password', storedCredentials.password);
            setValue('rememberMe', storedCredentials.rememberMe);
        }   
    }, [setValue]);

    // Theo dõi thay đổi của các trường để cập nhật remember me
    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (value.rememberMe) {
                rememberMeService.saveCredentials(value);
            } else if (name === 'rememberMe' && !value.rememberMe) {
                rememberMeService.clearCredentials();
            }
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    const onSubmit = async (data) => {
        try {   
            await authService.login(data);
            toast.success("Đăng nhập thành công");
            router.push('/');
        } catch (err) {
            toast.error(err.message);
        }
    };

    const onError = (errors) => {
        const firstError = Object.values(errors)[0];
        if (firstError) {
            toast.error(firstError.message);
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
                    <div className={FORM_STYLES.errorAlert} role="alert">
                        <span className="block sm:inline font-medium">{error}</span>
                    </div>
                )}

                <form className="mt-8 space-y-6 relative" onSubmit={handleSubmit(onSubmit, onError)}>
                    <div className="space-y-4">
                        <div className="group">
                            <input
                                {...register("email", {
                                    required: "Email là bắt buộc",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Email không hợp lệ"
                                    }
                                })}
                                className={`${FORM_STYLES.input} ${errors.email ? 'border-red-500' : ''}`}
                                placeholder="Email"
                                type="email"
                            />
                        </div>
                        <div className="group">
                            <input
                                {...register("password", {
                                    required: "Mật khẩu là bắt buộc",
                                    minLength: {
                                        value: 6,
                                        message: "Mật khẩu phải có ít nhất 6 ký tự"
                                    }
                                })}
                                className={`${FORM_STYLES.input} ${errors.password ? 'border-red-500' : ''}`}
                                placeholder="Mật khẩu"
                                type="password"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                {...register("rememberMe")}
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 transition-all duration-300"
                            />
                            <label className="ml-2 block text-sm text-white">Ghi nhớ đăng nhập</label>
                        </div>
                        <div className="text-sm">
                            <Link href="/forgot-password" className={FORM_STYLES.link}>
                                Quên mật khẩu?
                            </Link>
                        </div>
                    </div>

                    <div>
                        <button type="submit" className={FORM_STYLES.button}>
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
                        <Link href="/register" className={FORM_STYLES.link}>
                            Đăng ký ngay
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}