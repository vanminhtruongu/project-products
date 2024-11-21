const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const getAllProducts = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    console.log("data product", JSON.stringify(data))
    return data
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
} 