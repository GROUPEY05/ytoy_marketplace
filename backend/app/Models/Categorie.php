<?php

// app/Models/Categorie.php
namespace App\Models;
use App\Models\Produit;

use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    protected $fillable = [
        'nom',
        'description'
    ];
    
    public function produits()
    {
        return $this->hasMany(Produit::class);
    }
}