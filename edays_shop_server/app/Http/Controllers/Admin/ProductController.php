<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Exception;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function store(Request $request_info){
        try{
            $validated_data = $this->validate($request_info, [
                'name' => ['required', 'string'],
                'short_description' => ['required', 'string'],
                'long_description' => ['required', 'string'],
                'price' => ['required',],
                'category_id' => ['required', 'numeric'],
                'image' => ['required', 'image'],
            ]); 

            $fileNameExt = $request_info->file('image')->getClientOriginalName();
            $fileName = pathinfo($fileNameExt, PATHINFO_FILENAME);
            $fileExt = $request_info->file('image')->getClientOriginalExtension();
            $fileNameToStore = $fileName.'_'.time().'.'.$fileExt;
            $pathToStore = $request_info->file('image')->storeAs('public/product_images',$fileNameToStore);
            
            $stock_quantity = 0;

            $product = Product::create([
                'name' => $validated_data['name'],
                'short_description' => $validated_data['short_description'],
                'long_description' => $validated_data['long_description'],
                'price' => $validated_data['price'],
                'category_id' => $validated_data['category_id'],
                'stock_quantity' => $stock_quantity,
                'image' => $fileNameToStore,
            ]);

            return $this->customResponse($product, 'Product Created Successfully');
        }catch(Exception $e){
            return self::customResponse($e->getMessage(),'error',500);
        }
    }

    public function getAll()
    {
        try {
            $products = Product::with('category')->get();
            
            return $this->customResponse($products);
        } catch (Exception $e) {
            return self::customResponse($e->getMessage(), 'error', 500);
        }
    }

    public function getById(Product $product){
        try{
            $user = Auth::user();
    
            $isFavorite = Favorite::where('user_id', $user->id)->where('product_id', $product->id)->exists();
    
            $product->load('category');
            $product->new_image_url = asset('storage/product_images/' . $product->image);
            $product->is_favorite = $isFavorite;
    
            return $this->customResponse($product);
        } catch(Exception $e){
            return self::customResponse($e->getMessage(),'error',500);
        }
    }

    public function destroy(Product $product){
        try{
            if (!$product) {
                return $this->customResponse('product not found', 'error', 404);
            }

            $product->orderItems()->delete();

            $product->delete();

            return $this->customResponse($product, 'Deleted Successfully');
        }catch(Exception $e){
            return self::customResponse($e->getMessage(),'error',500);
        }
    }

    public function update(Request $request_info){
        try{
            $validated_data = $this->validate($request_info, [
                'id' => ['required', 'numeric'],
                'name' => ['required', 'string'],
                'short_description' => ['required', 'string'],
                'long_description' => ['required', 'string'],
                'price' => ['required',],
                'category_id' => ['required', 'numeric'],
                'image' => ['image'],
            ]);

            $product = Product::find($validated_data['id']);

            if (!$product) {
                return $this->customResponse('Product not found', 'error', 404);
            }

            if ($request_info->hasFile('image')) {
                $fileNameExt = $request_info->file('image')->getClientOriginalName();
                $fileName = pathinfo($fileNameExt, PATHINFO_FILENAME);
                $fileExt = $request_info->file('image')->getClientOriginalExtension();
                $fileNameToStore = $fileName.'_'.time().'.'.$fileExt;
                $pathToStore = $request_info->file('image')->storeAs('public/product_images', $fileNameToStore);
    
                if ($product->image) {
                    Storage::delete('public/product_images/' . $product->image);
                }
    
                $product->image = $fileNameToStore;
            }


            $product->name = $validated_data['name'];
            $product->short_description = $validated_data['short_description'];
            $product->long_description = $validated_data['long_description'];
            $product->price = $validated_data['price'];
            $product->category_id = $validated_data['category_id'];

            $product->save();

            return $this->customResponse($product, 'Product Updated Successfully');
        }
        catch(Exception $e){
            return self::customResponse($e->getMessage(),'error',500);
        }
    }

    public function getToHome(){
        try {
            $latestProducts = Product::with('category')
                ->orderBy('id', 'desc')
                ->take(12)
                ->get();
    
            $randomProducts = Product::with('category')
                ->inRandomOrder()
                ->take(4)
                ->get();
    
    
            foreach ($latestProducts as $product) {
                $product->new_image_url = asset('storage/product_images/' . $product->image);
            }

            foreach ($randomProducts as $product) {
                $product->new_image_url = asset('storage/product_images/' . $product->image);
            }

            $result = [
                'lastProduct' => $latestProducts,
                'recommended' => $randomProducts
            ];
    
            return $this->customResponse($result);
        } catch (Exception $e) {
            return self::customResponse($e->getMessage(), 'error', 500);
        }
    }

    function customResponse($data, $status = 'success', $code = 200){
        $response = ['status' => $status,'data' => $data];
        return response()->json($response,$code);
    }
}
