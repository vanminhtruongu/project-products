<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    // Đăng ký người dùng mới
    public function register(Request $request)
    {
        try {
            // Kiểm tra email đã tồn tại chưa
            if (User::where('email', $request->email)->exists()) {
                return response()->json(['message' => 'Email đã tồn tại'], 400);
            }

            // Kiểm tra username đã tồn tại chưa
            if (User::where('username',
                $request->username
            )->exists()) {
                return response()->json(['message' => 'Username đã tồn tại'], 400);
            }

            DB::beginTransaction();

            // Tạo người dùng mới
            $user = User::create([
                'username'    => $request->username,
                'email'       => $request->email,
                'password'    => Hash::make($request->password),
                'full_name'   => $request->full_name ?? null,
                'phone'       => $request->phone ?? null,
                'address'     => $request->address ?? null,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Đăng ký người dùng thành công',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Đăng ký thất bại',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Đăng nhập người dùng
    public function login(Request $request)
    {
        // Loại bỏ xác thực dữ liệu
        // Bạn có thể thêm các kiểm tra thủ công nếu cần

        // Kiểm tra thông tin đăng nhập
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Thông tin đăng nhập không chính xác'], 401);
        }

        // Tạo token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Đăng nhập thành công',
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 200);
    }

    // Đăng xuất người dùng
    public function logout(Request $request)
    {
        // Xóa tất cả token của người dùng
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Đăng xuất thành công'], 200);
    }
}
