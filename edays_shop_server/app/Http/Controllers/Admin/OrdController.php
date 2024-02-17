<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use Exception;

class OrdController extends Controller
{

    public function getAll(){
        try{
            $orders = Order::with('user')->with('orderItems')->get();

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
        $order = Order::with('user')->with('orderItems.product.category')->find($order->id);

        foreach ($order->orderItems as $orderItem) {
            $orderItem->product->new_image_url = asset('storage/product_images/' . $orderItem->product->image);
        }

        return $this->customResponse($order, 'success', 200);
    } catch (Exception $e) {
        return self::customResponse($e->getMessage(), 'error', 500);
    }
}

    function customResponse($data, $status = 'success', $code = 200){
        $response = ['status' => $status,'data' => $data];
        return response()->json($response,$code);
    }
}
