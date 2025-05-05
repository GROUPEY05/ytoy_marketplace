<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Promotion extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'description',
        'produit_id',
        'prix_normal',
        'prix_promo',
        'pourcentage_reduction',
        'date_debut',
        'date_fin',
        'type_promo', // 'promotion', 'super_deal', 'nouveau', 'top_deal', 'le_njoh', 'offre_special'
        'actif',
        'vendeur_id'
    ];

    protected $casts = [
        'date_debut' => 'datetime',
        'date_fin' => 'datetime',
        'prix_normal' => 'decimal:2',
        'prix_promo' => 'decimal:2',
        'pourcentage_reduction' => 'decimal:2',
        'actif' => 'boolean'
    ];
    
    // Définir les valeurs par défaut
    protected $attributes = [
        'actif' => true,
        'type_promo' => 'promotion',
    ];

    /**
     * Relation avec le produit
     */
    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }

    /**
     * Relation avec le vendeur
     */
    public function vendeur()
    {
        return $this->belongsTo(User::class, 'vendeur_id');
    }

    /**
     * Scope pour les promotions actives
     */
    public function scopeActives($query)
    {
        $now = Carbon::now();
        return $query->where('actif', true)
            ->where(function ($q) use ($now) {
                $q->where('date_fin', '>=', $now->toDateTimeString())
                    ->orWhereNull('date_fin');
            })
            ->where(function ($q) use ($now) {
                $q->where('date_debut', '<=', $now->toDateTimeString())
                    ->orWhereNull('date_debut');
            });
    }

    /**
     * Scope pour filtrer par type de promotion
     */
    public function scopeDeType($query, $type)
    {
        return $query->where('type_promo', $type);
    }
}
