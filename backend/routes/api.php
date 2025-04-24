<?php


use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\UtilisateurController;
use App\Http\Controllers\Admin\VendorController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\StatisticsController;


// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/registervendeur', [AuthController::class, 'registervendeur']);
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

        // Gestion utilisateurs
        Route::resource('utilisateurs', UtilisateurController::class);
        Route::post('utilisateurs/{user}/ban', [UtilisateurController::class, 'banUser'])->name('admin.users.ban');

        // Validation vendeurs
        Route::get('vendeurs/en-attente', [VendorController::class, 'pendingVendors'])->name('admin.vendors.pending');
        Route::post('vendeurs/{vendor}/approuver', [VendorController::class, 'approveVendor'])->name('admin.vendors.approve');
        Route::post('vendeurs/{vendor}/rejeter', [VendorController::class, 'rejectVendor'])->name('admin.vendors.reject');

        // Modération avis
        Route::resource('reviews', ReviewController::class);
        Route::post('reviews/{review}/approve', [ReviewController::class, 'approveReview'])->name('admin.reviews.approve');

        // Gestion commandes
        Route::resource('commandes', OrderController::class);
        Route::get('commandes/{order}/details', [OrderController::class, 'showDetails'])->name('admin.orders.details');

        // Statistiques
        Route::get('statistics', [StatisticsController::class, 'index'])->name('admin.statistics');

        // Activer/Désactiver utilisateurs
        Route::post('/utilisateurs/{id}/activer', [AuthController::class, 'activerUtilisateur']);
        Route::post('/utilisateurs/{id}/desactiver', [AuthController::class, 'desactiverUtilisateur']);

        // Routes de gestion des vendeurs
        Route::get('/vendeurs/en-attente', [AuthController::class, 'getVendeursEnAttente']);
        Route::post('/vendeurs/{id}/approuver', [AuthController::class, 'approuverVendeur']);
        Route::post('/vendeurs/{id}/rejeter', [AuthController::class, 'rejeterVendeur']);
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
