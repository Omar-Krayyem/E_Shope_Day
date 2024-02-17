<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public $timestamps = false;

    public function user(){
        return $this->belongsTo(User::class, 'users_id');
    }

    public function items()
    {
        return $this->hasMany(CartItem::class, 'cart_id');
    }
}
