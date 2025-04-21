<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class NguoiDung extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'nguoidung';
    protected $primaryKey = 'MaNguoiDung';
    public $timestamps = false;

    protected $fillable = [
        'TenDangNhap',
        'MatKhau',
        'Email',
        'HoTen',
        'DiaChi',
        'SoDienThoai',
        'VaiTro'
    ];

    protected $hidden = [
        'MatKhau',
    ];

    public function getAuthPassword()
    {
        return $this->MatKhau;
    }
}