<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;  
use Illuminate\Http\Request;
use App\Models\Taikhoan;
use App\Models\User;

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
        $taikhoan->MaNguoiDungBan = auth()->id(); 
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
    public function muaTaiKhoan($id)
    {
        DB::beginTransaction();
        try {
            $user = auth()->user();
            $taiKhoan = Taikhoan::findOrFail($id);
            
            // Kiểm tra tài khoản đã bán chưa
            if ($taiKhoan->TrangThai == 1) {
                return response()->json([
                    'message' => 'Tài khoản đã được bán'
                ], 400);
            }
            
            // Kiểm tra số dư ví
            if ($user->wallet < $taiKhoan->GiaBan) {
                return response()->json([
                    'message' => 'Số dư ví không đủ'
                ], 400);
            }
            
            // Trừ tiền người mua
            $user->wallet -= $taiKhoan->GiaBan;
            $user->save();
            
            // Đánh dấu tài khoản đã bán
            $taiKhoan->TrangThai = 1;
            $taiKhoan->save();
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'taiKhoan' => [
                    'TenTaiKhoan' => $taiKhoan->TenTaiKhoan,
                    'MatKhauTaiKhoan' => $taiKhoan->MatKhauTaiKhoan
                ],
                'newBalance' => $user->wallet
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Lỗi giao dịch: ' . $e->getMessage()
            ], 500);
        }
    }
    
}
