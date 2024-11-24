'use client';
import { Disclosure, Transition } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MobileMenu({ isLoggedIn }) {
    const router = useRouter();

    const handleNavigation = (path, close) => {
        router.push(path);
        close();
    };

    return (
        <Disclosure as="div" className="lg:hidden">
            {({ open, close }) => (
                <>
                    <Disclosure.Button className="menu-button mr-4 p-2 rounded-lg hover:bg-white/10 transition-colors duration-200">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                            />
                        </svg>
                    </Disclosure.Button> { /* biểu tượng menu */}

                    <Transition
                        enter="transition duration-300 ease-out"
                        enterFrom="-translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition duration-300 ease-in"
                        leaveFrom="translate-x-0"
                        leaveTo="-translate-x-full"
                    >
                        <Disclosure.Panel className="fixed inset-y-0 left-0 w-64 z-50">
                            <div className="h-screen w-full bg-[#2D1B69]">
                                <div className="flex flex-col h-full">
                                    <div className="bg-[#4C1D95] p-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-bold text-white">Menu</h3>
                                            <Disclosure.Button className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200">
                                                <svg 
                                                    className="w-6 h-6 text-white" 
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path 
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round" 
                                                        strokeWidth="2" 
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </Disclosure.Button>
                                        </div>
                                    </div>
                                    <div className="flex-1 p-4 space-y-2">
                                        <button
                                            onClick={() => handleNavigation('/', close)}
                                            className="block w-full px-4 py-3 rounded-lg bg-[#382B73] text-white hover:bg-[#4C3B8F] transition-all duration-200 font-medium text-left"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                </svg>
                                                <span>Trang chủ</span>
                                            </div>
                                        </button>

                                        {isLoggedIn && (
                                            <>
                                                <button
                                                    onClick={() => handleNavigation('/products', close)}
                                                    className="block w-full px-4 py-3 rounded-lg bg-[#382B73] text-white hover:bg-[#4C3B8F] transition-all duration-200 font-medium text-left"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                        </svg>
                                                        <span>Sản phẩm</span>
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={() => handleNavigation('/orders', close)}
                                                    className="block w-full px-4 py-3 rounded-lg bg-[#382B73] text-white hover:bg-[#4C3B8F] transition-all duration-200 font-medium text-left"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                        </svg>
                                                        <span>Đơn hàng</span>
                                                    </div>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Disclosure.Panel>
                    </Transition>

                    <Transition
                        show={open}
                        enter="transition-opacity duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Disclosure.Panel className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-40"/>
                    </Transition>
                </>
            )}
        </Disclosure>
    );
} 