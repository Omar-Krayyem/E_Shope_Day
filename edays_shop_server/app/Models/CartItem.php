<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public $timestamps = false;

    public function cart()
    {
        return $this->belongsTo(cart::class,'cart_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
