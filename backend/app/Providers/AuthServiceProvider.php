<?php

namespace App\Providers;

use App\Models\Utilisateur;
use App\Policies\UserPolicy;
use App\Policies\AdminPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Les mappages de policies pour l'application.
     *
     * @var array
     */
    protected $policies = [
        Utilisateur::class => AdminPolicy::class,
    ];

    /**
     * Enregistrez tout le service d'autorisation pour l'application.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        // Gates pour les rôles
        Gate::define('is-vendeur', [UserPolicy::class, 'isVendeur']);
        Gate::define('is-acheteur', [UserPolicy::class, 'isAcheteur']);
        Gate::define('is-administrateur', [UserPolicy::class, 'isAdministrateur']);

        // Gates pour les actions d'administration
        Gate::define('view-dashboard', [AdminPolicy::class, 'viewDashboard']);
        Gate::define('manage-users', [AdminPolicy::class, 'manageUsers']);
        Gate::define('manage-vendors', [AdminPolicy::class, 'manageVendors']);
        Gate::define('manage-products', [AdminPolicy::class, 'manageProducts']);
        Gate::define('manage-orders', [AdminPolicy::class, 'manageOrders']);
        Gate::define('view-statistics', [AdminPolicy::class, 'viewStatistics']);
    }
}
