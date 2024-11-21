<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Tài khoản
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::get('/products', [ProductController::class, 'index']);

// Giỏ hàng và Đơn hàng (CSR yêu cầu xác thực)
Route::middleware('auth:sanctum')->group(function () {
    // Giỏ hàng
    Route::post('/cart/add', [CartController::class, 'add']);
    Route::get('/cart', [CartController::class, 'view']);
    Route::delete('/cart/{id}', [CartController::class, 'removeFromCart']);
    Route::put('/cart/update/{id}', [CartController::class, 'updateQuantity']);

    // Thanh toán và Đơn hàng
    Route::post('/checkout', [OrderController::class, 'checkout']);
    Route::get('/orders', [OrderController::class, 'index']);

    // Hồ sơ người dùng
    Route::get('/user/profile', [UserController::class, 'profile']);
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::delete('/user/delete-account', [UserController::class, 'deleteAccount']);
});
