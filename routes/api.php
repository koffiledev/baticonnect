<?php


use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminAuthController;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

//auth admin
Route::post('/admin/login', [AdminAuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {
    
    //route de basculement de client vers artisan
    Route::post('/user/switch-mode', [AuthController::class, 'switchToArtisan']);

    //route de création d'un admin
    Route::middleware(['role:3'])->prefix('admin')->group(function () {
        Route::post('/create-account', [AdminAuthController::class, 'store']);
    });
    
});
