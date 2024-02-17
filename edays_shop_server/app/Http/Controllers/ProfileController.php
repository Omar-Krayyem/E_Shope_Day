<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Exception;

class ProfileController extends Controller
{
    public function getUser(){
        try{
            $user = Auth::user();
            return $this->customResponse($user, 'Success');
        }catch (Exception $e) {
            return self::customResponse($e->getMessage(),'error',500);
        }
    }

    public function updateProfile(Request $request_info)
    {
        try {
            $user_id = Auth::user()->id;
            $validated_data = $this->validate($request_info, [
                'first_name' => ['required', 'string'],
                'last_name' => ['required', 'string'],
                'phone' => ['required', 'string'],
                'address' => ['required', 'string'],
            ]);
    
            $user = User::find($user_id);
    
            $user->first_name = $validated_data['first_name'];
            $user->last_name = $validated_data['last_name'];
            $user->phone = $validated_data['phone'];
            $user->address = $validated_data['address'];

            $user->save();
    
            return $this->customResponse($user, 'Updated Successfully');
        } catch (Exception $e) {
            return self::customResponse($e->getMessage(),'error',500);
        }
    }

    public function updatePassword(Request $request_info){
        try{
            $user_id = Auth::user()->id;
            $validated_data = $this->validate($request_info, [
                'password' => ['required', 'string', 'min:6', 'nullable'],
            ]);

            $user = User::find($user_id);
            $password = Hash::make($validated_data['password']);
            $user->password = $password;
            $user->save();

            return $this->customResponse($user, 'Updated Successfully');
        } catch (Exception $e) {
            return self::customResponse($e->getMessage(),'error',500);
        }
    }

    function customResponse($data, $status = 'success', $code = 200){
        $response = ['status' => $status,'data' => $data];
        return response()->json($response,$code);
    }
}
