<?php

// app/Models/Order.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Payment;
use App\Models\Utilisateur;

class Order extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'status',
        'total',
        'shipping_address',
        'payment_method'
    ];

    protected $casts = [
        'total' => 'decimal:2'
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
    
    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
