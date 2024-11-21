import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Tạo instance axios với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop().split(';').shift();
    return decodeURIComponent(cookieValue);
  }
  return null;
};

export const processCheckout = async (selectedItems) => {
  try {
    const token = getCookie('token');
    if (!token) {
      throw new Error('Vui lòng đăng nhập để thanh toán');
    }

    const response = await axiosInstance.post('/checkout', selectedItems, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true
    });

    const data = response.data;

    // Kiểm tra response từ server
    if (data.status === 'error') {
      throw new Error(data.message || 'Có lỗi xảy ra khi thanh toán');
    }

    return {
      success: true,
      message: data.message || 'Đặt hàng thành công',
      data: data
    };
  } catch (error) {
    console.error('Checkout error:', error);
    throw new Error(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi thanh toán');
  }
};
