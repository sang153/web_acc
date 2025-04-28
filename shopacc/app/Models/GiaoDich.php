<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GiaoDich extends Model
{
    use HasFactory;

    protected $table = 'giaodich';
    protected $primaryKey = 'MaGiaoDich';
    public $timestamps = false;

    protected $fillable = [
        'MaTaiKhoan',
        'MaNguoiDungMua',
        'MaNguoiDungBan',
        'TongTien',
        'PhiGiaoDich',
        'PhuongThucThanhToan',
        'TrangThai',
        'GhiChu',
        'NgayGiaoDich'
    ];

    protected $casts = [
        'NgayGiaoDich' => 'datetime',
        'TongTien' => 'decimal:2',
        'PhiGiaoDich' => 'decimal:2',
        'TrangThai' => 'integer'
    ];

    // Trạng thái giao dịch
    const THANH_CONG = 1;
    const DANG_XU_LY = 2;
    const THAT_BAI = 0;

    // Quan hệ với tài khoản
    public function taiKhoan()
    {
        return $this->belongsTo(TaiKhoan::class, 'MaTaiKhoan');
    }

    // Quan hệ với người mua
    public function nguoiMua()
    {
        return $this->belongsTo(NguoiDung::class, 'MaNguoiDungMua');
    }

    // Quan hệ với người bán
    public function nguoiBan()
    {
        return $this->belongsTo(NguoiDung::class, 'MaNguoiDungBan');
    }

    // Kiểm tra trạng thái
    public function isThanhCong()
    {
        return $this->TrangThai === self::THANH_CONG;
    }
}