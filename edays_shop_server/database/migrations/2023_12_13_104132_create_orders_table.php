<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->date('order_date');
            $table->string('address');
            $table->decimal('total_price', 10, 2);
        });
    }
    
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
