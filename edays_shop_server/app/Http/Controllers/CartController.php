<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Exception;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function getAll()
    {
        try {
            $user = Auth::user();

            $cart = Cart::where('user_id', $user->id)->with('items.product')->first();

            if (!$cart) {
                $cart = new Cart();
                $cart->user_id = $user->id;
                $cart->save();

                return $this->customResponse([], 'No cart items');
            }

            return $this->customResponse($cart, "success");
        } catch (Exception $e) {
            return self::customResponse($e->getMessage(), 'error', 500);
        }
    }

    public function store(Request $request_info)
    {
        try {
            $validated_data = $this->validate($request_info, [
                'product_id' => ['required', 'numeric'],
                'quantity' => ['required', 'numeric'],
            ]);

            $product_id = $request_info->product_id;
            $user = Auth::user();

            $cart = Cart::where('user_id', $user->id)->first();

            if (!$cart) {
                $cart = new Cart();
                $cart->user_id = $user->id;
                $cart->save();
            }

            $product = Product::find($product_id); // Fetch the product from the database

            $cart_item = CartItem::where('cart_id', $cart->id)->where('product_id', $product_id)->first();

            if ($cart_item) {
                return $this->customResponse($cart_item, 'Already exist');
            }

            $cart_item = new CartItem();
            $cart_item->cart_id = $cart->id;
            $cart_item->product_id = $product_id; 
            $cart_item->quantity = $request_info->quantity;
            $cart_item->subtotal = ($product->price * $request_info->quantity); // Access price from the product model

            $cart_item->save();

            $product->stock_quantity -= $request_info->quantity;
            $product->save();

            return $this->customResponse($cart_item, 'Added Successfully');
        } catch (Exception $e) {
            return self::customResponse($e->getMessage(), 'error', 500);
        }
    }



    public function destroy(CartItem $cartItem){
        try{
            $cartItem->delete();
            return $this->customResponse($cartItem, 'Deleted Successfully');

        }catch(Exception $e){
            return self::customResponse($e->getMessage(),'error',500);
        }
    }

    function customResponse($data, $status = 'success', $code = 200){
        $response = ['status' => $status,'data' => $data];
        return response()->json($response,$code);
    }
}
