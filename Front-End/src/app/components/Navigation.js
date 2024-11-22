'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '~/app/services/authService';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';

export default function Navigation() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const checkAuth = () => {
            const isAuth = authService.isAuthenticated();
            setIsLoggedIn(isAuth);
            if (isAuth) {
                const user = authService.getCurrentUser();
                setUsername(user?.username || '');
            }
        };

        console.log("is username: " + JSON.stringify(username));

        checkAuth();

        // Hàm xử lý sự kiện auth_change
        const handleAuthChange = () => {
            checkAuth();
        };

        // Đăng ký lắng nghe sự kiện
        window.addEventListener('auth_change', handleAuthChange);

        // Xử lý click outside để đóng dropdown
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
                setShowConfirmDelete(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('auth_change', handleAuthChange);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await authService.logout();
            setShowDropdown(false);
            router.push('/login');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi đăng xuất');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const success = await authService.deleteAccount();
            if (success) {
                setShowDropdown(false);
                setShowConfirmDelete(false);
                router.push('/login');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : '?';
    };

    return (
        <nav className="bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800 text-white shadow-lg backdrop-blur-lg backdrop-filter">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200 hover:from-purple-100 hover:to-pink-100 transition-all duration-300">
                            Trang chủ
                        </Link>
                        <div className="flex space-x-6 relative">
                            {isLoggedIn && (
                                <Link
                                    href="/products"
                                    className="relative group text-gray-200 hover:text-white transition-colors duration-300"
                                >
                                    <span className="relative z-10">Sản phẩm</span>
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                                </Link>
                            )}
                            {isLoggedIn && (
                                <Link
                                    href="/orders"
                                    className="relative group text-gray-200 hover:text-white transition-colors duration-300"
                                >
                                    <span className="relative z-10">Đơn hàng</span>
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        {!isLoggedIn ? (
                            <>
                                <Link 
                                    href="/login" 
                                    className="px-4 py-2 rounded-lg text-purple-100 hover:text-white transition-colors duration-300 hover:bg-white/10 backdrop-blur-lg"
                                >
                                    Đăng nhập
                                </Link>
                                <Link 
                                    href="/register" 
                                    className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                                >
                                    Đăng ký
                                </Link>
                            </>
                        ) : (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center space-x-3 group focus:outline-none"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                                        <span className="text-white font-medium">{getInitials(username)}</span>
                                    </div>
                                    <svg
                                        className={`w-5 h-5 text-purple-200 transition-all duration-300 ${showDropdown ? 'rotate-180' : ''} group-hover:text-white`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                                {showDropdown && (
                                    <div className="absolute right-0 mt-3 w-72 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 animate-fadeIn bg-gradient-to-br from-purple-900/95 to-violet-900/95 backdrop-blur-xl border border-white/10 z-[999]">
                                        <div className="divide-y divide-white/10">
                                            <div className="p-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
                                                        <span className="text-white text-lg font-medium">{getInitials(username)}</span>
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-medium">{username}</div>
                                                        <div className="text-purple-200 text-sm">Thành viên</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center w-full px-4 py-3 text-white rounded-xl hover:bg-white/10 transition-all duration-300 group"
                                                >
                                                    <svg className="w-5 h-5 mr-3 text-purple-300 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    <span className="font-medium">Đăng xuất</span>
                                                </button>

                                                <Link
                                                    href="/orders"
                                                    className="flex items-center w-full px-4 py-3 text-white rounded-xl hover:bg-white/10 transition-all duration-300 group"
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    <svg className="w-5 h-5 mr-3 text-purple-300 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                    <span className="font-medium">Lịch sử đơn hàng</span>
                                                </Link>

                                                {!showConfirmDelete ? (
                                                    <button
                                                        onClick={() => setShowConfirmDelete(true)}
                                                        className="flex items-center w-full px-4 py-3 text-red-300 hover:text-red-200 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                                                    >
                                                        <svg className="w-5 h-5 mr-3 text-red-400 group-hover:text-red-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        <span className="font-medium">Xóa tài khoản</span>
                                                    </button>
                                                ) : (
                                                    <div className="p-4 bg-red-500/10 m-2 rounded-xl border border-red-500/20">
                                                        <p className="text-white text-sm mb-4 font-medium">
                                                            Bạn có chắc chắn muốn xóa tài khoản?
                                                            <br />
                                                            <span className="text-red-300 text-xs">Hành động này không thể hoàn tác.</span>
                                                        </p>
                                                        <div className="flex space-x-3">
                                                            <button
                                                                onClick={handleDeleteAccount}
                                                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center justify-center space-x-2"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                                <span>Xóa</span>
                                                            </button>
                                                            <button
                                                                onClick={() => setShowConfirmDelete(false)}
                                                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-300"
                                                            >
                                                                Hủy
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-4 text-center text-xs text-purple-300">
                                                <p>Đăng nhập lần cuối: Hôm nay</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}