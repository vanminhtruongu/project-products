<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run()
    {
        Product::create([
            'name' => 'Sản phẩm 1',
            'description' => 'Mô tả sản phẩm 1',
            'price' => 100000,
            'image' => 'https://via.placeholder.com/200',
        ]);

        Product::create([
            'name' => 'Sản phẩm 2',
            'description' => 'Mô tả sản phẩm 2',
            'price' => 200000,
            'image' => 'https://via.placeholder.com/200',
        ]);

        // Thêm các sản phẩm khác...
    }
} 