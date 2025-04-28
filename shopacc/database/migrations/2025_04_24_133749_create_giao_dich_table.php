<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Tạo bảng (nếu chưa tồn tại)
        if (!Schema::hasTable('giaodich')) {
            Schema::create('giaodich', function (Blueprint $table) {
                $table->id('MaGiaoDich');
                $table->unsignedBigInteger('MaTaiKhoan');
                $table->unsignedBigInteger('MaNguoiDungMua');
                $table->unsignedBigInteger('MaNguoiDungBan');
                $table->decimal('TongTien', 12, 2);
                $table->decimal('PhiGiaoDich', 12, 2)->default(0);
                $table->decimal('SoTienNhanDuoc', 12, 2)->default(0);
                $table->string('PhuongThucThanhToan', 50)->default('Chuyển khoản');
                $table->integer('TrangThai')->default(0);
                $table->text('GhiChu')->nullable();
                $table->dateTime('NgayGiaoDich')->useCurrent();
                $table->timestamps();

                // Thêm index ngay khi tạo bảng
                $table->index('MaTaiKhoan');
                $table->index('MaNguoiDungMua');
                $table->index('MaNguoiDungBan');
                $table->index('TrangThai');
            });
        }

        // Thêm foreign key (không cần kiểm tra index)
        Schema::table('giaodich', function (Blueprint $table) {
            // Kiểm tra foreign key có tồn tại không (cách thủ công)
            $foreignKeys = DB::select("
                SELECT COUNT(*) as count 
                FROM information_schema.TABLE_CONSTRAINTS 
                WHERE CONSTRAINT_SCHEMA = DATABASE() 
                AND TABLE_NAME = 'giaodich' 
                AND CONSTRAINT_NAME = 'giaodich_mataikhoan_foreign'
            ");
            
            if ($foreignKeys[0]->count == 0 && Schema::hasTable('taikhoan')) {
                $table->foreign('MaTaiKhoan')
                    ->references('MaTaiKhoan')
                    ->on('taikhoan')
                    ->onDelete('cascade');
            }

            // Tương tự cho các foreign key khác
            $foreignKeys = DB::select("
                SELECT COUNT(*) as count 
                FROM information_schema.TABLE_CONSTRAINTS 
                WHERE CONSTRAINT_SCHEMA = DATABASE() 
                AND TABLE_NAME = 'giaodich' 
                AND CONSTRAINT_NAME = 'giaodich_manguoidungmua_foreign'
            ");
            
            if ($foreignKeys[0]->count == 0 && Schema::hasTable('users')) {
                $table->foreign('MaNguoiDungMua')
                    ->references('id')
                    ->on('users')
                    ->onDelete('cascade');
            }
        });
    }

    public function down()
    {
        Schema::table('giaodich', function (Blueprint $table) {
            // Xóa foreign key (nếu tồn tại)
            $table->dropForeign('giaodich_mataikhoan_foreign');
            $table->dropForeign('giaodich_manguoidungmua_foreign');
            $table->dropForeign('giaodich_manguoidungban_foreign');
        });
        
        Schema::dropIfExists('giaodich');
    }
};