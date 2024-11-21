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
      await updateCartItemQuantity(cartItemId, newQuantity);
      setHasLoaded(false);
      setSelectedItems(selectedItems.map(item => 
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      ));
      console.log("selectedItems của tao", JSON.stringify(selectedItems));
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 rounded-lg shadow-lg bg-white">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Đang tải giỏ hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng</h1>
            <p className="mt-2 text-gray-600">
              {cartItems.length} sản phẩm trong giỏ hàng của bạn
            </p>
          </div>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Giỏ hàng trống</h3>
              <p className="mt-2 text-gray-500">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
              <button
                onClick={() => router.push('/')}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-6 flex items-center group">
                      <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                        {item.product.image_url ? (
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-full h-full object-cover object-center"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-100">
                            <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={selectedItems.some(selectedItem => selectedItem.id === item.id)}
                              onChange={() => handleSelectItem(item)}
                              className={`h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:scale-110 hover:shadow-md ${selectedItems.some(selectedItem => selectedItem.id === item.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                            />
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {item.product.name}
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">
                                {new Intl.NumberFormat('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND'
                                }).format(item.product.price)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-medium text-gray-900">
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
                              className="p-1 rounded-full hover:bg-gray-100"
                              disabled={item.quantity <= 1}
                            >
                              <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="text-gray-600 w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="text-sm font-medium text-red-600 hover:text-red-500"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-8 border-t border-gray-200 pt-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-base text-gray-600">Tạm tính ({selectedItems.length} sản phẩm)</span>
                    <span className="text-lg font-medium text-gray-900">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(calculateTotal())}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-base text-gray-600">Phí vận chuyển</span>
                    <span className="text-lg text-gray-900">Miễn phí</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-xl font-semibold text-gray-900">Tổng cộng</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(calculateTotal())}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8">
                  <button
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0}
                    className={`w-full py-3 px-4 text-white text-sm font-medium rounded-md shadow-sm 
                      ${selectedItems.length === 0 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'} 
                      transition-colors duration-200`}
                  >
                    Thanh toán ({selectedItems.length} sản phẩm)
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="mt-4 w-full py-3 px-4 bg-white text-sm font-medium text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors duration-200"
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