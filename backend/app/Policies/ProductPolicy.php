<?php

namespace App\Policies;

use App\Models\Utilisateur;
use App\Models\Produit;

class ProductPolicy
{
    /**
     * Vérifie si l'utilisateur peut créer un produit.
     */
    public static function canCreate(Utilisateur $utilisateur)
    {
        return $utilisateur && $utilisateur->role === 'vendor'; // L'utilisateur doit avoir le rôle 'vendor' pour pouvoir créer un produit
    }

    /**
     * Vérifie si l'utilisateur peut modifier un produit.
     */
    public static function canUpdate(Utilisateur $utilisateur, Produit $product)
    {
        return $utilisateur && ($utilisateur->role === 'admin' || ($utilisateur->role === 'vendor' && $utilisateur->id === $product->utilisateur_id));
    }

    /**
     * Vérifie si l'utilisateur peut supprimer un produit.
     */
    public static function canDelete(Utilisateur $utilisateur, Produit $product)
    {
        return $utilisateur && ($utilisateur->role === 'admin' || ($utilisateur->role === 'vendor' && $utilisateur->id === $product->utilisateur_id));
    }
}

