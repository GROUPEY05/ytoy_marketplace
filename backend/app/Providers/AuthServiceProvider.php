<?php

namespace App\Providers;

use App\Models\Utilisateur;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Les politiques d'autorisation de l'application.
     *
     * @var array
     */
    protected $policies = [
        Utilisateur::class => UserPolicy::class,
    ];

    /**
     * Enregistrez tout le service d'autorisation pour l'application.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        // Exemple de définition de gates personnalisés
        Gate::define('is-vendeur', [UserPolicy::class, 'isVendeur']);
        Gate::define('is-acheteur', [UserPolicy::class, 'isAcheteur']);
        Gate::define('is-administrateur', [UserPolicy::class, 'isAdministrateur']);
    }
}

