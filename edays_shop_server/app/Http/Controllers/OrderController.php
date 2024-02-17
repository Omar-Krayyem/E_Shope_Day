<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Support\Facades\Auth;
use Exception;

class OrderController extends Controller
{
    public function getAll(){
        try{
            $user = Auth::user();

            $orders = Order::where('user_id', $user->id)->with('orderItems.product.category')->get();

            $orders= $orders->map(function ($order) {
                $order->item_count = $order->orderItems->count();
                return $order;
            });

            return $this->customResponse($orders, 'success', 200);
        }catch (Exception $e) {
            return self::customResponse($e->getMessage(), 'error', 500);
        }
    }

    public function getById(Order $order)
{
    try {
        $order = Order::with('orderItems.product.category')->find($order->id);

        foreach ($order->orderItems as $orderItem) {
            $orderItem->product->new_image_url = asset('storage/product_images/' . $orderItem->product->image);
        }

        return $this->customResponse($order, 'success', 200);
    } catch (Exception $e) {
        return self::customResponse($e->getMessage(), 'error', 500);
    }
}


    public function store(Request $request_info){
        try{
            $user = Auth::user();
            $validated_data = $this->validate($request_info, [
                'address' => ['required', 'string'],
            ]);

            $cart = Cart::where('user_id', $user->id)->with('items.product')->first();

            if ($cart->items->isNotEmpty()) {

                $order = Order::create([
                    'user_id' => $user->id,
                    'order_date' => now(),
                    'address' => $validated_data['address'],
                    'total_price' => 0.0,
                ]);
        
                $total_price = 0;

                foreach ($cart->items as $cartItem) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $cartItem->product->id,
                        'quantity' => $cartItem->quantity,
                        'subtotal' => $cartItem->subtotal,
                    ]);
                    $total_price += $cartItem->subtotal;
                }
                $order->total_price = $total_price;
                $order->save(); 
                $cart->items()->delete();
            } else {
                return $this->customResponse([], 'No cart items');
            }

            return $this->customResponse($order, 'success', 200);
        }catch(Exception $e){
            return self::customResponse($e->getMessage(),'error',500);
        }
    }

    function customResponse($data, $status = 'success', $code = 200){
        $response = ['status' => $status,'data' => $data];
        return response()->json($response,$code);
    }
}
