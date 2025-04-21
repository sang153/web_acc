<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Taikhoan extends Model
{
    protected $table = 'taikhoan';
    protected $primaryKey = 'MaTaiKhoan';
    public $timestamps = false;

    protected $fillable = [
        'MaGame',
        'MaNguoiDungBan',
        'TenTaiKhoan',
        'MatKhauTaiKhoan',
        'MoTa',
        'GiaBan',
        'TrangThai',
    ];
}
