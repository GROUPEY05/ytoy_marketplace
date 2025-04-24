<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'produit_id',
        'rating',
        'comment',
        'status',
    ];

    /**
     * Relation avec l'utilisateur.
     */
    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class);
    }

    /**
     * Relation avec le produit.
     */
    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }
}
