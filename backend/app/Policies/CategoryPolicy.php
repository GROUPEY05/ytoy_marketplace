<?php

namespace App\Policies;

use App\Models\Categorie;
use App\Models\Utilisateur;
use Illuminate\Auth\Access\Response;

class CategoryPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    public function create(Utilisateur $user ): Response
    {
        return $user->role !== 'administrateur' ? Response::deny('Vous n\'avez pas la permission de créer cette catégorie.') : Response::allow();
    }
}
