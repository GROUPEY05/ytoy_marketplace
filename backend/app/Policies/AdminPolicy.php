<?php

namespace App\Policies;

use App\Models\Utilisateur;
use Illuminate\Auth\Access\HandlesAuthorization;

class AdminPolicy
{
    use HandlesAuthorization;

    public function viewDashboard(Utilisateur $user): bool
    {
        return $user->role === 'administrateur';
    }

    public function manageUsers(Utilisateur $user): bool
    {
        return $user->role === 'administrateur';
    }

    public function manageVendors(Utilisateur $user): bool
    {
        return $user->role === 'administrateur';
    }

    public function manageProducts(Utilisateur $user): bool
    {
        return $user->role === 'administrateur';
    }

    public function manageOrders(Utilisateur $user): bool
    {
        return $user->role === 'administrateur';
    }

    public function viewStatistics(Utilisateur $user): bool
    {
        return $user->role === 'administrateur';
    }
}
