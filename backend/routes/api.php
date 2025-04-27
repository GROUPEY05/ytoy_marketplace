<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriePublicController;

use App\Http\Controllers\Admin\UtilisateurController;
use App\Http\Controllers\Admin\VendorController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\StatisticsController;


use App\Http\Controllers\Admin\CategorieController;

use App\Http\Controllers\Vendor\ProduitController;
use App\Http\Controllers\Vendor\OrderController as VendorOrderController;
use App\Http\Controllers\Vendor\InvoiceController;
use App\Http\Controllers\Vendor\DashboardController;

use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Acheteur\OrderController as AcheteurOrderController;
use App\Http\Controllers\Vendeur\OrderController as VendeurOrderController;



Route::get('/api/user', function () {
    return request()->user();
})->middleware('auth:sanctum');

// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/registervendeur', [AuthController::class, 'registervendeur']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/verify-email/{userId}/{token}', [AuthController::class, 'verifyEmail']);
Route::get('/categories', [CategoriePublicController::class, 'index']);

// Routes protégées (auth + actif)
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/verify-phone', [AuthController::class, 'verifyPhone']);
    Route::post('/send-phone-verification', [AuthController::class, 'sendPhoneVerification']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    
    // // Route pour les catégories (accessible à tous les utilisateurs authentifiés)
    // Route::get('/categories', [CategorieController::class, 'index']);

    // Routes d'admin
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['data' => 'Dashboard Admin']);
        });
        Route::apiResource('orders', AdminOrderController::class)->only(['index', 'show', 'update']);

        // Gestion des catégories
        Route::get('/categories', [CategorieController::class, 'index']);
        Route::get('/categories/{id}', [CategorieController::class, 'show']);
        Route::post('/categories', [CategorieController::class, 'store']);
        Route::put('/categories/{id}', [CategorieController::class, 'update']);
        Route::delete('/categories/{id}', [CategorieController::class, 'destroy']);
        
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
    Route::prefix('vendeur')->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['data' => 'Dashboard Vendeur']);
        });
    });
    
    // Routes complètes pour les vendeurs (intégrées depuis le second morceau)
    Route::prefix('vendor')->group(function () {
        // Gestion des produits
        Route::get('/produits', [ProduitController::class, 'index']);
        Route::get('/produits/create', [ProduitController::class, 'create']);
        Route::post('/produits', [ProduitController::class, 'store']);
        Route::get('/produits/{id}', [ProduitController::class, 'show']);
        Route::get('/produits/{id}/edit', [ProduitController::class, 'edit']);
        Route::put('/produits/{id}', [ProduitController::class, 'update']);
        Route::delete('/produits/{id}', [ProduitController::class, 'destroy']);
        Route::get('/categories', [CategorieController::class, 'index']);
        
        // Routes pour les commandes
        Route::get('/orders', [VendorOrderController::class, 'index']);
        Route::get('/orders/{id}', [VendorOrderController::class, 'show']);
        Route::put('/orders/{id}/status', [VendorOrderController::class, 'updateStatus']);
       
        
        // Routes pour les factures
        Route::get('/invoices', [InvoiceController::class, 'index']);
        Route::get('/invoices/{id}', [InvoiceController::class, 'show']);
        Route::get('/invoices/{id}/download', [InvoiceController::class, 'download']);
        
        // Route pour les statistiques du dashboard
        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    });
    
    // Routes de acheteur
    Route::prefix('acheteur')->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['data' => 'Dashboard Acheteur']);
        });

        Route::apiResource('orders', AcheteurOrderController::class)->only(['index', 'show', 'store']);
    });
});