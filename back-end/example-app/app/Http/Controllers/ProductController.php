<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Product::query();

            // Lọc theo tên sản phẩm
            if ($request->has('search')) {
                $searchTerm = $request->search;
                $query->where('name', 'LIKE', "%{$searchTerm}%");
            }

            // Lọc theo category_id
            if ($request->has('category_id')) {
                $query->where('category_id', $request->category_id);
            }

            // Lọc theo khoảng giá
            if ($request->has('min_price')) {
                $query->where('price', '>=', $request->min_price);
            }
            if ($request->has('max_price')) {
                $query->where('price', '<=', $request->max_price);
            }

            // Sắp xếp theo giá
            if ($request->has('sort_price')) {
                $query->orderBy('price', $request->sort_price);
            }

            $products = $query->with('category')->get();
            return response()->json($products);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch products'], 500);
        }
    }
}
