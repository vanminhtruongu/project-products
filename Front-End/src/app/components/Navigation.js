'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '~/app/services/authService';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import MobileMenu from '~/app/components/Navigation/MobileMenu';
import UserMenu from '~/app/components/Navigation/UserMenu';

export default function Navigation() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const isAuth = authService.isAuthenticated();
            setIsLoggedIn(isAuth);
            if (isAuth) {
                const user = authService.getCurrentUser();
                setUsername(user?.username || '');
            }
        };

        checkAuth();

        const handleAuthChange = () => {
            checkAuth();
        };

        window.addEventListener('auth_change', handleAuthChange);

        return () => {
            window.removeEventListener('auth_change', handleAuthChange);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await authService.logout();
            router.push('/login');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi đăng xuất');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const success = await authService.deleteAccount();
            if (success) {
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
                    <div className="flex items-center">
                        <MobileMenu isLoggedIn={isLoggedIn} />

                        <Link href="/" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200 hover:from-purple-100 hover:to-pink-100 transition-all duration-300">
                            Trang chủ
                        </Link>
                        
                        {/* Desktop menu */}
                        <div className="hidden lg:flex space-x-6 ml-8 relative">
                            {isLoggedIn && (
                                <>
                                    <Link
                                        href="/products"
                                        className="relative group text-gray-200 hover:text-white transition-colors duration-300"
                                    >
                                        <span className="relative z-10">Sản phẩm</span>
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                                    </Link>
                                    <Link
                                        href="/orders"
                                        className="relative group text-gray-200 hover:text-white transition-colors duration-300"
                                    >
                                        <span className="relative z-10">Đơn hàng</span>
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* User actions section */}
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
                            <UserMenu
                                username={username}
                                onLogout={handleLogout}
                                showConfirmDelete={showConfirmDelete}
                                onDeleteAccount={handleDeleteAccount}
                                onToggleConfirmDelete={setShowConfirmDelete}
                                getInitials={getInitials}
                            />  //  => thành phần hiển thị tên tài khoản
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}