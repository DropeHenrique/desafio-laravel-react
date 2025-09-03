<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SongController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Rotas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rotas de músicas públicas
Route::get('/songs', [SongController::class, 'index']);
Route::post('/songs', [SongController::class, 'store']);

// Rotas protegidas por autenticação
Route::middleware('auth:sanctum')->group(function () {
    // Autenticação
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Listar músicas pendentes (deve vir antes de /songs/{id})
    Route::get('/songs/pending', [SongController::class, 'pending']);
    
    // CRUD de músicas (apenas usuários autenticados)
    Route::get('/songs/{id}', [SongController::class, 'show']);
    Route::put('/songs/{id}', [SongController::class, 'update']);
    Route::delete('/songs/{id}', [SongController::class, 'destroy']);
    
    // Aprovação/reprovação de músicas
    Route::post('/songs/{id}/approve', [SongController::class, 'approve']);
    Route::post('/songs/{id}/reject', [SongController::class, 'reject']);
});
