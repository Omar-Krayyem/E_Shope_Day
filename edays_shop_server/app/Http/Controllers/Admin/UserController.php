<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Exception;

class UserController extends Controller
{
    function getAll(){
        try{    
            $user = User::where('user_type_id', 2)->get();
            return $this->customResponse($user);
        }catch(Exception $e){
            return self::customResponse($e->getMessage(),'error',500);
        }
    }

    function destroy(User $user){
        try{

            foreach ($user->orders as $order) {
                $order->orderItems()->delete();
                $order->delete();
            }

            if ($user->cart) {
                $user->cart->cartItems()->delete();
                $user->cart->delete();
            }

            $user->favorites()->delete();

            $user->delete();
            return $this->customResponse($user, 'Deleted Successfully');
        }catch(Exception $e){
            return self::customResponse($e->getMessage(),'error',500);
        }
    }

    function customResponse($data, $status = 'success', $code = 200){
        $response = ['status' => $status,'data' => $data];
        return response()->json($response,$code);
    }
}
