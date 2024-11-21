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

export const processCheckout = async (selectedItems) => {
  try {
    const token = getCookie('token');
    if (!token) {
      throw new Error('Vui lòng đăng nhập để thanh toán');
    }

    const response = await fetch(`${API_URL}/checkout`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify(selectedItems)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Có lỗi xảy ra khi thanh toán');
    }

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
    throw error;
  }
};
