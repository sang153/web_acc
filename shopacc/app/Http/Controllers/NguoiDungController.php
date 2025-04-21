<?php

namespace App\Http\Controllers;

use App\Models\NguoiDung;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class NguoiDungController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'TenDangNhap' => 'required|unique:nguoidung',
            'MatKhau' => 'required|min:6',
            'Email' => 'required|email|unique:nguoidung',
        ]);

        $user = NguoiDung::create([
            'TenDangNhap' => $request->TenDangNhap,
            'MatKhau' => Hash::make($request->MatKhau),
            'Email' => $request->Email,
            'VaiTro' => 0, // Mặc định là user
        ]);

        return response()->json(['message' => 'Đăng ký thành công!', 'user' => $user], 201);
    }

    public function login(Request $request) {
        $user = NguoiDung::where('TenDangNhap', $request->TenDangNhap)->first();
      
        if (!$user || !Hash::check($request->MatKhau, $user->MatKhau)) {
          return response()->json(['message' => 'Tên đăng nhập hoặc mật khẩu không đúng!'], 401);
        }
      
        $token = $user->createToken('auth_token')->plainTextToken;
      
        return response()->json([
          'access_token' => $token,
          'token_type' => 'Bearer',
          'user' => [
            'MaNguoiDung' => $user->MaNguoiDung,
            'TenDangNhap' => $user->TenDangNhap,
            'Email' => $user->Email,
            'VaiTro' => $user->VaiTro, // Quan trọng: phải có trường này
          ]
        ]);
      }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Đăng xuất thành công!']);
    }

    // Chỉ admin mới được xem danh sách người dùng
    public function index()
    {
        if (Auth::user()->VaiTro !== 1) {
            return response()->json(['message' => 'Không có quyền truy cập!'], 403);
        }
        return response()->json(NguoiDung::all());
    }

    public function show($id)
    {
        return response()->json(NguoiDung::findOrFail($id));
    }
}