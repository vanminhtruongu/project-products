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

export const getOrderHistory = async () => {
  try {
    const token = getCookie('token');
    if (!token) {
      throw new Error('Vui lòng đăng nhập để xem lịch sử đơn hàng');
    }

    const response = await axiosInstance.get('/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true
    });

    // Trả về trực tiếp data từ API
    return response.data;
  } catch (error) {
    console.error('Error getting order history:', error);
    throw new Error(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi lấy lịch sử đơn hàng');
  }
};
