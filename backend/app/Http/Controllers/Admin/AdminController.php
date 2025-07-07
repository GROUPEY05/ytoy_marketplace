<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use App\Models\Vendeur;
use App\Models\Produit;
use App\Models\Commande;
use App\Models\Categorie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Carbon;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    use AuthorizesRequests;

    public function __construct()
    {
       
    }

    // Gestion des produits
    public function index()
    {
        try {
            $products = Produit::with(['vendeur', 'categorie'])
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $products
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des produits',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function activateProduct($id)
    {
        try {
            $product = Produit::findOrFail($id);
            $product->actif = true;
            $product->save();

            return response()->json([
                'success' => true,
                'message' => 'Produit activé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'activation du produit',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deactivateProduct($id)
    {
        try {
            $product = Produit::findOrFail($id);
            $product->actif = false;
            $product->save();

            return response()->json([
                'success' => true,
                'message' => 'Produit désactivé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la désactivation du produit',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Gestion des catégories
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nom' => 'required|string|max:255',
                'description' => 'nullable|string'
            ]);

            $category = Categorie::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Catégorie créée avec succès',
                'data' => $category
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la catégorie',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $category = Categorie::findOrFail($id);
            
            $validated = $request->validate([
                'nom' => 'required|string|max:255',
                'description' => 'nullable|string'
            ]);

            $category->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Catégorie mise à jour avec succès',
                'data' => $category
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de la catégorie',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $category = Categorie::findOrFail($id);
            $category->delete();

            return response()->json([
                'success' => true,
                'message' => 'Catégorie supprimée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de la catégorie',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Gestion des commandes
    public function getAllOrders()
    {
        try {
            $orders = Commande::with(['utilisateur', 'produits'])
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $orders
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des commandes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getOrder($id)
    {
        try {
            $order = Commande::with(['utilisateur', 'produits'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $order
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de la commande',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateOrderStatus(Request $request, $id)
    {
        try {
            $order = Commande::findOrFail($id);
            
            $validated = $request->validate([
                'status' => 'required|string|in:en_attente,en_cours,expedie,livre,annule'
            ]);

            $order->status = $validated['status'];
            $order->save();

            return response()->json([
                'success' => true,
                'message' => 'Statut de la commande mis à jour avec succès',
                'data' => $order
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du statut de la commande',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Gestion des vendeurs
    public function getPendingVendors()
    {
        try {
            $pendingVendors = Utilisateur::where('role', 'vendeur')
                ->whereHas('vendeur', function($query) {
                    $query->where('verifie', false);
                })
                ->with('vendeur')
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'nom' => $user->nom,
                        'prenom' => $user->prenom,
                        'email' => $user->email,
                        'telephone' => $user->telephone,
                        'date_inscription' => $user->created_at->format('Y-m-d'),
                        'boutique' => $user->vendeur ? [
                            'nom' => $user->vendeur->nom_boutique,
                            'description' => $user->vendeur->description,
                            'adresse' => $user->vendeur->adresse
                        ] : null
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $pendingVendors
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des vendeurs en attente',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function approveVendor($id)
    {
        try {
            $vendor = Utilisateur::where('role', 'vendeur')
                ->whereHas('vendeur')
                ->findOrFail($id);

            $vendor->vendeur->verifie = true;
            $vendor->vendeur->save();

            // Envoyer un email de confirmation au vendeur
            // TODO: Implémenter l'envoi d'email

            return response()->json([
                'success' => true,
                'message' => 'Vendeur approuvé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'approbation du vendeur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function rejectVendor($id)
    {
        try {
            $vendor = Utilisateur::where('role', 'vendeur')
                ->whereHas('vendeur')
                ->findOrFail($id);

            // Supprimer le profil vendeur
            $vendor->vendeur->delete();

            // Changer le rôle en acheteur
            $vendor->role = 'acheteur';
            $vendor->save();

            // Envoyer un email d'information au vendeur
            // TODO: Implémenter l'envoi d'email

            return response()->json([
                'success' => true,
                'message' => 'Vendeur rejeté avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du rejet du vendeur',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function getAllProducts()
    {
        try {
            $products = Produit::with(['vendeur', 'categorie'])
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $products
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des produits',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Removed duplicate method to resolve redeclaration error

    // Removed duplicate deleteProduct method to resolve redeclaration error

    public function getStats()
    {
        try {
            $stats = [
                'utilisateurs' => [
                    'total' => Utilisateur::count(),
                    'acheteurs' => Utilisateur::where('role', 'acheteur')->count(),
                    'vendeurs' => Utilisateur::where('role', 'vendeur')->count(),
                    'admins' => Utilisateur::where('role', 'administrateur')->count(),
                    'nouveaux_aujourdhui' => Utilisateur::whereDate('created_at', Carbon::today())->count(),
                    'actifs' => Utilisateur::where('actif', true)->count(),
                    'inactifs' => Utilisateur::where('actif', false)->count()
                ],
                'vendeurs' => [
                    'total' => Utilisateur::where('role', 'vendeur')->count(),
                    'en_attente' => Utilisateur::where('role', 'vendeur')
                        ->whereHas('vendeur', function($q) {
                            $q->where('verifie', false);
                        })->count(),
                    'verifies' => Utilisateur::where('role', 'vendeur')
                        ->whereHas('vendeur', function($q) {
                            $q->where('verifie', true);
                        })->count(),
                ],
                'produits' => [
                    'total' => Produit::count(),
                    'actifs' => Produit::where('actif', true)->count(),
                    'inactifs' => Produit::where('actif', false)->count(),
                    'rupture_stock' => Produit::where('quantite_stock', 0)->count(),
                ],
                'commandes' => [
                    'total' => Commande::count(),
                    'aujourd_hui' => Commande::whereDate('created_at', Carbon::today())->count(),
                    'en_attente' => Commande::where('statut', 'en_attente')->count(),
                    'en_cours' => Commande::where('statut', 'en_cours')->count(),
                    'expediees' => Commande::where('statut', 'expedie')->count(),
                    'livrees' => Commande::where('statut', 'livre')->count(),
                    'annulees' => Commande::where('statut', 'annule')->count(),
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getOrderStats()
    {
        try {
            $monthlyStats = Commande::selectRaw('MONTH(created_at) as month, COUNT(*) as count, SUM(montant_total) as total')
                ->whereYear('created_at', Carbon::now()->year)
                ->groupBy('month')
                ->get();

            $statusStats = Commande::selectRaw('statut, COUNT(*) as count')
                ->groupBy('statut')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'monthly' => $monthlyStats,
                    'by_status' => $statusStats
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques des commandes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function suspendVendor($id)
    {
        try {
            $vendor = Utilisateur::where('role', 'vendeur')
                ->whereHas('vendeur')
                ->findOrFail($id);

            $vendor->vendeur->suspend();

            return response()->json([
                'success' => true,
                'message' => 'Vendeur suspendu avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suspension du vendeur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function reactivateVendor($id)
    {
        try {
            $vendor = Utilisateur::where('role', 'vendeur')
                ->whereHas('vendeur')
                ->findOrFail($id);

            $vendor->vendeur->activate();

            return response()->json([
                'success' => true,
                'message' => 'Vendeur réactivé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la réactivation du vendeur',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    

    /**
     * Affiche les données du tableau de bord administrateur
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function dashboard()
    {
        try {
            // Statistiques générales
            $stats = [
                'utilisateurs' => [
                    'total' => Utilisateur::count(),
                    'acheteurs' => Utilisateur::where('role', 'acheteur')->count(),
                    'vendeurs' => Utilisateur::where('role', 'vendeur')->count(),
                    'admins' => Utilisateur::where('role', 'administrateur')->count(),
                    'nouveaux_aujourdhui' => Utilisateur::whereDate('created_at', Carbon::today())->count(),
                    'actifs' => Utilisateur::where('actif', true)->count(),
                    'inactifs' => Utilisateur::where('actif', false)->count()
                ],
                'vendeurs' => [
                    'total' => Utilisateur::where('role', 'vendeur')->count(),
                    'en_attente' => Utilisateur::where('role', 'vendeur')
                        ->whereHas('vendeur', function($q) {
                            $q->where('verifie', false);
                        })->count(),
                    'verifies' => Utilisateur::where('role', 'vendeur')
                        ->whereHas('vendeur', function($q) {
                            $q->where('verifie', true);
                        })->count(),
                    'actifs' => Utilisateur::where('role', 'vendeur')
                        ->whereHas('vendeur', function($q) {
                            $q->where('statut', 'actif');
                        })->count(),
                    'suspendus' => Utilisateur::where('role', 'vendeur')
                        ->whereHas('vendeur', function($q) {
                            $q->where('statut', 'suspendu');
                        })->count()
                ],
                'produits' => [
                    'total' => Produit::count(),
                    'actifs' => Produit::where('actif', true)->count(),
                    'inactifs' => Produit::where('actif', false)->count(),
                    'rupture_stock' => Produit::where('quantite_stock', 0)->count(),
                    'par_categorie' => Categorie::withCount('produits')->get()->pluck('produits_count', 'nom')
                ],
                'commandes' => [
                    'total' => Commande::count(),
                    'aujourd_hui' => Commande::whereDate('created_at', Carbon::today())->count(),
                    'en_attente' => Commande::where('statut', 'en_attente')->count(),
                    'en_cours' => Commande::where('statut', 'en_cours')->count(),
                    'expediees' => Commande::where('statut', 'expedie')->count(),
                    'livrees' => Commande::where('statut', 'livre')->count(),
                    'annulees' => Commande::where('statut', 'annule')->count(),
                    'montant_total' => Commande::where('statut', 'livre')->sum('montant_total'),
                    'montant_aujourd_hui' => Commande::whereDate('created_at', Carbon::today())->sum('montant_total')
                ]
            ];

            // Commandes récentes
            $recentOrders = Commande::with(['utilisateur', 'produits'])
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get()
                ->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'client' => $order->utilisateur ? [
                            'id' => $order->utilisateur->id,
                            'nom' => $order->utilisateur->nom,
                            'prenom' => $order->utilisateur->prenom,
                            'email' => $order->utilisateur->email
                        ] : null,
                        'montant_total' => $order->montant_total,
                        'statut' => $order->status,
                        'date' => $order->created_at->format('Y-m-d H:i:s'),
                        'produits' => $order->produits->map(function ($produit) {
                            return [
                                'id' => $produit->id,
                                'nom' => $produit->nom,
                                'quantite' => $produit->pivot->quantite,
                                'prix_unitaire' => $produit->pivot->prix_unitaire
                            ];
                        })
                    ];
                });

            // Vendeurs en attente
            $pendingVendors = Utilisateur::where('role', 'vendeur')
                ->whereHas('vendeur', function($query) {
                    $query->where('verifie', false);
                })
                ->with('vendeur')
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'nom' => $user->nom,
                        'prenom' => $user->prenom,
                        'email' => $user->email,
                        'telephone' => $user->telephone,
                        'date_inscription' => $user->created_at->format('Y-m-d'),
                        'boutique' => $user->vendeur ? [
                            'nom' => $user->vendeur->nom_boutique,
                            'description' => $user->vendeur->description,
                            'ville' => $user->vendeur->ville,
                            'adresse' => $user->vendeur->adresse,
                            'siret' => $user->vendeur->siret
                        ] : null
                    ];
                });

            // Produits récents
            $recentProducts = Produit::with(['vendeur', 'categorie'])
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get()
                ->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'nom' => $product->nom,
                        'description' => $product->description,
                        'prix' => $product->prix,
                        'quantite_stock' => $product->quantite_stock,
                        'actif' => $product->actif,
                        'date_ajout' => $product->created_at->format('Y-m-d H:i:s'),
                        'vendeur' => $product->vendeur ? [
                            'id' => $product->vendeur->id,
                            'nom_boutique' => $product->vendeur->nom_boutique
                        ] : null,
                        'categorie' => $product->categorie ? [
                            'id' => $product->categorie->id,
                            'nom' => $product->categorie->nom
                        ] : null
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => [
                    'stats' => $stats,
                    'recent_orders' => $recentOrders,
                    'pending_vendors' => $pendingVendors,
                    'recent_products' => $recentProducts
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des données du tableau de bord',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Removed duplicate method to resolve redeclaration error

    // Méthode ajoutée pour correspondre à la route api/admin/vendeurs/en-attente
    public function getVendorsEnAttente()
    {
        try {
            // Récupérer les vendeurs avec leurs informations utilisateur
            $pendingVendors = Utilisateur::where('role', 'vendeur')
                ->with(['vendeur' => function($query) {
                    $query->where('verifie', false);
                }])
                ->get();

            return response()->json($pendingVendors);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la récupération des vendeurs: ' . $e->getMessage()], 500);
        }
    }

    // Removed duplicate approveVendor method to resolve redeclaration error

    public function disableVendor($id)
    {
        $this->authorize('manageVendors', Utilisateur::class);

        $vendor = Vendeur::findOrFail($id);
        $vendor->verifie = false;
        $vendor->save();

        return response()->json(['message' => 'Vendeur désactivé avec succès']);
    }

    // Reste du code inchangé...
    
    // Removed duplicate method to resolve redeclaration error

    public function getProducts()
    {
        $this->authorize('manageProducts', Utilisateur::class);

        try {
            $products = Produit::with(['vendeur', 'categorie', 'images'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'nom' => $product->nom,
                        'prix' => $product->prix,
                        'quantite_stock' => $product->quantite_stock,
                        'image_url' => $product->images->first() ? $product->images->first()->url : null,
                        'vendeur' => [
                            'id' => $product->vendeur->id,
                            'nom_boutique' => $product->vendeur->nom_boutique
                        ],
                        'categorie' => [
                            'id' => $product->categorie->id,
                            'nom' => $product->categorie->nom
                        ],
                        'active' => $product->active
                    ];
                });

            return response()->json($products);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la récupération des produits'], 500);
        }
    }

    public function getProduct($id)
    {
        $this->authorize('manageProducts', Utilisateur::class);

        try {
            $product = Produit::with(['vendeur', 'categorie', 'images'])->findOrFail($id);
            return response()->json($product);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Produit non trouvé'], 404);
        }
    }

    public function createProduct(Request $request)
    {
        $this->authorize('manageProducts', Utilisateur::class);

        try {
            $validated = $request->validate([
                'nom' => 'required|string|max:255',
                'description' => 'required|string',
                'prix' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'categorie_id' => 'required|exists:categories,id',
                'vendeur_id' => 'required|exists:vendeurs,id'
            ]);

            $product = Produit::create($validated);
            return response()->json($product, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la création du produit'], 500);
        }
    }

    public function updateProduct(Request $request, $id)
    {
        $this->authorize('manageProducts', Utilisateur::class);

        try {
            $product = Produit::findOrFail($id);
            
            $validated = $request->validate([
                'nom' => 'string|max:255',
                'description' => 'string',
                'prix' => 'numeric|min:0',
                'stock' => 'integer|min:0',
                'categorie_id' => 'exists:categories,id',
                'active' => 'boolean'
            ]);

            $product->update($validated);
            return response()->json($product);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la mise à jour du produit'], 500);
        }
    }

    public function deleteProduct($id)
    {
        $this->authorize('manageProducts', Utilisateur::class);

        try {
            $product = Produit::findOrFail($id);
            $product->delete();
            return response()->json(['message' => 'Produit supprimé avec succès']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la suppression du produit'], 500);
        }
    }

    public function getStatistics()
    {
        $this->authorize('viewStatistics', Utilisateur::class);

        try {
            $total_users = Utilisateur::count();
            $total_vendors = Utilisateur::where('role', 'vendeur')->count();
            $total_products = Produit::count();
            $total_orders = Commande::count();
            $total_revenue = Commande::where('statut', 'completed')->sum('montant_total');

            // Calcul des statistiques supplémentaires
            $new_users_today = Utilisateur::whereDate('created_at', Carbon::today())->count();
            $orders_pending = Commande::where('statut', 'en_attente')->count();

            return response()->json([
                'total_users' => $total_users,
                'total_vendors' => $total_vendors,
                'total_products' => $total_products,
                'total_orders' => $total_orders,
                'total_revenue' => $total_revenue,
                'new_users_today' => $new_users_today,
                'orders_pending' => $orders_pending
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la récupération des statistiques'], 500);
        }
    }

    public function getRecentOrders()
    {
        $this->authorize('manageOrders', User::class);

        try {
            $orders = Commande::with(['user', 'produits'])
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get()
                ->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'customer' => $order->user ? ($order->user->nom ?? 'Client inconnu') : 'Client inconnu',
                        'total' => $order->montant_total ?? 0,
                        'statut' => $order->statut ?? 'en_attente',
                        'date' => $order->created_at->format('Y-m-d H:i:s'),
                        'items_count' => $order->produits->count()
                    ];
                });

            return response()->json($orders);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la récupération des commandes récentes'], 500);
        }
    }

    public function getRecentUsers()
    {
        $this->authorize('manageUsers', Utilisateur::class);

        try {
            $users = Utilisateur::orderBy('created_at', 'desc')
                ->take(5)
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'nom' => $user->nom,
                        'email' => $user->email,
                        'role' => $user->role,
                        'date' => $user->created_at->format('Y-m-d')
                    ];
                });

            return response()->json($users);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la récupération des utilisateurs récents'], 500);
        }
    }

    public function getUsers(Request $request)
    {
        // Vérifier l'autorisation avec la policy
        $this->authorize('manageUsers', Utilisateur::class);
        
        $page = $request->query('page', 1);
        $perPage = 10;
        
        $utilisateurs = Utilisateur::paginate($perPage, ['*'], 'page', $page);
        
        return response()->json([
            'utilisateurs' => $utilisateurs->items(),
            'totalPages' => $utilisateurs->lastPage(),
            'currentPage' => $utilisateurs->currentPage()
        ]);
    }

    public function recentProducts()
    {
        try {
            $recentProducts = Produit::with(['vendeur', 'categorie'])
                ->get() // Récupérer tous les produits
                ->map(function ($product) {
                    return [
                        'id' => $product->id, // Ajout de l'ID du produit
                        'nom' => $product->nom, // Ajout du nom du produit
                        'description' => $product->description, // Ajout de la description
                        'prix' => $product->prix, // Ajout du prix
                        'quantite_stock' => $product->quantite_stock,
                        'actif' => $product->actif,
                        'date_ajout' => $product->created_at->format('Y-m-d H:i:s'),
                        'vendeur' => $product->vendeur ? [
                            'id' => $product->vendeur->id,
                            'nom_boutique' => $product->vendeur->nom_boutique
                        ] : null,
                        'categorie' => $product->categorie ? [
                            'id' => $product->categorie->id,
                            'nom' => $product->categorie->nom
                        ] : null
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $recentProducts
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des produits récents',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}