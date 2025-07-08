<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriePublicController;

use App\Http\Controllers\Admin\UtilisateurController;
use App\Http\Controllers\Admin\VendorController as AdminVendorController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\CategorieController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;

use App\Http\Controllers\Acheteur\OrderController as AcheteurOrderController;

use App\Http\Controllers\Vendor\ProduitController as VendorProduitController;
use App\Http\Controllers\Vendor\CommandeController as VendorCommandeController;
use App\Http\Controllers\Vendor\InvoiceController;
use App\Http\Controllers\Vendor\DashboardController;
use App\Http\Controllers\Vendor\CustomerController;
use App\Http\Controllers\Vendor\ReviewController as VendorReviewController;
use App\Http\Controllers\Vendor\AnalyticsController;
use App\Http\Controllers\Vendor\SettingsController;
use App\Http\Controllers\Vendor\PromotionController;
use App\Http\Controllers\CampagneController;

use App\Http\Controllers\AcheteurController;

use App\Http\Controllers\ProduitController;
use App\Http\Controllers\VendeurController;
use App\Http\Controllers\PanierController;
use App\Http\Controllers\PromotionPublicController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\ImageProduitController;
use App\Http\Controllers\GuestOrderController;

Route::get('/produits/getFeatured', [ProduitController::class, 'getFeatured']);
Route::get('/categories', [CategoriePublicController::class, 'index']);
Route::get('/categories/nom/{nom}', [CategoriePublicController::class, 'showByNom']);
Route::get('/categories/nom/{nom}/produits', [CategoriePublicController::class, 'getProduitsByNom']);
Route::get('/categories-avec-produits', [CategoriePublicController::class, 'categoriesAvecProduits']);
Route::get('/paiement-produit', [PaiementController::class, 'paiementProduit'])
    ->name('paiement.produit');

Route::get('/search/produits', [ProduitController::class, 'search']);
Route::get('/api/user', function () {
    return request()->user();
})->middleware('auth:sanctum');


// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/registervendeur', [AuthController::class, 'registervendeur']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/verify-email/{userId}/{token}', [AuthController::class, 'verifyEmail']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/update-password', [AuthController::class, 'updatePassword']);

// Routes pour les commandes anonymes
Route::post('/guest/orders', [GuestOrderController::class, 'store']);
Route::get('/guest/orders/{id}', [GuestOrderController::class, 'show']);

// Routes publiques - Produits et Catégories
Route::get('/produits', [ProduitController::class, 'index']);
Route::get('/produits/{id}', [ProduitController::class, 'show']);

// Routes publiques - Promotions
Route::get('/promotions', [PromotionPublicController::class, 'index']);
Route::get('/promotions/type/{type}', [PromotionPublicController::class, 'getByType']);
Route::get('/promotions/{id}', [PromotionPublicController::class, 'show']);

// Route pour récupérer l'utilisateur connecté
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json($request->user());
});

