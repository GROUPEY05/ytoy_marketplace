<?php

// app/Policies/OrderPolicy.php
namespace App\Policies;

use App\Models\Commande;
use App\Models\Utilisateur;
use Illuminate\Auth\Access\Response;

class CommandePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(Utilisateur $utilisateur): bool
    {
        // Admin peut voir toutes les commandes
        if ($utilisateur->role === 'administrateur') {
            return true;
        }
        
        // Acheteurs et vendeurs peuvent voir leurs listes de commandes
        return in_array($utilisateur->role, ['acheteur', 'vendeur']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(Utilisateur $utilisateur, Commande $order): bool
    {
        // Admin peut voir n'importe quelle commande
        if ($utilisateur->role === 'administrateur') {
            return true;
        }
        
        // Acheteur peut voir ses propres commandes
        if ($utilisateur->role === 'acheteur') {
            return $order->utilisateur_id === $utilisateur->id;
        }
        
        // Vendeur peut voir les commandes contenant ses produits
        if ($utilisateur->role === 'vendeur') {
            return $order->items()->whereHas('produit', function ($query) use ($utilisateur) {
                $query->where('vendeur_id', $utilisateur->id);
            })->exists();
        }
        
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(Utilisateur $utilisateur, Commande $order): bool
    {
        // Seul l'admin peut mettre à jour les commandes
        return $utilisateur->role === 'administrateur';
    }
}
