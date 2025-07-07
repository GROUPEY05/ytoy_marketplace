<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\LigneCommande;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CommandeController extends Controller
{
    /**
     * Afficher la liste des commandes du vendeur
     */
    public function index(Request $request)
    {
        // On récupère les commandes qui contiennent au moins un article du vendeur connecté
        DB::enableQueryLog();

        // Vérifions d'abord les commandes sans jointure
        $commandes = Commande::whereHas('lignes', function ($query) {
            $query->whereHas('produit', function ($query) {
                $query->where('vendeur_id', Auth::id());
            });
        })->get();

        Log::info('Commandes trouvées:', [
            'count' => $commandes->count(),
            'commandes' => $commandes->map(function ($c) {
                return ['id' => $c->id, 'utilisateur_id' => $c->utilisateur_id];
            })
        ]);

        // Vérifions les utilisateurs correspondants
        $utilisateurIds = $commandes->pluck('utilisateur_id')->unique();
        $utilisateurs = DB::table('utilisateurs')
            ->whereIn('id', $utilisateurIds)
            ->get();

        Log::info('Utilisateurs trouvés:', [
            'count' => $utilisateurs->count(),
            'utilisateurs' => $utilisateurs
        ]);

        // Maintenant la requête principale
        $query = Commande::with(['utilisateur', 'lignes.produit'])
            ->whereHas('lignes', function ($query) {
                $query->whereHas('produit', function ($query) {
                    $query->where('vendeur_id', Auth::id());
                });
            });

        // Log the query
        Log::info('SQL Query:', DB::getQueryLog());

        // Recherche
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('order_number', 'like', "%{$searchTerm}%")
                    ->orWhereHas('utilisateur', function ($q) use ($searchTerm) {
                        $q->where('nom', 'like', "%{$searchTerm}%")
                            ->orWhere('prenom', 'like', "%{$searchTerm}%")
                            ->orWhere('email', 'like', "%{$searchTerm}%");
                    });
            });
        }

        // Filtre par statut
        if ($request->has('statut') && !empty($request->statut)) {
            $query->where('statut', $request->statut);
        }

        // Tri
        $sortField = $request->sort_by ?? 'created_at';
        $sortDirection = $request->sort_direction ?? 'desc';
        $query->orderBy($sortField, $sortDirection);

        // Pagination
        $perPage = $request->per_page ?? 10;
        $orders = $query->paginate($perPage);

        Log::info('Orders before transform:', ['orders' => $orders->toArray()]);

        // Formater les résultats pour inclure seulement les informations pertinentes
        $orders->getCollection()->transform(function ($order) {
            $utilisateur = $order->utilisateur;

            $prenom = $utilisateur->prenom === $utilisateur->email ? '' : $utilisateur->prenom;
            $nomComplet = trim($utilisateur->nom . ' ' . $prenom);

            $vendorItems = $order->lignes->filter(function ($ligne) {
                return $ligne->produit->vendeur_id === Auth::id();
            });

            $vendorTotal = $vendorItems->sum(function ($item) {
                return $item->prix_unitaire * $item->quantite;
            });

            return [
                'id' => $order->id,
                'order_numero' => $order->numero_commande,
                'customer_nom' => !empty($nomComplet) ? $nomComplet : 'N/A',
                'customer_email' => $utilisateur->email ?? 'N/A',
                'montant_total' => $vendorTotal,
                'item_count' => $vendorItems->count(),
                'statut' => $order->statut,
                'created_at' => $order->created_at,
                'invoice_id' => $order->invoice_id
            ];
        });


        return response()->json($orders);
    }

    /**
     * Afficher les commandes recentes du vendeur
     */
    public function getRecentOrders(Request $request)
    {
        DB::enableQueryLog();

        // Vérifions d'abord les commandes sans jointure
        $commandes = Commande::whereHas('lignes', function ($query) {
            $query->whereHas('produit', function ($query) {
                $query->where('vendeur_id', Auth::id());
            });
        })->get();

        Log::info('Commandes trouvées:', [
            'count' => $commandes->count(),
            'commandes' => $commandes->map(fn($c) => ['id' => $c->id, 'utilisateur_id' => $c->utilisateur_id])
        ]);

        // Vérifions les utilisateurs correspondants
        $utilisateurIds = $commandes->pluck('utilisateur_id')->unique();
        $utilisateurs = DB::table('utilisateurs')->whereIn('id', $utilisateurIds)->get();

        Log::info('Utilisateurs trouvés:', [
            'count' => $utilisateurs->count(),
            'utilisateurs' => $utilisateurs
        ]);

        // Requête principale
        $query = Commande::with(['utilisateur', 'lignes.produit'])
            ->whereHas('lignes', function ($query) {
                $query->whereHas('produit', function ($query) {
                    $query->where('vendeur_id', Auth::id());
                });
            });

        // Recherche
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('order_number', 'like', "%{$searchTerm}%")
                    ->orWhereHas('utilisateur', function ($q) use ($searchTerm) {
                        $q->where('nom', 'like', "%{$searchTerm}%")
                            ->orWhere('prenom', 'like', "%{$searchTerm}%")
                            ->orWhere('email', 'like', "%{$searchTerm}%");
                    });
            });
        }

        // Filtre par statut
        if ($request->has('statut') && !empty($request->statut)) {
            $query->where('statut', $request->statut);
        }

        // Tri
        $sortField = $request->sort_by ?? 'created_at';
        $sortDirection = $request->sort_direction ?? 'desc';
        $query->orderBy($sortField, $sortDirection);

        // Limiter aux 3 dernières
        $orders = $query->take(3)->get();

        Log::info('Orders before transform:', ['orders' => $orders->toArray()]);

        // Formater les résultats
        $formatted = $orders->map(function ($order) {
            $utilisateur = $order->utilisateur;

            $vendorItems = $order->lignes->filter(
                fn($ligne) =>
                $ligne->produit && $ligne->produit->vendeur_id === Auth::id()
            );

            $vendorTotal = $vendorItems->sum(
                fn($item) =>
                $item->prix_unitaire * $item->quantite
            );

            $nomComplet = 'N/A';
            $email = 'N/A';

            if ($utilisateur) {
                $prenom = $utilisateur->prenom === $utilisateur->email ? '' : $utilisateur->prenom;
                $nomComplet = trim($utilisateur->nom . ' ' . $prenom);
                $email = $utilisateur->email;
            }

            Log::info('Order data:', [
                'id' => $order->id,
                'utilisateur' => $utilisateur ? [
                    'nom' => $utilisateur->nom,
                    'prenom' => $utilisateur->prenom,
                    'email' => $utilisateur->email
                ] : null
            ]);

            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_nom' => $nomComplet,
                'customer_email' => $email,
                'montant_total' => $vendorTotal,
                'item_count' => $vendorItems->count(),
                'statut' => $order->statut,
                'created_at' => $order->created_at,
                'invoice_id' => $order->invoice_id
            ];
        });

        return response()->json($formatted);
    }
    /**
     * Afficher les commandes recentes du vendeur
     */


    /**
     * Afficher les détails d'une commande spécifique
     */
    public function show($id)
    {
        $order = Commande::join('utilisateurs', 'commandes.utilisateur_id', '=', 'utilisateurs.id')
            ->select(
                'commandes.*',
                'utilisateurs.nom as user_nom',
                'utilisateurs.prenom as user_prenom',
                'utilisateurs.email as user_email',
                'utilisateurs.telephone as user_telephone'
            )
            ->where('commandes.id', $id)
            ->firstOrFail();

        // Vérifier que le vendeur a des articles dans cette commande
        $vendorItems = LigneCommande::where('commande_id', $order->id)
            ->whereHas('produit', function ($query) {
                $query->where('vendeur_id', Auth::id());
            })
            ->with(['produit', 'produit.images'])
            ->get();

        if ($vendorItems->isEmpty()) {
            return response()->json(['message' => 'Aucun produit de ce vendeur dans cette commande'], 403);
        }

        // Calculer le sous-total pour ce vendeur
        $subtotal = $vendorItems->sum(function ($item) {
            return $item->unit_price * $item->quantity;
        });

        // Calculer les taxes proportionnelles (si applicable)
        $taxRate = $order->tax_rate ?? 0.2; // 20% par défaut
        $tax = $subtotal * $taxRate;

        // Si les frais de livraison sont partagés entre les vendeurs
        $totalItems = LigneCommande::where('commande_id', $order->id)->count();
        $vendorItemsCount = $vendorItems->count();
        $shippingCost = $order->shipping_cost * ($vendorItemsCount / $totalItems);

        // Formater les items pour l'affichage
        $formattedItems = $vendorItems->map(function ($item) {
            return [
                'produit_id' => $item->produit_id,
                'produit_nom' => $item->produit->nom,
                'produit_image' => $item->produit->images->first()->url ?? null,
                'prix_unitaire' => $item->prix_unitaire,
                'quantite' => $item->quantite
            ];
        });

        // Construire la réponse
        $response = [
            'id' => $order->id,
            'commande_numero' => $order->numero_commande,
            'customer_nom' => ($prenom = $order->user_prenom === $order->user_email ? '' : $order->user_prenom) &&
                !empty(trim($order->user_nom . ' ' . $prenom)) ? trim($order->user_nom . ' ' . $prenom) : 'N/A',
            'customer_email' => $order->user_email ?? 'N/A',
            'customer_phone' => $order->user_telephone ?? 'N/A',
            'statut' => $order->status,
            'subtotal' => $subtotal,
            'tax' => $tax,
            'shipping_cost' => $shippingCost,
            'total_amount' => $subtotal + $tax + $shippingCost,
            'adresse_livraison' => $order->adresse_livraison,
            'items' => $formattedItems,
            'created_at' => $order->created_at,
            'invoice_id' => $order->invoice_id
        ];

        return response()->json($response);
    }

    /**
     * Mettre à jour le statut d'une commande
     */
    public function updateStatus(Request $request, $id)
    {
        // Validation
        $validated = $request->validate([
            'statut' => 'required|string|in:' . implode(',', [
                Commande::STATUT_EN_ATTENTE,
                Commande::STATUT_VALIDEE,
                Commande::STATUT_EN_PREPARATION,
                Commande::STATUT_EXPEDIEE,
                Commande::STATUT_LIVREE,
                Commande::STATUT_ANNULEE
            ])
        ]);

        $order = Commande::findOrFail($id);

        // Vérifier que le vendeur a des articles dans cette commande
        $hasItems = LigneCommande::where('commande_id', $order->id)
            ->whereHas('produit', function ($query) {
                $query->where('vendeur_id', Auth::id());
            })
            ->exists();

        if (!$hasItems) {
            return response()->json(['message' => 'Aucun produit de ce vendeur dans cette commande'], 403);
        }

        try {
            // Dans une marketplace multi-vendeurs, il serait plus logique d'avoir un statut par vendeur
            // Mais pour simplifier, nous mettons à jour le statut global de la commande
            $order->statut = $validated['statut'];
            $order->save();

            // Si la commande est annulée, remettre les articles en stock
            if ($validated['statut'] === Commande::STATUT_ANNULEE) {
                $this->restoreStock($order->id);
            }

            return response()->json([
                'message' => 'Statut mis à jour avec succès',
                'statut' => $order->statut
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la mise à jour du statut',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remettre les produits en stock pour les commandes annulées
     */
    private function restoreStock($orderId)
    {
        // Ne restaurer le stock que pour les produits du vendeur connecté
        $orderItems = LigneCommande::where('commande_id', $orderId)
            ->whereHas('produit', function ($query) {
                $query->where('vendeur_id', Auth::id());
            })
            ->get();

        foreach ($orderItems as $item) {
            $produit = Produit::find($item->produit_id);
            if ($produit) {
                $produit->stock += $item->quantity;
                $produit->save();
            }
        }
    }
}