<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Product;
use Exception;

class CategoryController extends Controller
{
    function getAll(){
        try{    
            $categories = Category::all();
            return $this->customResponse($categories);
        }catch(Exception $e){
            return self::customResponse($e->getMessage(),'error',500);
        }
    }

    function getById(Category $category){
        try{
            return $this->customResponse($category);
        }catch(Exception $e){
            return self::customResponse($e->getMessage(),'error',500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $this->validate($request, [
                'category' => ['required', 'string'],
            ]);

            $existingCategory = Category::where('category', $validatedData['category'])->first();

            if ($existingCategory) {
                return $this->customResponse('Category already exists', 'error', 400);
            }

            $category = Category::create($validatedData);

            return $this->customResponse($category, 'Category created successfully');
        } catch (\Exception $e) {
            return $this->customResponse($e->getMessage(), 'error', 500);
        }
    }

    function destroy(Category $category){
        try{

            $associatedProducts = $category->products;

            if ($associatedProducts->isNotEmpty()) {
                return $this->customResponse('Cannot delete category. It has associated products.', 'error', 400);
            }

            $category->delete();
            return $this->customResponse($category, 'Deleted Successfully');
        }catch(Exception $e){
            return self::customResponse($e->getMessage(),'error',500);
        }
    }

    public function update(Request $request)
    {
        try {
            $validatedData = $this->validate($request, [
                'category' => ['required', 'string'],
            ]);

            $existingCategory = Category::where('category', $validatedData['category'])->first();

            if ($existingCategory) {
                return $this->customResponse('Category already exists', 'error', 400);
            }

            $category = Category::find($request->id);
            
            if (!$category) {
                return $this->customResponse('Category not found', 'error', 404);
            }

            $category->category = $validatedData['category'];
            $category->save();

            return $this->customResponse($category, 'Updated Successfully');
        } catch (\Exception $e) {
            return $this->customResponse($e->getMessage(), 'error', 500);
        }
    }

    public function getCategoryProducts(Category $category){
        try{    
            $products = Product::where('category_id', $category->id)->with('category')->get();

            return $this->customResponse($products);
        }catch(Exception $e){
            return self::customResponse($e->getMessage(),'error',500);
        }
    }


    function customResponse($data, $status = 'success', $code = 200){
        $response = ['status' => $status,'data' => $data];
        return response()->json($response,$code);
    }
}
