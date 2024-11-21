<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    // Xem thông tin hồ sơ người dùng
    public function profile(Request $request)
    {
        $user = $request->user()->load(['carts', 'orders']);
        return response()->json($user, 200);
    }

    // Cập nhật thông tin hồ sơ
    public function updateProfile(Request $request)
    {
        try {
            $user = $request->user();
            
            // Validate dữ liệu
            $request->validate([
                'full_name' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:255',
            ]);

            // Cập nhật thông tin
            $user->update([
                'full_name' => $request->full_name,
                'phone' => $request->phone,
                'address' => $request->address,
            ]);

            return response()->json([
                'message' => 'Cập nhật thông tin thành công',
                'user' => $user
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Cập nhật thông tin thất bại',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Thêm phương thức xóa tài khoản
    public function deleteAccount(Request $request)
    {
        try {
            $user = $request->user();
            
            // Xóa các dữ liệu liên quan (cart, orders, etc.)
            $user->carts()->delete();
            $user->orders()->delete();
            
            // Xóa user
            $user->delete();

            return response()->json([
                'message' => 'Tài khoản đã được xóa thành công'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Không thể xóa tài khoản',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
