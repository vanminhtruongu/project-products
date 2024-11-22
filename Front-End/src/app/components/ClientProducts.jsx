'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { addToCart } from '~/app/services/cartService';

export default function ClientProducts({ initialProducts }) {
  const [ products ] = useState(initialProducts);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
      toast.success('Đã thêm sản phẩm vào giỏ hàng');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng');
    }
  };

  return (
    <div className="min-h-screen bg-[url('/images/pattern-bg.png')] bg-fixed bg-cover py-12 bg-gray-900">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900/90 via-purple-900/30 to-pink-900/50 pointer-events-none"></div>
      
      <Link 
        href="/cart"
        className="fixed top-24 right-8 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
      >
        <svg 
          className="w-6 h-6 transform group-hover:rotate-12 transition-transform duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </Link>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 text-transparent bg-clip-text animate-gradient drop-shadow-lg">
              Sản phẩm của chúng tôi
            </h1>
            <p className="mt-4 text-xl bg-gradient-to-r from-gray-300 to-gray-400 text-transparent bg-clip-text max-w-2xl mx-auto">
              Khám phá bộ sưu tập đa dạng các sản phẩm chất lượng cao
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700">
              <div className="mx-auto h-32 w-32 text-gray-400 animate-pulse">
                <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-300">Không có sản phẩm</h3>
              <p className="mt-2 text-gray-400">Hiện tại chưa có sản phẩm nào.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="group relative bg-gray-800/40 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-700/50"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 group-hover:opacity-30 transition-opacity duration-500"></div>
                  
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                    {product.image_url ? (
                      <div className="relative group-hover:scale-110 transition-transform duration-500">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          width={500}
                          height={500}
                          className="h-full w-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-800/50 to-gray-700/50">
                        <svg className="h-24 w-24 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 text-transparent bg-clip-text mb-2 group-hover:from-purple-200 group-hover:to-pink-200 transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-6 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                      {product.description}
                    </p>
                    
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20 blur-xl"></div>
                      <div className="relative space-y-4 pt-6 border-t border-gray-700/50">
                        <div className="price-tag relative w-full">
                          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                          <div className="relative px-6 py-3 bg-gray-900/80 ring-1 ring-gray-700 rounded-lg">
                            <p className="text-xl font-bold text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text group-hover:from-purple-200 group-hover:to-pink-200">
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                              }).format(product.price)}
                            </p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          className="relative w-full inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-medium overflow-hidden group/btn"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover/btn:opacity-90"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 blur-xl transition-all duration-300"></div>
                          <div className="relative flex items-center">
                            <svg 
                              className="w-5 h-5 mr-2 transform group-hover/btn:scale-110 transition-transform duration-300" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            <span className="text-white text-base group-hover/btn:text-white/90">Thêm vào giỏ</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}