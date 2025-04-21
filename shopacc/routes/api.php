<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaikhoanController;
use App\Http\Controllers\NguoiDungController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/taikhoan', [TaiKhoanController::class, 'store']);
});

/*======================================================*/  
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);


       // Lấy tất cả tài khoản
Route::post('/taikhoan', [TaikhoanController::class, 'store']);        // Thêm tài khoản mới
Route::get('/taikhoan/{id}', [TaikhoanController::class, 'show']);     // Xem 1 tài khoản
Route::put('/taikhoan/{id}', [TaikhoanController::class, 'update']);   // Cập nhật tài khoản
Route::delete('/taikhoan/{id}', [TaikhoanController::class, 'destroy']); // Xóa tài khoản

Route::middleware('api')->group(function () {
    // Endpoint để lấy danh sách tài khoản đã duyệt, công khai
    Route::get('/taikhoan', [TaiKhoanController::class, 'index']);
});




Route::post('/register', [NguoiDungController::class, 'register']);
Route::post('/login', [NguoiDungController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [NguoiDungController::class, 'me']);
    Route::post('/logout', [NguoiDungController::class, 'logout']);
    Route::get('/users', [NguoiDungController::class, 'index']); // Chỉ admin
    Route::get('/users/{id}', [NguoiDungController::class, 'show']);
});
