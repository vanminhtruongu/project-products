import Image from 'next/image';
import Link from 'next/link';
import { getAllProducts } from '~/app/services/productService';
import ClientProducts from '~/app/components/ClientProducts';

// Thêm cấu hình dynamic để tránh cached static page
export const dynamic = 'force-dynamic';

// Chuyển đổi thành async component để fetch data từ server
export default async function Products() {
  let products = [];
  
  try {
    products = await getAllProducts();
    products = Array.isArray(products) ? products : [];
  } catch (error) {
    console.error('Error loading products:', error);
  }

  return <ClientProducts initialProducts={products} />;
}