<?php


use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;

// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/verify-email/{userId}/{token}', [AuthController::class, 'verifyEmail']);

// Routes protégées (auth + actif)
Route::middleware(['auth:sanctum', 'actif'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/verify-phone', [AuthController::class, 'verifyPhone']);
    Route::post('/send-phone-verification', [AuthController::class, 'sendPhoneVerification']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    // Routes d'admin
    Route::middleware('role:administrateur')->prefix('admin')->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['data' => 'Dashboard Admin']);
        });

        // Activer/Désactiver utilisateurs
        Route::post('/utilisateurs/{id}/activer', [AuthController::class, 'activerUtilisateur']);
        Route::post('/utilisateurs/{id}/desactiver', [AuthController::class, 'desactiverUtilisateur']);
    });

    // Routes de vendeur
    Route::middleware('role:vendeur')->prefix('vendeur')->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['data' => 'Dashboard Vendeur']);
        });
    });

    // Routes de acheteur
    Route::middleware('role:acheteur')->prefix('acheteur')->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['data' => 'Dashboard Acheteur']);
        });
    });
});
