<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function add(Request $request)
    {
        try {
            $request->validate([
                'product_id' => 'required|exists:products,id',
                'quantity' => 'required|integer|min:1'
            ]);

            $user = $request->user();
            if (!$user) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $product = Product::findOrFail($request->product_id);
            
            if ($product->stock_quantity < $request->quantity) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không đủ số lượng trong kho. Chỉ còn ' . $product->stock_quantity . ' sản phẩm.'
                ], 400);
            }
            
            $cart = Cart::firstOrCreate(['user_id' => $user->id]);

            $cartItem = CartItem::where('cart_id', $cart->id)
                ->where('product_id', $request->product_id)
                ->first();

            if ($cartItem) {
                $newQuantity = $cartItem->quantity + $request->quantity;
                if ($product->stock_quantity < $newQuantity) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Không đủ số lượng trong kho'
                    ], 400);
                }
                
                $cartItem->quantity = $newQuantity;
                $cartItem->save();
            } else {
                $cartItem = CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $request->product_id,
                    'quantity' => $request->quantity
                ]);
            }

            $product->stock_quantity -= $request->quantity;
            $product->save();

            $updatedCartItems = CartItem::with('product')
                ->where('cart_id', $cart->id)
                ->get();

            return response()->json([
                'status' => 'success',
                'message' => 'Thêm vào giỏ hàng thành công',
                'cart_items' => $updatedCartItems,
                'product' => $product
            ], 200);

        } catch (\Exception $e) {
            Log::error('Add to cart error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể thêm vào giỏ hàng: ' . $e->getMessage()
            ], 500);
        }
    }

    public function view(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $cart = Cart::where('user_id', $user->id)->first();
            
            if (!$cart) {
                return response()->json([]); 
            }

            $cartItems = CartItem::with('product')
                ->where('cart_id', $cart->id)
                ->get();

            \Log::info('Cart items:', ['items' => $cartItems->toArray()]);

            return response()->json($cartItems);

        } catch (\Exception $e) {
            \Log::error('View cart error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể tải giỏ hàng: ' . $e->getMessage()
            ], 500);
        }
    }

    public function addToCart(Request $request)
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        $cartItem = CartItem::updateOrCreate(
            [
                'cart_id' => $cart->id,
                'product_id' => $request->product_id
            ],
            [
                'quantity' => DB::raw('quantity + 1')
            ]
        );

        return response()->json(['message' => 'Product added to cart successfully']);
    }

    public function removeFromCart($id)
    {
        try {
            $user = auth()->user();
            if (!$user) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            // Tìm cart item và kiểm tra quyền sở hữu
            $cartItem = CartItem::whereHas('cart', function($query) use ($user) {
                $query->where('user_id', $user->id);
            })->find($id);

            if (!$cartItem) {
                return response()->json(['message' => 'Cart item not found'], 404);
            }

            // Lấy thông tin sản phẩm trước khi xóa
            $product = Product::find($cartItem->product_id);
            
            // Xóa cart item mà không cập nhật stock_quantity
            $cartItem->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Đã xóa sản phẩm khỏi giỏ hàng',
                'product' => $product
            ]);

        } catch (\Exception $e) {
            Log::error('Remove from cart error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể xóa sản phẩm khỏi giỏ hàng'
            ], 500);
        }
    }

    public function updateQuantity(Request $request, $cartItemId)
    {
        try {
            $cartItem = CartItem::findOrFail($cartItemId);
            $product = Product::findOrFail($cartItem->product_id);
            
            // Tính toán sự thay đổi số lượng
            $quantityDiff = $request->quantity - $cartItem->quantity;
            
            // Kiểm tra xem có đủ hàng không
            if ($quantityDiff > 0 && $product->stock_quantity < $quantityDiff) {
                return response()->json([
                    'message' => 'Không đủ số lượng trong kho'
                ], 400);
            }
            
            // Cập nhật số lượng trong giỏ hàng
            $cartItem->quantity = $request->quantity;
            $cartItem->save();
            
            // Cập nhật stock_quantity của sản phẩm
            $product->stock_quantity -= $quantityDiff;
            $product->save();
            
            return response()->json([
                'message' => 'Cập nhật thành công',
                'cart_item' => $cartItem,
                'product' => $product
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }
}
