<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriePublicController;

use App\Http\Controllers\Admin\UtilisateurController;
use App\Http\Controllers\Admin\VendorController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\StatisticsController;
use App\Http\Controllers\PanierController;

use App\Http\Controllers\Admin\CategorieController;

use App\Http\Controllers\Vendor\ProduitController;
use App\Http\Controllers\Vendor\CommandeController as VendorCommandeController;
use App\Http\Controllers\Vendor\InvoiceController;
use App\Http\Controllers\Vendor\DashboardController;
use App\Http\Controllers\Vendor\CustomerController;
use App\Http\Controllers\Vendor\ReviewController as VendorReviewController;
use App\Http\Controllers\Vendor\AnalyticsController;
use App\Http\Controllers\Vendor\SettingsController;
use App\Http\Controllers\Vendor\PromotionController;
use App\Http\Controllers\PromotionPublicController;

use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Acheteur\OrderController as AcheteurOrderController;

use App\Http\Controllers\PaiementController;
use App\Http\Controllers\ImageProduitController;

Route::get('/produits/featured', [ProduitController::class, 'featured']);

Route::get('/api/user', function () {
    return request()->user();
})->middleware('auth:sanctum');

// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/registervendeur', [AuthController::class, 'registervendeur']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/verify-email/{userId}/{token}', [AuthController::class, 'verifyEmail']);

// Routes publiques - Produits et Catégories
Route::get('/produits', [ProduitController::class, 'index']);
Route::get('/produits/{id}', [ProduitController::class, 'show']);
Route::get('/produits/featured', [ProduitController::class, 'getFeatured']);
Route::get('/categories', [CategoriePublicController::class, 'index']);
Route::get('/categories/{id}', [CategoriePublicController::class, 'show']);
Route::get('/categories/{id}/produits', [CategoriePublicController::class, 'getProduits']);

// Routes publiques - Promotions
Route::get('/promotions', [PromotionPublicController::class, 'index']);
Route::get('/promotions/type/{type}', [PromotionPublicController::class, 'getByType']);
Route::get('/promotions/{id}', [PromotionPublicController::class, 'show']);