// Routes protégées par l'authentification
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/verify-phone', [AuthController::class, 'verifyPhone']);
    Route::post('/send-phone-verification', [AuthController::class, 'sendPhoneVerification']);

    // // Routes Admin
    // Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    //     Route::get('/dashboard', [DashboardController::class, 'index']);
    //     Route::get('/statistics', [DashboardController::class, 'getStatistics']);
    // });


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
        Route::post('/products/{id}/payment-link', [PaiementController::class, 'generateInternalLink']);

    });


    // Routes de recherche

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

    // Routes pour le dashboard admin
    // Routes Admin
    Route::prefix('administrateur')->middleware(['auth:sanctum', \App\Http\Middleware\AdminMiddleware::class])->group(function () {
        // Dashboard et statistiques
        Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index']);

        // campagnes coté admin 
        Route::get('/admin/campagnes', [CampagneController::class, 'adminIndex']);
        Route::put('/admin/campagnes/{campagne}/status', [CampagneController::class, 'updateStatus']);
       
        // Gestion des utilisateurs
        Route::get('/utilisateurs', [UtilisateurController::class, 'index']);
        Route::get('/utilisateurs/{id}', [UtilisateurController::class, 'show']);
        Route::put('/utilisateurs/{id}', [UtilisateurController::class, 'update']);
        Route::delete('/utilisateurs/{id}', [UtilisateurController::class, 'destroy']);
        Route::put('/utilisateurs/{id}/ban', [UtilisateurController::class, 'ban']);
        Route::put('/utilisateurs/{id}/unban', [UtilisateurController::class, 'unban']);

        // Gestion des vendeurs
        Route::get('/vendeurs/pending', [AdminVendorController::class, 'getPendingVendors']);
        Route::put('/vendeurs/{id}/approve', [AdminVendorController::class, 'approveVendor']);
        Route::put('/vendeurs/{id}/reject', [AdminVendorController::class, 'rejectVendor']);

        // Gestion des commandes
        Route::get('/commandes', [AdminOrderController::class, 'index']);
        Route::get('/commandes/{id}', [AdminOrderController::class, 'show']);
        Route::post('/commandes', [AdminOrderController::class, 'store']);
        Route::delete('/commandes/{id}', [AdminOrderController::class, 'cancel']);
        Route::put('/commandes/{id}/status', [AdminOrderController::class, 'updateStatus']);
        Route::get('/commandes/stats', [AdminController::class, 'getOrderStats']);
        Route::get('/stats', [AdminController::class, 'getStats']);
        Route::get('/statGenerale', [AdminController::class, 'dashboard']);
        // gestion categories
        Route::get('/categories', [CategorieController::class, 'index']);
        Route::post('/categories', [CategorieController::class, 'store']);
        Route::put('/categories/{id}', [CategorieController::class, 'update']);
        Route::delete('/categories/{id}', [CategorieController::class, 'destroy']);
        Route::get('/categories/{id}', [CategorieController::class, 'show']);


        // Gestion des produits
        Route::get('/produits', [ProductController::class, 'index']);
        Route::put('/produits/{id}', [ProductController::class, 'update']);
        Route::delete('/produits/{id}', [ProductController::class, 'destroy']);
        Route::get('commandes/stats', [AdminController::class, 'getOrderStats']);
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
        // campagnes
        Route::get('/campagnes', [CampagneController::class, 'index']);
        Route::post('/campagnes', [CampagneController::class, 'store']);
        Route::get('/campagnes/{campagne}', [CampagneController::class, 'show']);

        // Gestion des produits
        Route::get('/produits', [VendorProduitController::class, 'index']);
        Route::post('/produits', [VendorProduitController::class, 'store']);
        Route::get('/produits/{id}', [VendorProduitController::class, 'show']);
        Route::post('/produits/{id}', [VendorProduitController::class, 'update']);
        Route::delete('/produits/{id}', [VendorProduitController::class, 'destroy']);

        // Gestion des images des produits
        Route::prefix('produits')->group(function () {
            Route::post('/{id}/images', [ImageProduitController::class, 'store']);
            Route::delete('/images/{id}', [ImageProduitController::class, 'destroy']);
            Route::put('/{id}/images/reorder', [ImageProduitController::class, 'reorder']);
        });

        // Gestion des commandes du vendeur
        Route::get('/orders', [VendorCommandeController::class, 'index']);
        Route::get('/recent-orders', [VendorCommandeController::class, 'getRecentOrders']);
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



        Route::prefix('acheteur')->group(function () {
            Route::apiResource('orders', AcheteurOrderController::class)->only(['index', 'show', 'store']);
        });
    });

    // Routes pour les boutiques
    Route::get('/stores', [VendorController::class, 'index']);
    Route::get('/vendors/{id}', [VendorController::class, 'show']);
    Route::get('/vendors/{id}/products', [VendorController::class, 'products']);
});

