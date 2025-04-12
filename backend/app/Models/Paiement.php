<?php
// app/Models/Paiement.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    protected $fillable = [
        'montant',
        'date_paiement',
        'methode',
        'statut',
        'reference',
        'commande_id'
    ];
    
    public function commande()
    {
        return $this->belongsTo(Commande::class);
    }
}