// Routes protégées (auth + actif)
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/verify-phone', [AuthController::class, 'verifyPhone']);
    Route::post('/send-phone-verification', [AuthController::class, 'sendPhoneVerification']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    
    // Routes du panier
    Route::get('/panier', [PanierController::class, 'index']);
    Route::get('/cart/count', [PanierController::class, 'getCount']);
    Route::post('/panier/add', [PanierController::class, 'add']);
    Route::put('/panier/update', [PanierController::class, 'update']);
    Route::delete('/panier/remove/{productId}', [PanierController::class, 'remove']);
    Route::delete('/panier/clear', [PanierController::class, 'clear']);
    Route::post('/panier/checkout', [PanierController::class, 'checkout']);
    Route::get('/panier/orders', [PanierController::class, 'orders']);
    
    // Route directe pour les commandes
    Route::get('/orders', [PanierController::class, 'orders']);

    // Routes de paiement
    Route::prefix('payment')->group(function () {
        Route::post('/process', [PaiementController::class, 'process']);
        Route::post('/verify', [PaiementController::class, 'verify']);
        Route::get('/status/{orderId}', [PaiementController::class, 'getStatus']);
        Route::post('/mobile-money', [PaiementController::class, 'simulateMobileMoney']);
        Route::post('/orange-money', [PaiementController::class, 'simulateOrangeMoney']);
    });

    // Routes de recherche
    Route::get('/search/produits', [ProduitController::class, 'search']);
    Route::get('/search/categories', [CategoriePublicController::class, 'search']);

    // Routes des avis
    Route::prefix('reviews')->group(function () {
        Route::post('/{productId}', [ReviewController::class, 'store']);
        Route::put('/{reviewId}', [ReviewController::class, 'update']);
        Route::delete('/{reviewId}', [ReviewController::class, 'destroy']);
    });

    // Routes du profil utilisateur
    Route::prefix('profile')->group(function () {
        Route::get('/', [AuthController::class, 'profile']);
        Route::put('/', [AuthController::class, 'updateProfile']);
        Route::put('/password', [AuthController::class, 'updatePassword']);
        Route::post('/avatar', [AuthController::class, 'updateAvatar']);
    });

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
    // Routes de vendeur avec middleware d'authentification et de rôle
    Route::prefix('vendor')->middleware(['auth:sanctum'])->group(function () {
        Route::get('/dashboard', function () {
            if (Gate::denies('is-vendeur')) {
                abort(403, 'Access denied. You are not a vendor.');
            }

            return view('vendor.dashboard');
        });
        
        // Gestion des produits
        Route::get('/produits', [ProduitController::class, 'index']);
        Route::post('/produits', [ProduitController::class, 'store']);
        Route::post('/produits/{id}', [ProduitController::class, 'update']);
        Route::delete('/produits/{id}', [ProduitController::class, 'destroy']);

        // Gestion des images des produits
        Route::prefix('produits')->group(function () {
            Route::post('/{id}/images', [ImageProduitController::class, 'store']);
            Route::delete('/images/{id}', [ImageProduitController::class, 'destroy']);
            Route::put('/{id}/images/reorder', [ImageProduitController::class, 'reorder']);
        });

        // Gestion des commandes du vendeur
        Route::get('/orders', [VendorCommandeController::class, 'index']);
        Route::get('/orders/{id}', [VendorCommandeController::class, 'show']);
        Route::put('/orders/{id}/status', [VendorCommandeController::class, 'updateStatus']);

        // Gestion des factures
        Route::prefix('invoices')->group(function () {
            Route::get('/', [InvoiceController::class, 'index']);
            Route::get('/{id}', [InvoiceController::class, 'show']);
            Route::post('/{orderId}/generate', [InvoiceController::class, 'generate']);
            Route::get('/{id}/download', [InvoiceController::class, 'download']);
        });

        // Dashboard vendeur
        Route::prefix('dashboard')->group(function () {
            Route::get('/stats', [DashboardController::class, 'getStats']);
            Route::get('/recent-orders', [DashboardController::class, 'getRecentOrders']);
            Route::get('/top-products', [DashboardController::class, 'getTopProducts']);
            Route::get('/revenue', [DashboardController::class, 'getRevenue']);
        });
        
        // Route pour les statistiques globales (pour compatibilité avec le frontend existant)
        Route::get('/stats', [DashboardController::class, 'getStats']);
        
        // Routes pour les clients
        Route::get('/customers', [CustomerController::class, 'index']);
        Route::get('/customers/{id}', [CustomerController::class, 'show']);
        
        // Routes pour les avis
        Route::get('/reviews', [VendorReviewController::class, 'index']);
        Route::post('/reviews/{id}/reply', [VendorReviewController::class, 'reply']);
        
        // Routes pour les statistiques
        Route::get('/analytics', [AnalyticsController::class, 'index']);
        
        // Routes pour les paramètres
        Route::get('/settings', [SettingsController::class, 'index']);
        Route::post('/settings', [SettingsController::class, 'update']);
        
        // Routes pour les promotions
        Route::get('/promotions', [PromotionController::class, 'index']);
        Route::post('/promotions', [PromotionController::class, 'store']);
        Route::get('/promotions/{id}', [PromotionController::class, 'show']);
        Route::put('/promotions/{id}', [PromotionController::class, 'update']);
        Route::delete('/promotions/{id}', [PromotionController::class, 'destroy']);
        Route::put('/promotions/{id}/toggle-status', [PromotionController::class, 'toggleStatus']);
    });
    
    // Routes acheteur
    Route::middleware(['auth:sanctum', 'role:acheteur'])->group(function () {
        Route::get('/dashboard', function () {
            if (Gate::denies('is-acheteur')) {
                return response()->json(['error' => 'Access denied. You are not a buyer.'], 403);
            }
            return response()->json(['message' => 'Acheteur Dashboard', 'status' => 'success']);
        });

        Route::prefix('orders')->group(function () {
            Route::get('/', [OrderController::class, 'index']);
            Route::post('/create', [OrderController::class, 'store']);
            Route::get('/{id}', [OrderController::class, 'show']);
            Route::post('/{id}/cancel', [OrderController::class, 'cancel']);
            Route::put('/{id}/status', [OrderController::class, 'updateStatus']);
        });

        Route::prefix('acheteur')->group(function () {
            Route::apiResource('orders', AcheteurOrderController::class)->only(['index', 'show', 'store']);
        });
    });
});