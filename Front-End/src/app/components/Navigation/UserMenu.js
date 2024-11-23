'use client';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Link from 'next/link';

export default function UserMenu({ username, onLogout, showConfirmDelete, onDeleteAccount, onToggleConfirmDelete, getInitials }) {
    return (
        <Menu as="div" className="relative">
            {({ open }) => (
                <>
                    <Menu.Button className="flex items-center space-x-3 group focus:outline-none">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                            <span className="text-white font-medium">{getInitials(username)}</span>
                        </div>
                        <svg
                            className={`w-5 h-5 text-purple-200 transition-all duration-300 ${open ? 'rotate-180' : ''} group-hover:text-white`}
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
                    </Menu.Button>

                    <Transition
                        as={Fragment}
                        enter="transition duration-200 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-150 ease-in"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                    >
                        <Menu.Items className="absolute right-0 mt-3 w-72 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-900/95 to-violet-900/95 backdrop-blur-xl border border-white/10 z-[999] divide-y divide-white/10">
                            {/* User Info Section */}
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

                            {/* Menu Items */}
                            <div className="p-2">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={onLogout}
                                            className={`flex items-center w-full px-4 py-3 text-white rounded-xl transition-all duration-300 ${active ? 'bg-white/10' : ''}`}
                                        >
                                            <svg className="w-5 h-5 mr-3 text-purple-300 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span className="font-medium">Đăng xuất</span>
                                        </button>
                                    )}
                                </Menu.Item>

                                <Menu.Item>
                                    {({ active }) => (
                                        <Link
                                            href="/orders"
                                            className={`flex items-center w-full px-4 py-3 text-white rounded-xl transition-all duration-300 ${active ? 'bg-white/10' : ''}`}
                                        >
                                            <svg className="w-5 h-5 mr-3 text-purple-300 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            <span className="font-medium">Lịch sử đơn hàng</span>
                                        </Link>
                                    )}
                                </Menu.Item>

                                {!showConfirmDelete ? (
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={() => onToggleConfirmDelete(true)}
                                                className={`flex items-center w-full px-4 py-3 text-red-300 hover:text-red-200 rounded-xl transition-all duration-300 ${active ? 'bg-white/10' : ''}`}
                                            >
                                                <svg className="w-5 h-5 mr-3 text-red-400 group-hover:text-red-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                <span className="font-medium">Xóa tài khoản</span>
                                            </button>
                                        )}
                                    </Menu.Item>
                                ) : (
                                    <div className="p-4 bg-red-500/10 m-2 rounded-xl border border-red-500/20">
                                        <p className="text-white text-sm mb-4 font-medium">
                                            Bạn có chắc chắn muốn xóa tài khoản?
                                            <br />
                                            <span className="text-red-300 text-xs">Hành động này không thể hoàn tác.</span>
                                        </p>
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={onDeleteAccount}
                                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center justify-center space-x-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                <span>Xóa</span>
                                            </button>
                                            <button
                                                onClick={() => onToggleConfirmDelete(false)}
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
                        </Menu.Items>
                    </Transition>
                </>
            )}
        </Menu>
    );
} 