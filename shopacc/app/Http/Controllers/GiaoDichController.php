<?php

namespace App\Http\Controllers;

use App\Models\GiaoDich;
use App\Models\TaiKhoan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class GiaoDichController extends Controller
{
    public function muaTaiKhoan(Request $request, $id)
    {
        DB::beginTransaction();
        
        try {
            $request->validate(['phuong_thuc' => 'sometimes|string']);

            $user = Auth::user();
            $taiKhoan = TaiKhoan::findOrFail($id);
            
            if ($taiKhoan->DaBan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tài khoản đã được bán'
                ], 400);
            }
            
            $phiGiaoDich = $taiKhoan->GiaBan * 0.1; // Ví dụ: phí 10%
            $tongThanhToan = $taiKhoan->GiaBan + $phiGiaoDich;

            if ($user->wallet < $tongThanhToan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Số dư ví không đủ (cần: '.number_format($tongThanhToan).' VND)'
                ], 400);
            }
            
            // Trừ tiền người mua (bao gồm phí)
            $user->wallet -= $tongThanhToan;
            $user->save();
            
            // Cộng tiền cho người bán (chỉ giá bán, không bao gồm phí)
            if ($taiKhoan->MaNguoiDung) {
                $nguoiBan = User::find($taiKhoan->MaNguoiDung);
                $nguoiBan->wallet += $taiKhoan->GiaBan;
                $nguoiBan->save();
            }
            
            $taiKhoan->DaBan = true;
            $taiKhoan->save();
            
            $giaoDich = GiaoDich::create([
                'MaTaiKhoan' => $taiKhoan->MaTaiKhoan,
                'MaNguoiDungMua' => $user->id,
                'MaNguoiDungBan' => $taiKhoan->MaNguoiDung,
                'TongTien' => $taiKhoan->GiaBan,
                'PhiGiaoDich' => $phiGiaoDich,
                'PhuongThucThanhToan' => $request->phuong_thuc ?? 'Ví điện tử',
                'TrangThai' => GiaoDich::THANH_CONG,
                'NgayGiaoDich' => now(),
            ]);
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Mua tài khoản thành công',
                'taiKhoan' => [
                    'TenTaiKhoan' => $taiKhoan->TenTaiKhoan,
                    'MatKhau' => $taiKhoan->MatKhau,
                    'ThongTinThem' => $taiKhoan->MoTa
                ],
                'soDuConLai' => $user->wallet
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xử lý giao dịch: ' . $e->getMessage()
            ], 500);
        }
    }
}