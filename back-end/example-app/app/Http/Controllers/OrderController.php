<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\Product;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    // Thực hiện thanh toán (Checkout)
    public function checkout(Request $request)
    {
        try {
            $user = $request->user();
            Log::info('Checkout request data:', $request->all());
            
            // Validate request
            $request->validate([
                'items' => 'required|array',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
                'payment_method' => 'required|string|in:cod,bank_transfer,e_wallet'
            ]);

            DB::beginTransaction();

            // Kiểm tra xem user có cart không
            $cart = Cart::where('user_id', $user->id)->first();
            if (!$cart) {
                throw new \Exception('Không tìm thấy giỏ hàng');
            }

            // Tạo đơn hàng mới với payment_method từ request
            $order = new Order();
            $order->user_id = $user->id;
            $order->status = 'pending';
            $order->payment_status = 'pending';
            $order->payment_method = $request->payment_method;
            $order->shipping_address = $user->address ?? '';
            $order->shipping_phone = $user->phone ?? '';
            
            $totalAmount = 0;
            
            // Tính tổng tiền và tạo các item cho đơn hàng
            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);
                if (!$product) {
                    throw new \Exception("Không tìm thấy sản phẩm có ID: {$item['product_id']}");
                }
                $totalAmount += $product->price * $item['quantity'];
            }
            
            $order->total_amount = $totalAmount;
            $order->save();

            // Tạo các order items
            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);
                
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $product->price
                ]);

                // Xóa item khỏi giỏ hàng
                CartItem::where('cart_id', $cart->id)
                       ->where('product_id', $item['product_id'])
                       ->delete();
            }

            DB::commit();

            return response()->json([
                'message' => 'Đặt hàng thành công',
                'order' => $order
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Checkout error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'message' => 'Đặt hàng thất bại',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Xem danh sách đơn hàng đã đặt
    public function index(Request $request)
    {
        $orders = $request->user()->orders()->with('orderItems.product')->get();
        return response()->json($orders, 200);
    }
}
