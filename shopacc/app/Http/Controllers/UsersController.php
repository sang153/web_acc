<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class UsersController extends Controller
{
    // Lấy danh sách tất cả tài khoản
    public function index()
    {
        return User::all();
    }

    
    // Lấy chi tiết tài khoản theo ID
    public function show($id)
    {
        $tk = User::find($id);
        if (!$tk) {
            return response()->json(['message' => 'Không tìm thấy tài khoản'], 404);
        }
        return $tk;
    }

    // Cập nhật tài khoản
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

    // Xóa tài khoản
    public function destroy($id)
    {
        $tk = User::find($id);
        if (!$tk) {
            return response()->json(['message' => 'Không tìm thấy tài khoản'], 404);
        }

        $tk->delete();
        return response()->json(['message' => 'Đã xóa tài khoản']);
    }
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
