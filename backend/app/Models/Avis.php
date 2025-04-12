<?php
// app/Models/Avis.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Avis extends Model
{
    protected $fillable = [
        'note',
        'commentaire',
        'date_avis',
        'modere',
        'acheteur_id',
        'produit_id'
    ];
    
    public function acheteur()
    {
        return $this->belongsTo(Acheteur::class);
    }
    
    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }
}