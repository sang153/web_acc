<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'wallet' // Thêm wallet vào fillable
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'wallet' => 'float' // Đảm bảo wallet luôn là float
    ];

    protected $attributes = [
        'name' => '',
        'wallet' => 0 // Giá trị mặc định cho wallet
    ];
    
    // Thêm phương thức kiểm tra ví đủ tiền
    public function hasSufficientFunds($amount)
    {
        return $this->wallet >= $amount;
    }
}