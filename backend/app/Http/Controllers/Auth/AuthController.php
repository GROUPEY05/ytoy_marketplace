<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use App\Models\Acheteur;
use App\Models\Vendeur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Inscription d'un nouvel utilisateur
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:utilisateurs',
            'mot_de_passe' => 'required|min:8|confirmed',
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'telephone' => 'required|string|max:15',
            'adresse' => 'required|string|max:255',
            'role' => 'required|in:acheteur,vendeur,administrateur',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $utilisateur = Utilisateur::create([
            'email' => $request->email,
            'mot_de_passe' => Hash::make($request->mot_de_passe),
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'telephone' => $request->telephone,
            'adresse' => $request->adresse,
            'role' => $request->role,
            'date_inscription' => now(),
            'actif' => true,
        ]);

         // Envoyer email de vérification
         $this->sendEmailVerification($utilisateur);

         // Génération du token
        $token = $utilisateur->createToken('auth_token')->plainTextToken;



       


        if ($request->role === 'acheteur') {
            Acheteur::create([
                'utilisateur_id' => $utilisateur->id,
                'adresse_livraison' => $request->adresse_livraison ?? $request->adresse,
            ]);
        } elseif ($request->role === 'vendeur') {
            $utilisateur->update(['actif' => false]); // Vendeur inactif jusqu'à vérification
            
            $vendeur = $utilisateur->vendeur()->create([
                'nom_boutique' => $request->nom_boutique,
                'description' => $request->description,
                'verifie' => false,
            ]);
        }

        $token = $utilisateur->createToken('auth_token')->plainTextToken;

        return response()->json([
            'utilisateur' => $utilisateur,
            'token' => $token
        ], 201);
    }

    /**
     * Connexion d'un utilisateur
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'mot_de_passe' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (!Auth::attempt(['email' => $request->email, 'password' => $request->mot_de_passe])) {
            return response()->json([
                'message' => 'Identifiants invalides'
            ], 401);
        }

        $utilisateur = Utilisateur::where('email', $request->email)->firstOrFail();
        
        if (!$utilisateur->actif) {
            return response()->json([
                'message' => 'Ce compte n\'est pas actif'
            ], 403);
        }

        $token = $utilisateur->createToken('auth_token')->plainTextToken;

        return response()->json([
            'utilisateur' => $utilisateur,
            'access_token' => $token,
            'token_type' => 'Bearer',
            'redirect_to' => $this->getRedirectPath($utilisateur->role),
        ]);
    }

    /**
     * Déconnexion
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie'
        ]);
    }



    public function verifyEmail(Request $request, $userId, $token)
    {
        // Logique de vérification d'email
        $user = Utilisateur::findOrFail($userId);
        $user->email_verified = true;
        $user->email_verified_at = now();
        $user->save();
        
        return response()->json(['message' => 'Email vérifié avec succès']);
    }


    public function verifyPhone(Request $request)
    {
        // Logique de vérification de téléphone (SMS)
        $validator = Validator::make($request->all(), [
            'code' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Vérifiez le code SMS ici
        // ...

        $user = $request->user();
        $user->phone_verified = true;
        $user->save();

        return response()->json(['message' => 'Téléphone vérifié avec succès']);
    }

    /**
     * Réinitialisation du mot de passe
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:utilisateurs,email',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Ici, implémentez la logique d'envoi d'email de réinitialisation
        // Utilisez les fonctionnalités Laravel pour la réinitialisation de mot de passe

        return response()->json([
            'message' => 'Email de réinitialisation envoyé'
        ]);
    }

    public function sendEmailVerification($user)
    {
        // Logique d'envoi d'email de vérification
        // Dans une application réelle, utilisez Laravel's built-in verification
        $token = Str::random(60);
        // Enregistrez le token et envoyez l'email
    }

    public function sendPhoneVerification(Request $request)
    {
        // Logique d'envoi de SMS de vérification
        // Générez un code et envoyez-le par SMS
        return response()->json(['message' => 'Code de vérification envoyé']);
    }

    private function getRedirectPath($role)
    {
        switch ($role) {
            case 'admin':
                return '/admin/dashboard';
            case 'vendeur':
                return '/vendeur/dashboard';
            case 'client':
                return '/client/dashboard';
            default:
                return '/';
        }
    }
}




