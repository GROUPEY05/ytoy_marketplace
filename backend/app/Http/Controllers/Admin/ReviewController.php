<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::with(['user', 'product'])
                    ->latest()
                    ->paginate(10);
                    
        return response()->json($reviews);
    }
    
    public function approveReview($id)
    {
        $review = Review::findOrFail($id);
        $review->status = 'approved';
        $review->save();
        
        return response()->json([
            'success' => true,
            'message' => 'Avis approuvé avec succès'
        ]);
    }
    
    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        $review->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Avis supprimé avec succès'
        ]);
    }
}