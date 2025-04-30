<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = ['utilisateur_id'];

    public function user()
    {
        return $this->belongsTo(Utilisateur::class);
    }

    public function products()
    {
        return $this->belongsToMany(Produit::class, 'cart_items')
            ->withPivot('quantity')
            ->withTimestamps();
    }
}
