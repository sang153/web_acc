<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);
    
        $user = User::create([
            'name' => '',
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']), // Mã hóa mật khẩu
        ]);
    
        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user
        ], 201);
    }
    public function login(Request $request)
    {
        \Log::info('Dữ liệu nhận được từ React:', $request->all());
    
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);
    
        $user = User::where('email', $request->email)->first();
    
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            \Log::warning('Đăng nhập thất bại:', ['email' => $request->email]);
            return response()->json(['message' => 'Email hoặc mật khẩu không chính xác'], 401);
        }
    
        \Log::info('Đăng nhập thành công với:', ['email' => $request->email]);
    
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'user' => $user,
            'token' => $token
        ], 200);
    }
}
