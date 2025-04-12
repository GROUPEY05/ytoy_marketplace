<?php
// app/Models/ImageProduit.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImageProduit extends Model
{
    protected $table = 'images_produit';
    
    protected $fillable = [
        'url',
        'principale',
        'produit_id'
    ];
    
    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }
}
