<?php

use App\Http\Controllers\AccountController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\OrdController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\StockController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;

Route::post("/login", [AuthController::class, "login"]);
Route::post("/register", [AuthController::class, "register"]);

Route::group(["middleware" => "auth:api"], function () {

    Route::group(["middleware" => "auth.admin", "prefix" => "admin"], function () {
        Route::group(['prefix' => 'category'], function(){
            Route::get('/', [CategoryController::class, "getAll"]);
            Route::get('/{category}', [CategoryController::class, "getById"]);
            Route::post('/store', [CategoryController::class, "store"]);
            Route::post('/update/{id}', [CategoryController::class, "update"]);
            Route::delete('/delete/{category}', [CategoryController::class, "destroy"]);
        });

        Route::group(['prefix' => 'product'], function(){
            Route::get('/', [ProductController::class, "getAll"]);
            Route::get('/{product}', [ProductController::class, "getById"]);
            Route::post('/store', [ProductController::class, "store"]);
            Route::post('/update', [ProductController::class, "update"]);
            Route::delete('/delete/{product}', [ProductController::class, "destroy"]);
        });

        Route::group(['prefix' => 'stock'], function(){
            Route::get('/', [StockController::class, "getAll"]);
            Route::post('/update', [StockController::class, "update"]);
        });

        Route::group(['prefix' => 'order'], function(){
            Route::get('/', [OrdController::class, "getAll"]);
            Route::get('/{order}', [OrdController::class, "getById"]);
        });

        Route::group(['prefix' => 'user'], function(){
            Route::get('/', [UserController::class, "getAll"]);
            Route::delete('/{user}', [UserController::class, "destroy"]);
        });
    });

    Route::group(['prefix' => 'account'], function(){
        Route::post("/", [AccountController::class, "updateProfile"]);
        Route::post("/password", [AccountController::class, "updatePassword"]);
        Route::get('/', [AccountController::class, "getUser"]);
    });

    Route::get('product/{product}', [ProductController::class, "getById"]);
    Route::get('/home', [ProductController::class, "getToHome"]);
    Route::get('/shop', [ProductController::class, "getAll"]);
    Route::get('/category', [CategoryController::class, "getAll"]);
    Route::get('/shop/category/{category}', [CategoryController::class, "getCategoryProducts"]);

    Route::group(['prefix' => 'favorite'], function(){
        Route::get('/', [FavoriteController::class, "getAll"]);
        Route::post('/store', [FavoriteController::class, "store"]);
        Route::delete('/{product}', [FavoriteController::class, "destroy"]);
    });

    Route::group(['prefix' => 'cart'], function(){
        Route::get('/', [CartController::class, "getAll"]);
        Route::post('/store', [CartController::class, "store"]);
        Route::delete('/{cartItem}', [CartController::class, "destroy"]);
    });

    Route::group(['prefix' => 'order'], function(){
        Route::get('/', [OrderController::class, "getAll"]);
        Route::get('/{order}', [OrderController::class, "getById"]);
        Route::post('/store', [OrderController::class, "store"]);
    });

    Route::group(['prefix' => 'profile'], function(){
        Route::get('/', [ProfileController::class, "getUser"]);
        Route::post('/', [ProfileController::class, "updateProfile"]);
        Route::post('/password', [ProfileController::class, "updatePassword"]);
    });
});