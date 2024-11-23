'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { processCheckout } from '~/app/services/checkoutService';
import toast from 'react-hot-toast';

export default function Checkout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasProcessed, setHasProcessed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // Default to COD

  useEffect(() => {
    const items = searchParams.get('items');
    if (!items) {
      toast.error('Không tìm thấy thông tin đơn hàng');
      router.push('/cart');
      return;
    }
    try {
      const decodedItems = JSON.parse(decodeURIComponent(items));
      if (!Array.isArray(decodedItems) || decodedItems.length === 0) {
        toast.error('Thông tin đơn hàng không hợp lệ');
        router.push('/cart');
        return;
      }
      setSelectedItems(decodedItems);
    } catch (error) {
      console.error('Error parsing items:', error);
      toast.error('Có lỗi xảy ra khi xử lý thông tin đơn hàng');
      router.push('/cart');
    }
  }, [searchParams, router]);

  const handlePaymentMethodChange = (method) => {
    console.log('Payment method changed to:', method);
    setPaymentMethod(method);
  };

  const handleCheckout = async () => {
    if (loading || hasProcessed) return;
    
    try {
      setLoading(true);
      if (!selectedItems || selectedItems.length === 0) {
        toast.error('Không có sản phẩm nào để thanh toán');
        router.push('/cart');
        return;
      }

      console.group('Checkout Debug Information');
      console.log('Current payment method:', paymentMethod);
      console.log('Selected items:', selectedItems);
      
      const checkoutData = {
        items: selectedItems.map(item => ({
          id: item.id,
          product_id: item.product_id,
          quantity: item.quantity
        })),
        payment_method: paymentMethod
      };

      console.log('Sending checkout data:', checkoutData);
      console.log('Final checkout data:', checkoutData);
      console.groupEnd();

      const response = await processCheckout(checkoutData);
      console.group('Checkout Response');
      console.log('Server response:', response);
      console.groupEnd();
      
      setHasProcessed(true);
      
      if (response.success) {
        toast.success('Đặt hàng thành công');
        setTimeout(() => {
          router.push('/orders');
          router.refresh();
        }, 2000);
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi đặt hàng');
      }
    } catch (error) {
      console.group('Checkout Error');
      console.error('Error details:', error);
      console.groupEnd();
      toast.error(error.message || 'Có lỗi xảy ra khi đặt hàng');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      const price = parseFloat(item.price);
      const quantity = parseInt(item.quantity);
      if (isNaN(price) || isNaN(quantity)) return total;
      return total + (price * quantity);
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen  bg-fixed bg-cover flex items-center justify-center">
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900/90 via-purple-900/30 to-pink-900/50 pointer-events-none"></div>
        <div className="relative p-8 rounded-2xl bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 shadow-xl">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            <p className="mt-4 text-gray-300">Đang xử lý đơn hàng của bạn...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/images/pattern-bg.png')] bg-fixed bg-cover py-8 bg-gray-900">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900/90 via-purple-900/30 to-pink-900/50 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 text-transparent bg-clip-text">Thanh toán</h1>
            <p className="mt-2 text-gray-300">Hoàn tất đơn hàng của bạn</p>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden">
            <div className="w-full h-2 bg-gray-700">
              <div className="w-2/3 h-full bg-gradient-to-r from-purple-600 to-pink-600"></div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="mb-8">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-300 to-pink-300 text-transparent bg-clip-text mb-4">
                  Chi tiết đơn hàng
                </h2>
                <div className="space-y-4">
                  {selectedItems.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between py-4 border-b border-gray-700/50 last:border-0"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-200">
                          {item.product_name}
                        </h3>
                        <div className="mt-1 flex items-center text-sm text-gray-400">
                          <span>Số lượng: {item.quantity}</span>
                          <span className="mx-2">•</span>
                          <span>
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                            }).format(item.price)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-lg font-medium bg-gradient-to-r from-purple-300 to-pink-300 text-transparent bg-clip-text">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 border-t border-gray-700/50 pt-6">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-300 to-pink-300 text-transparent bg-clip-text mb-4">
                  Phương thức thanh toán
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="cod"
                      name="payment-method"
                      type="radio"
                      checked={paymentMethod === 'cod'}
                      onChange={() => handlePaymentMethodChange('cod')}
                      className="h-4 w-4 text-purple-500 border-gray-600 focus:ring-purple-500 bg-gray-800"
                    />
                    <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-300">
                      Thanh toán khi nhận hàng (COD)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="bank_transfer"
                      name="payment-method"
                      type="radio"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => handlePaymentMethodChange('bank_transfer')}
                      className="h-4 w-4 text-purple-500 border-gray-600 focus:ring-purple-500 bg-gray-800"
                    />
                    <label htmlFor="bank_transfer" className="ml-3 block text-sm font-medium text-gray-300">
                      Chuyển khoản ngân hàng
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="e_wallet"
                      name="payment-method"
                      type="radio"
                      checked={paymentMethod === 'e_wallet'}
                      onChange={() => handlePaymentMethodChange('e_wallet')}
                      className="h-4 w-4 text-purple-500 border-gray-600 focus:ring-purple-500 bg-gray-800"
                    />
                    <label htmlFor="e_wallet" className="ml-3 block text-sm font-medium text-gray-300">
                      Ví điện tử
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700/50 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-base text-gray-400">Tạm tính</span>
                  <span className="text-lg bg-gradient-to-r from-purple-300 to-pink-300 text-transparent bg-clip-text">
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

              <div className="mt-8 space-y-4 sm:space-y-0 sm:flex sm:justify-end sm:space-x-4">
                <button
                  onClick={() => router.push('/cart')}
                  className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-300 bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:bg-gray-700/60 transition-colors duration-200"
                >
                  Quay lại giỏ hàng
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={loading || hasProcessed}
                  className={`relative w-full sm:w-auto px-6 py-3 text-sm font-medium rounded-xl overflow-hidden group/btn
                    ${(loading || hasProcessed) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover/btn:opacity-90"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 blur-xl transition-all duration-300"></div>
                  <span className="relative text-white group-hover/btn:text-white/90">
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xử lý...
                      </span>
                    ) : 'Xác nhận đặt hàng'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-400">
            <div className="flex items-center justify-center space-x-2">
              <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Thanh toán an toàn và bảo mật</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
