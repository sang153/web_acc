<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\NguoiDung;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        NguoiDung::create([
            'TenDangNhap' => 'newadmin',
            'MatKhau' => Hash::make('123456'),
            'Email' => 'newadmin@shop.com',
            'VaiTro' => 1
        ]);
    }
}
