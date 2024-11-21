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
        // Kiểm tra trạng thái đăng nhập ban đầu và lấy tên người dùng
        const checkAuth = () => {
            const isAuth = authService.isAuthenticated();
            setIsLoggedIn(isAuth);
            if (isAuth) {
                const user = authService.getCurrentUser();
                setUsername(user?.username || '');
            }
        };

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

        // Cleanup
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
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex space-x-4">
                    <Link href="/" className="hover:text-gray-300">
                        Trang chủ
                    </Link>
                    {isLoggedIn && (
                        <Link
                            href="/products"
                            className={`text-gray-600 hover:text-blue-600`}
                        >
                            Sản phẩm
                        </Link>
                    )}
                    {isLoggedIn && (
                        <Link
                            href="/orders"
                            className={`text-gray-600 hover:text-blue-600`}
                        >
                            Đơn hàng
                        </Link>
                    )}
                </div>
                <div className="flex space-x-4 items-center">
                    {!isLoggedIn ? (
                        <>
                            <Link href="/login" className="hover:text-gray-300">
                                Đăng nhập
                            </Link>
                            <Link href="/register" className="hover:text-gray-300">
                                Đăng ký
                            </Link>
                        </>
                    ) : (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center space-x-2 hover:text-gray-300 focus:outline-none"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                    {getInitials(username)}
                                </div>
                                <svg
                                    className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
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
                                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[60px]">
                                    <div className="py-1">
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Đăng xuất
                                        </button>
                                        <Link
                                            href="/orders"
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            Lịch sử đơn hàng
                                        </Link>
                                        {!showConfirmDelete ? (
                                            <button
                                                onClick={() => setShowConfirmDelete(true)}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            >
                                                Xóa tài khoản
                                            </button>
                                        ) : (
                                            <div className="p-4 bg-gray-50">
                                                <p className="text-sm text-gray-700 mb-2">
                                                    Bạn có chắc chắn muốn xóa tài khoản?
                                                </p>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={handleDeleteAccount}
                                                        className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                                                    >
                                                        Xóa
                                                    </button>
                                                    <button
                                                        onClick={() => setShowConfirmDelete(false)}
                                                        className="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                                                    >
                                                        Hủy
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}