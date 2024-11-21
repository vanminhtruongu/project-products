// 'use client';
// import { useState, useEffect } from 'react';
// import { productService } from '~/app/services/productService';

// export default function ProductList() {
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         loadProducts();
//     }, []);

//     const loadProducts = async (filters = {}) => {
//         try {
//             setLoading(true);
//             const data = await productService.getProducts(filters);
//             setProducts(data);
//             setError(null);
//         } catch (err) {
//             setError('Failed to load products');
//             console.error('Error loading products:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error}</div>;

//     return (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
//             {products.map((product) => (
//                 <div key={product.id} className="border rounded-lg p-4 shadow">
//                     {product.image && (
//                         <img 
//                             src={product.image} 
//                             alt={product.name}
//                             className="w-full h-48 object-cover rounded"
//                         />
//                     )}
//                     <h2 className="text-xl font-bold mt-2">{product.name}</h2>
//                     <p className="text-gray-600">{product.description}</p>
//                     <p className="text-lg font-semibold mt-2">
//                         ${product.price}
//                     </p>
//                     <p className="text-sm text-gray-500">
//                         In stock: {product.stock_quantity}
//                     </p>
//                 </div>
//             ))}
//         </div>
//     );
// } 