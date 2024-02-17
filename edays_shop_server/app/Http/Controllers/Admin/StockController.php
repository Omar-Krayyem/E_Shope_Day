<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Exception;

class StockController extends Controller
{
    public function getAll()
    {
        try {
            $products = Product::with('category')->get();
            
            return $this->customResponse($products);
        } catch (Exception $e) {
            return self::customResponse($e->getMessage(), 'error', 500);
        }
    }

    public function update(Request $request_info){
        try{
            $validated_data = $this->validate($request_info, [
                'id' => ['required', 'numeric'],
                'stock_quantity' => ['required', 'numeric'],
            ]);

            $product = Product::find($validated_data['id']);

            if (!$product) {
                return $this->customResponse('Product not found', 'error', 404);
            }

            $product->stock_quantity = $product->stock_quantity + $validated_data['stock_quantity'];

            $product->save();

            return $this->customResponse($product, 'Product Updated Successfully');
        }
        catch(Exception $e){
            return self::customResponse($e->getMessage(),'error',500);
        }
    }


    function customResponse($data, $status = 'success', $code = 200){
        $response = ['status' => $status,'data' => $data];
        return response()->json($response,$code);
    }
}
