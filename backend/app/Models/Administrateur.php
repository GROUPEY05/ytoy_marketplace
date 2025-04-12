<?php

// app/Models/Administrateur.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Administrateur extends Model
{
    protected $table = 'administrateurs';
    
    protected $primaryKey = 'id';
    
    public $incrementing = false;
    
    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'id');
    }
}
