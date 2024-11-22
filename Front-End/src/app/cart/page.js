'use client';

import { useState, useEffect } from 'react';
import { getCart, removeFromCart, updateCartItemQuantity } from '~/app/services/cartService';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!hasLoaded) {
      loadCartItems();
    }
  }, [hasLoaded]);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      if (Array.isArray(data)) {
        setCartItems(data);
      } else {
        setCartItems([]);
        console.error('Invalid cart data format:', data);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi tải giỏ hàng');
      setCartItems([]);
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  };

  const handleRemoveFromCart = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
      setHasLoaded(false);
      setSelectedItems(selectedItems.filter(item => item.id !== cartItemId));
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi xóa sản phẩm');
    }
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      let response = await updateCartItemQuantity(cartItemId, newQuantity);
      setHasLoaded(false);
      setSelectedItems(selectedItems.map(item => 
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      ));
      console.log("all quantity ", JSON.stringify(response));
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật số lượng');
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
      return;
    }

    try {
      const checkoutItems = selectedItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        product_id: item.product.id,
        product_name: item.product.name,
        price: item.product.price
      }));
      const encodedItems = encodeURIComponent(JSON.stringify(checkoutItems));
      router.push(`/checkout?items=${encodedItems}`);
    } catch (error) {
      console.error('Error navigating to checkout:', error);
      toast.error('Có lỗi xảy ra khi chuyển sang trang thanh toán');
    }
  };

  const handleSelectItem = (item) => {
    setSelectedItems(prevItems => {
      const isSelected = prevItems.some(selectedItem => selectedItem.id === item.id);
      if (isSelected) {
        return prevItems.filter(selectedItem => selectedItem.id !== item.id);
      } else {
        return [...prevItems, item];
      }
    });
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[url('/images/pattern-bg.png')] bg-fixed bg-cover flex items-center justify-center">
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900/90 via-purple-900/30 to-pink-900/50 pointer-events-none"></div>
        <div className="relative p-8 rounded-2xl bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 shadow-xl">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            <p className="mt-4 text-gray-300">Đang tải giỏ hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/images/pattern-bg.png')] bg-fixed bg-cover py-12 bg-gray-900">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900/90 via-purple-900/30 to-pink-900/50 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 text-transparent bg-clip-text animate-gradient drop-shadow-lg">
              Giỏ hàng
            </h1>
            <p className="text-xl bg-gradient-to-r from-gray-300 to-gray-400 text-transparent bg-clip-text">
              {cartItems.length} sản phẩm trong giỏ hàng của bạn
            </p>
          </div>

          {cartItems.length === 0 ? (
            <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700/50 p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-300">Giỏ hàng trống</h3>
              <p className="mt-2 text-gray-400">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
              <button
                onClick={() => router.push('/')}
                className="mt-6 relative inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-medium overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover/btn:opacity-90"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 blur-xl transition-all duration-300"></div>
                <span className="relative text-white text-base group-hover/btn:text-white/90">Tiếp tục mua sắm</span>
              </button>
            </div>
          ) : (
            <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="divide-y divide-gray-700/50">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-6 flex items-center group">
                      <div className="flex-shrink-0 w-24 h-24 bg-gray-800/60 rounded-xl overflow-hidden">
                        {item.product.image_url ? (
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-800/80">
                            <svg className="h-10 w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="ml-6 flex-1">
                        <div className="flex justify-between">
                          <div className="flex items-center space-x-4">
                            <input
                              type="checkbox"
                              checked={selectedItems.some(selectedItem => selectedItem.id === item.id)}
                              onChange={() => handleSelectItem(item)}
                              className={`h-5 w-5 cursor-pointer rounded border-gray-600 bg-gray-800/60 text-purple-500 focus:ring-purple-500 transition duration-200 ease-in-out transform hover:scale-110 hover:shadow-md ${selectedItems.some(selectedItem => selectedItem.id === item.id) ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}
                            />
                            <div>
                              <h3 className="text-lg font-medium bg-gradient-to-r from-purple-300 to-pink-300 text-transparent bg-clip-text">
                                {item.product.name}
                              </h3>
                              <p className="mt-1 text-sm text-gray-400">
                                {new Intl.NumberFormat('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND'
                                }).format(item.product.price)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-medium bg-gradient-to-r from-purple-300 to-pink-300 text-transparent bg-clip-text">
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                              }).format(item.product.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="p-2 rounded-xl bg-gray-800/60 hover:bg-gray-700/60 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="text-gray-300 w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="p-2 rounded-xl bg-gray-800/60 hover:bg-gray-700/60 transition-colors"
                            >
                              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-8 border-t border-gray-700/50 pt-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-base text-gray-400">Tạm tính ({selectedItems.length} sản phẩm)</span>
                    <span className="text-lg font-medium bg-gradient-to-r from-purple-300 to-pink-300 text-transparent bg-clip-text">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(calculateTotal())}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-base text-gray-400">Phí vận chuyển</span>
                    <span className="text-lg text-gray-300">Miễn phí</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
                    <span className="text-xl font-semibold text-gray-300">Tổng cộng</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 text-transparent bg-clip-text">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(calculateTotal())}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 space-y-4">
                  <button
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0}
                    className={`relative w-full inline-flex items-center justify-center px-6 py-3 rounded-xl text-base font-medium overflow-hidden group/btn
                      ${selectedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover/btn:opacity-90"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 blur-xl transition-all duration-300"></div>
                    <span className="relative text-white group-hover/btn:text-white/90">
                      Thanh toán ({selectedItems.length} sản phẩm)
                    </span>
                  </button>
                  
                  <button
                    onClick={() => router.push('/')}
                    className="w-full py-3 px-4 bg-gray-800/60 backdrop-blur-sm text-base font-medium text-gray-300 border border-gray-700/50 rounded-xl hover:bg-gray-700/60 transition-colors duration-200"
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}