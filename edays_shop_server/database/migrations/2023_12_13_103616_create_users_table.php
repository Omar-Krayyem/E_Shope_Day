<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('password')->min(6);
            $table->string('first_name');
            $table->string('last_name');
            $table->string('address');
            $table->string('phone')->min(6);
            $table->foreignId('user_type_id')->constrained();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
