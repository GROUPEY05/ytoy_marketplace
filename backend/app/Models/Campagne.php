<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Campagne extends Model
{
   
    use HasFactory;

    protected $fillable = [
        'vendeur_id',
        'titre',
        'description',
        'budget',
        'target_platforms',
        'produit_images',
        'produit_descriptions',
        'produit_prix',
        'status',
        'admin_notes',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'target_platforms' => 'array',
        'produit_images' => 'array',
        'produit_descriptions' => 'array',
        'produit_prix' => 'array',
        'budget' => 'decimal:2'
    ];

    const STATUS_PENDING = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';
    const STATUS_ACTIVE = 'active';
    const STATUS_COMPLETED = 'completed';

    public function vendeur()
    {
        return $this->belongsTo(Utilisateur::class, 'vendeur_id');
    }

    public function getStatusBadgeAttribute()
    {
        $badges = [
            self::STATUS_PENDING => 'bg-warning',
            self::STATUS_APPROVED => 'bg-success',
            self::STATUS_REJECTED => 'bg-danger',
            self::STATUS_ACTIVE => 'bg-info',
            self::STATUS_COMPLETED => 'bg-secondary'
        ];

        return $badges[$this->status] ?? 'bg-secondary';
    }
} 

