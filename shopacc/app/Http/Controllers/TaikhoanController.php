<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Taikhoan;

class TaikhoanController extends Controller
{
    // Lấy danh sách tất cả tài khoản
    public function index()
    {
        return Taikhoan::all();
    }

    // Thêm tài khoản mới
    public function store(Request $request)
    {
        $validated = $request->validate([
            'MaGame' => 'required|integer|exists:game,MaGame',
            'TenTaiKhoan' => 'required|string|max:150',
            'MatKhauTaiKhoan' => 'required|string|max:150',
            'MoTa' => 'nullable|string|max:150',
            'GiaBan' => 'required|numeric|min:0',
        ]);

        $taikhoan = new TaiKhoan();
        $taikhoan->MaGame = $validated['MaGame'];
        $taikhoan->MaNguoiDungBan = auth()->id(); // Lấy ID người dùng đăng nhập
        $taikhoan->TenTaiKhoan = $validated['TenTaiKhoan'];
        $taikhoan->MatKhauTaiKhoan = $validated['MatKhauTaiKhoan'];
        $taikhoan->MoTa = $validated['MoTa'] ?? null;
        $taikhoan->GiaBan = $validated['GiaBan'];
        $taikhoan->TrangThai = 0; // Chờ duyệt
        $taikhoan->save();

        return response()->json([
            'message' => 'Đăng bán tài khoản thành công, chờ quản trị viên duyệt',
            'data' => $taikhoan
        ], 201);
    }

    // Lấy chi tiết tài khoản theo ID
    public function show($id)
    {
        $tk = Taikhoan::find($id);
        if (!$tk) {
            return response()->json(['message' => 'Không tìm thấy tài khoản'], 404);
        }
        return $tk;
    }

    // Cập nhật tài khoản
    public function update(Request $request, $id)
    {
        $tk = Taikhoan::find($id);
        if (!$tk) {
            return response()->json(['message' => 'Không tìm thấy tài khoản'], 404);
        }

        $data = $request->validate([
            'MaGame' => 'nullable|integer',
            'MaNguoiDungBan' => 'nullable|integer',
            'TenTaiKhoan' => 'required|string|max:150',
            'MatKhauTaiKhoan' => 'required|string|max:150',
            'MoTa' => 'nullable|string|max:150',
            'GiaBan' => 'required|numeric',
            'TrangThai' => 'integer'
        ]);

        $tk->update($data);
        return response()->json($tk);
    }

    // Xóa tài khoản
    public function destroy($id)
    {
        $tk = Taikhoan::find($id);
        if (!$tk) {
            return response()->json(['message' => 'Không tìm thấy tài khoản'], 404);
        }

        $tk->delete();
        return response()->json(['message' => 'Đã xóa tài khoản']);
    }
    
}
