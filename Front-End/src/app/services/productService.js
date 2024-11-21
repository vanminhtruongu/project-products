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

export const getAllProducts = async () => {
  try {
    const response = await axiosInstance.get('/products');
    console.log("data product", JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}; 
