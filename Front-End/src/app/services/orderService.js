const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

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

    const response = await fetch(`${API_URL}/orders`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Có lỗi xảy ra khi lấy lịch sử đơn hàng');
    }

    // Trả về trực tiếp data từ API
    return data;
  } catch (error) {
    console.error('Error getting order history:', error);
    throw error;
  }
};
