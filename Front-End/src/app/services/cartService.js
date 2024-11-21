import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop().split(';').shift();
    return decodeURIComponent(cookieValue);
  }
  return null;
};

// Tạo axios instance với config mặc định
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Thêm interceptor để tự động thêm token vào header
axiosInstance.interceptors.request.use((config) => {
  const token = getCookie('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const addToCart = async (productId) => {
  try {
    const token = getCookie('token');
    if (!token) {
      throw new Error('Vui lòng đăng nhập để thêm vào giỏ hàng');
    }

    const response = await axiosInstance.post('/cart/add', {
      product_id: productId,
      quantity: 1
    });

    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error.response?.data?.message || error.message;
  }
};

export const getCart = async () => {
  try {
    const token = getCookie('token');
    if (!token) {
      throw new Error('Vui lòng đăng nhập để xem giỏ hàng');
    }

    const response = await axiosInstance.get('/cart');
    console.log('API Response:', response.data); // Log để debug

    // Kiểm tra cấu trúc dữ liệu trả về
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.cart_items)) {
      return response.data.cart_items;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    console.warn('Unexpected cart data structure:', response.data);
    return [];
  } catch (error) {
    console.error('Error getting cart:', error);
    throw error.response?.data?.message || error.message;
  }
};

export const removeFromCart = async (cartItemId) => {
  try {
    const token = getCookie('token');
    if (!token) {
      throw new Error('Vui lòng đăng nhập để xóa sản phẩm');
    }

    const response = await axiosInstance.delete(`/cart/${cartItemId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error.response?.data?.message || error.message;
  }
};

export const updateCartItemQuantity = async (cartItemId, quantity) => {
  try {
    const token = getCookie('token');
    if (!token) {
      throw new Error('Vui lòng đăng nhập để cập nhật số lượng');
    }

    const response = await axiosInstance.put(`/cart/update/${cartItemId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error('Error updating quantity:', error);
    throw error.response?.data?.message || error.message;
  }
};