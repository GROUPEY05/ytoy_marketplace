<?php
namespace App\Policies;

use App\Models\Utilisateur;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Détermine si l'utilisateur est un vendeur.
     *
     * @param  \App\Models\Utilisateur  $user
     * @return bool
     */
    public function isVendeur(Utilisateur $user)
    {
        return $user->role === 'vendeur';
    }

    /**
     * Détermine si l'utilisateur est un acheteur.
     *
     * @param  \App\Models\Utilisateur  $user
     * @return bool
     */
    public function isAcheteur(Utilisateur $user)
    {
        return $user->role === 'acheteur';
    }

    /**
     * Détermine si l'utilisateur est un administrateur.
     *
     * @param  \App\Models\Utilisateur  $user
     * @return bool
     */
    public function isAdministrateur(Utilisateur $user)
    {
        return $user->role === 'administrateur';
    }
}

