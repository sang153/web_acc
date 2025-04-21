<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('nguoidung', function (Blueprint $table) {
            $table->id('MaNguoiDung'); // Tùy chỉnh tên khóa chính
            $table->string('TenDangNhap', 150)->unique();
            $table->string('MatKhau', 150);
            $table->string('Email', 150)->unique();
            $table->string('HoTen', 100)->nullable();
            $table->string('DiaChi', 150)->nullable();
            $table->string('SoDienThoai', 11)->nullable();
            $table->tinyInteger('VaiTro')->default(0); // 0: user, 1: admin
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('nguoidung'); // Sửa lại thành drop
    }
};
