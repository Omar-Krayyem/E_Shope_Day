<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Exception;
use App\Models\Favorite;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
class FavoriteController extends Controller
{
    function getAll(){
        try{
            $user = Auth::user();
            $favorites = Favorite::where('user_id', $user->id)
                ->with(['product' => function ($query) {
                    $query->select('id', 'name', 'short_description', 'long_description', 'price', 'stock_quantity', 'category_id', 'image', \DB::raw('CONCAT("storage/product_images/", image) AS image_url'));
                }])
                ->get();
            
            return $this->customResponse($favorites);            
        }catch(Exception $e){
            return self::customResponse($e->getMessage(),'error',500);
        }
    }

    function store(Request $request_info){
        try{
            $user = Auth::user();
            $validated_data = $this->validate($request_info, [
                'product_id' => ['required','numeric'],
            ]); 

            $validated_data['user_id'] = $user->id;

            $existingFavorite = Favorite::where([
                'product_id' => $validated_data['product_id'],
                'user_id' => $user->id,
            ])->first();
    
            if ($existingFavorite) {
                return $this->customResponse($existingFavorite, 'Favorite already exists');
            }

            $favorite = Favorite::create($validated_data);

            return $this->customResponse($favorite, 'Favorite Added Successfully');
        }catch(Exception $e){
            return self::customResponse($e->getMessage(),'error',500);
        }
    }

    function destroy(Product $product){
        try{
            $user = Auth::user();

            $favorite = Favorite::where('user_id', $user->id)->where('product_id', $product->id)->first();

            if (!$favorite) {
                return $this->customResponse('Unauthorized', 'error', 403);
            }

            $favorite->delete();

            return $this->customResponse($favorite, 'Deleted Successfully');
        }catch(Exception $e){
            return self::customResponse($e->getMessage(),'error',500);
        }
    }

    function customResponse($data, $status = 'success', $code = 200){
        $response = ['status' => $status,'data' => $data];
        return response()->json($response,$code);
    }
}
