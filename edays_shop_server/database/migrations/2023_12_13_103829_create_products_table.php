<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('image');
            $table->text('short_description');
            $table->text('long_description');
            $table->decimal('price', 10, 2);
            $table->integer('stock_quantity');
            $table->foreignId('category_id')->constrained();
        });
    }
    
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
