'use client';
import { useState } from 'react';
import { authService } from '~/app/services/authService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

const FORM_STYLES = {
    input: "block w-full px-4 py-3 bg-white/20 border border-transparent rounded-lg text-white placeholder-gray-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/30",
    errorAlert: "bg-red-100/80 backdrop-blur-sm border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md animate-shake"
};

const INITIAL_FORM_DATA = {
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
};

export default function Register() {
    const router = useRouter();
    const [error, setError] = useState('');
    
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: INITIAL_FORM_DATA,
        mode: 'onSubmit'
    });

    // Lấy giá trị password để so sánh với password_confirmation
    const password = watch('password');
    console.log("mẹ mày khó hiểu quá: "+password);

    const onSubmit = async (data) => {
        try {
            await authService.register(data);
            toast.success("Đăng ký thành công");
            router.push('/login');
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
                        Đăng ký tài khoản
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
                                {...register("name", {
                                    required: "Họ tên là bắt buộc",
                                    minLength: {
                                        value: 2,
                                        message: "Họ tên phải có ít nhất 2 ký tự"
                                    }
                                })}
                                className={`${FORM_STYLES.input} ${errors.name ? 'border-red-500' : ''}`}
                                placeholder="Họ tên"
                                type="text"
                            />
                        </div>
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
                        <div className="group">
                            <input
                                {...register("password_confirmation", {
                                    required: "Xác nhận mật khẩu là bắt buộc",
                                    validate: value => 
                                        value === password || "Mật khẩu xác nhận không khớp"
                                })}
                                className={`${FORM_STYLES.input} ${errors.password_confirmation ? 'border-red-500' : ''}`}
                                placeholder="Xác nhận mật khẩu"
                                type="password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <svg className="h-5 w-5 text-purple-300 group-hover:text-purple-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </span>
                            Đăng ký
                        </button>
                    </div>

                    <div className="text-center">
                        <Link href="/login" className="font-medium text-white hover:text-purple-200 transition-colors duration-300">
                            Đã có tài khoản? Đăng nhập ngay
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}