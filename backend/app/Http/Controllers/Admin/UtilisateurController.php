<?php



namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Utilisateur;
use Illuminate\Http\Request;

class UtilisateurController extends Controller
{
    public function index()
    {
        $users = Utilisateur::latest()->paginate(10);
        return response()->json($users);
    }
    
    public function show($id)
    {
        $user = Utilisateur::findOrFail($id);
        return response()->json($user);
    }
    
    public function update(Request $request, $id)
    {
        $user = Utilisateur::findOrFail($id);
        
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$id,
            'role' => 'required|in:acheteur,vendeur,administrateur',
        ]);
        
        $user->update($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Utilisateur mis à jour avec succès',
            'user' => $user
        ]);
    }
    
    public function banUser($id)
    {
        $user = Utilisateur::findOrFail($id);
        $user->status = $user->status === 'banned' ? 'active' : 'banned';
        $user->save();
        
        $message = $user->status === 'banned' ? 'Utilisateur banni avec succès' : 'Utilisateur réactivé avec succès';
        
        return response()->json([
            'success' => true,
            'message' => $message,
            'status' => $user->status
        ]);
    }
    
    public function destroy($id)
    {
        $user = Utilisateur::findOrFail($id);
        $user->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Utilisateur supprimé avec succès'
        ]);
    }
}
