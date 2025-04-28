<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Carbon\Carbon;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'email',
        'password',
        'wallet'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $attributes = [
        'wallet' => 0
    ];
    
    /**
     * Get all users with their information
     */
    public static function getAllUsersInfo()
    {
        $users = self::all();
        
        if ($users->isEmpty()) {
            return null;
        }

        return $users->map(function ($user) {
            return [
                'ID' => $user->id,
                'Email' => $user->email,
                'Wallet balance' => number_format($user->wallet, 0, ',', '.'),
                'Created at' => $user->created_at->format('F j, Y'),
                'Last updated at' => $user->updated_at->format('F j, Y')
            ];
        });
    }

    /**
     * Get specific user information by ID
     */
    public static function getUserInfo($id)
    {
        $user = self::find($id);
        
        if (!$user) {
            return null;
        }

        return [
            'ID' => $user->id,
            'Email' => $user->email,
            'Wallet balance' => number_format($user->wallet, 0, ',', '.'),
            'Created at' => $user->created_at->format('F j, Y'),
            'Last updated at' => $user->updated_at->format('F j, Y')
        ];
    }

    /**
     * Kiểm tra số dư ví có đủ không
     */
    public function hasSufficientFunds(float $amount): bool
    {
        return $this->wallet >= $amount;
    }

    /**
     * Trừ tiền từ ví
     */
    public function deductFromWallet(float $amount): bool
    {
        if (!$this->hasSufficientFunds($amount)) {
            return false;
        }
        
        $this->wallet -= $amount;
        return $this->save();
    }

    /**
     * Nạp tiền vào ví
     */
    public function addToWallet(float $amount): bool
    {
        $this->wallet += $amount;
        return $this->save();
    }

    public function withdrawals()
    {
        return $this->hasMany(Withdrawal::class);
    }
}