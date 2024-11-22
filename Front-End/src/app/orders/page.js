'use client';

import { useState, useEffect } from 'react';
import { getOrderHistory } from '~/app/services/orderService';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!hasLoaded) {
      loadOrders();
    }
  }, [hasLoaded]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrderHistory();
      console.log('Orders data:', data);
      if (Array.isArray(data)) {
        data.forEach(order => {
          console.log(`Order #${order.id} payment method:`, order.payment_method);
        });
        setOrders(data);
        console.log("mẹ mày: "+JSON.stringify(orders));
      } else {
        console.error('Invalid orders data format:', data);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi tải danh sách đơn hàng');
      setOrders([]);
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'cod':
        return 'Thanh toán khi nhận hàng (COD)';
      case 'bank_transfer':
        return 'Chuyển khoản ngân hàng';
      case 'e_wallet':
        return 'Ví điện tử';
      default:
        return method;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[url('/images/pattern-bg.png')] bg-fixed bg-cover flex items-center justify-center">
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900/90 via-purple-900/30 to-pink-900/50 pointer-events-none"></div>
        <div className="relative p-8 rounded-2xl bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 shadow-xl">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            <p className="mt-4 text-gray-300">Đang tải danh sách đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/images/pattern-bg.png')] bg-fixed bg-cover py-12 bg-gray-900">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900/90 via-purple-900/30 to-pink-900/50 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 text-transparent bg-clip-text animate-gradient drop-shadow-lg">
              Đơn hàng của tôi
            </h1>
            <p className="text-xl bg-gradient-to-r from-gray-300 to-gray-400 text-transparent bg-clip-text">
              {orders.length} đơn hàng
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700/50 p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-300">Chưa có đơn hàng nào</h3>
              <p className="mt-2 text-gray-400">Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!</p>
              <button
                onClick={() => router.push('/')}
                className="mt-6 relative inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-medium overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover/btn:opacity-90"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 blur-xl transition-all duration-300"></div>
                <span className="relative text-white text-base group-hover/btn:text-white/90">Mua sắm ngay</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-gray-800/40 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden group">
                  {/* Order Header */}
                  <div className="px-6 py-4 bg-gray-900/50 border-b border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Mã đơn hàng</p>
                        <p className="text-lg font-medium bg-gradient-to-r from-purple-300 to-pink-300 text-transparent bg-clip-text">
                          #{order.id}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Ngày đặt hàng</p>
                        <p className="text-gray-300">{formatDate(order.created_at)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-6 py-4">
                    <div className="space-y-4">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-700/50 last:border-0">
                          <div className="relative w-20 h-16 overflow-hidden rounded-lg">
                            <img 
                              src={item.product.image_url} 
                              alt={item.product.name} 
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-medium bg-gradient-to-r from-purple-300 to-pink-300 text-transparent bg-clip-text truncate">
                              {item.product.name}
                            </h4>
                            <p className="mt-1 text-sm text-gray-400">
                              Số lượng: {item.quantity} x {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                              }).format(item.price)}
                            </p>
                          </div>
                          <div className="text-right">
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

                  {/* Order Footer */}
                  <div className="px-6 py-4 bg-gray-900/50 border-t border-gray-700/50">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <span className={`px-4 py-2 rounded-xl text-sm font-medium ${getStatusColor(order.status)} bg-opacity-15 backdrop-blur-sm`}>
                          {getStatusText(order.status)}
                        </span>
                        <span className="text-sm text-gray-400">
                          {getPaymentMethodText(order.payment_method)}
                        </span>
                      </div>
                      <div className="w-full sm:w-auto">
                        <p className="text-sm text-gray-400">Tổng tiền</p>
                        <p className="text-xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 text-transparent bg-clip-text">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(order.total_amount)}
                        </p>
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
