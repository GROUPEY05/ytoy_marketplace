<?php

// app/Models/Acheteur.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Acheteur extends Model
{
    protected $table = 'acheteurs';
    
    protected $primaryKey = 'id';
    
    public $incrementing = false;
    
    protected $fillable = [
        'adresse_livraison',
        'preferences'
    ];
    
    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'id');
    }
    
    public function panier()
    {
        return $this->hasOne(Panier::class);
    }
    
    public function commandes()
    {
        return $this->hasMany(Commande::class);
    }
    
    public function avis()
    {
        return $this->hasMany(Avis::class);
    }
}
