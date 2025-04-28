<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class UsersController extends Controller
{
    // Lấy danh sách tất cả người dùng
    public function index()
    {
        return User::all();
    }

    // Lấy chi tiết người dùng theo ID
    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng'], 404);
        }
        return $user;
    }

    // Xóa người dùng
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng'], 404);
        }

        $user->delete();
        return response()->json(['message' => 'Đã xóa người dùng']);
    }
    
    // Cập nhật thông tin cơ bản của người dùng
    public function update(Request $request, $id)
    {

        $tk = User::find($id);
        if (!$tk) {
            return response()->json(['message' => 'Không tìm thấy tài khoản'], 404);
        }

        $data = $request->validate([
            'email' => 'required|email|unique:users,email,'.$id,
            'wallet' => 'required|numeric|min:0',
        ]);

        $tk->update($data); 
        return response()->json($tk);
    }

    // Cập nhật ví (phiên bản đơn giản)
    // public function updateWallet(Request $request, $id)
    // {
    //     $request->validate([
    //         'wallet' => 'required|numeric|min:0'
    //     ]);

    //     $user = User::findOrFail($id);
    //     $user->wallet = $request->wallet;
    //     $user->save();
        
    //     return response()->json([
    //         'message' => 'Cập nhật ví thành công',
    //         'new_balance' => $user->wallet
    //     ]);
    // }

    // rut tien tu vi
    public function rutTien(Request $request)
    {
            $request->validate([
                'amount' => 'required|numeric|min:50000',
                'momo_account' => 'required|string'
            ]);

            $user = $request->user();
            $amount = $request->amount;

            // Kiểm tra số dư
            if ($user->wallet < $amount) {
                return response()->json([
                    'success' => false,
                    'message' => 'Số dư ví không đủ'
                ], 400);
            }

            // Bắt đầu transaction
            DB::beginTransaction();

            try {
                // Trừ tiền trong ví
                $user->wallet -= $amount;
                $user->save();

                DB::commit();

                return response()->json([
                    'success' => true,
                    'new_balance' => $user->wallet,
                    'message' => 'Yêu cầu rút tiền thành công'
                ]);

            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Rút tiền thất bại: ' . $e->getMessage()
                ], 500);
            }
    }
}