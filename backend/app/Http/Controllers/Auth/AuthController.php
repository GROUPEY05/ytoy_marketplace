<?php

namespace App\Http\Controllers\Auth;

use App\Models\Utilisateur;
use App\Http\Controllers\Controller;
use App\Models\Acheteur;
use App\Models\Vendeur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Mail;

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
            $utilisateur->update(['actif' => true]);
            $acheteur = $utilisateur->acheteur()->create([
                'adresse_livraison' => $request->adresse_livraison,
                'preferences' => $request->preferences,

            ]);
            // Acheteur::create([
            //    // 'utilisateur_id' => $utilisateur->id,
            //     'adresse_livraison' => $request->adresse_livraison ?? $request->adresse,
            // ]);


        } elseif ($request->role === 'vendeur') {
            $utilisateur->update(['actif' => true]); // Vendeur inactif jusqu'à vérification

            $vendeur = $utilisateur->vendeur()->create([
                'nom_boutique' => $request->nom_boutique,
                'description' => $request->description,
                'verifie' => true,
            ]);
        }

        $token = $utilisateur->createToken('auth_token')->plainTextToken;

        return response()->json([
            'utilisateur' => $utilisateur,
            'token' => $token
        ], 201);
    }

    public function registervendeur(Request $request)
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






        if ($request->role === 'vendeur') {
            $utilisateur->update(['actif' => true]); // Vendeur inactif jusqu'à vérification

            $vendeur = $utilisateur->vendeur()->create([
                'nom_boutique' => $request->nom_boutique,
                'ville' => $request->ville,
                'description' => $request->description,
                'verifie' => true,
                'telephone' => $request->telephone,
            ]);
        } elseif ($request->role === 'acheteur') {
            $utilisateur->update(['actif' => true]);
            $acheteur = $utilisateur->acheteur()->create([
                'adresse_livraison' => $request->adresse_livraison,
                'preferences' => $request->preferences,

            ]);
            // Acheteur::create([
            //    // 'utilisateur_id' => $utilisateur->id,
            //     'adresse_livraison' => $request->adresse_livraison ?? $request->adresse,
            // ]);


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
            'mot_de_passe' => 'required|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Utilisateur::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->mot_de_passe, $user->mot_de_passe)) {
            return response()->json([
                'message' => 'Email ou mot de passe incorrect.'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'utilisateur' => $user,
            'token' => $token,
            'message' => 'Connexion réussie'
        ]);
    }

    /**
     * Connexion d'un utilisateur
     */
    public function loginOld(Request $request)
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

        // Vérifie si l'utilisateur existe et si le mot de passe est correct
        if (!Hash::check($request->mot_de_passe, $utilisateur->mot_de_passe)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        if (!$utilisateur->actif) {
            return response()->json([
                'message' => 'Ce compte n\'est pas actif'
            ], 403);
        }

        $token = $utilisateur->createToken('auth_token')->plainTextToken;

        $utilisateur = Utilisateur::where('email', $request->email)->firstOrFail();
        $utilisateur->makeHidden(['mot_de_passe', 'created_at', 'updated_at']);

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
     * Demande de réinitialisation du mot de passe
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Envoi de l'email de réinitialisation
            $status = Password::sendResetLink(
                $request->only('email')
            );

            if ($status === Password::RESET_LINK_SENT) {
                return response()->json([
                    'message' => 'Un email de réinitialisation a été envoyé à votre adresse email.'
                ]);
            } else {
                return response()->json([
                    'message' => 'Cette adresse email n\'existe pas dans notre système.'
                ], 404);
            }

        } catch (\Exception $e) {
            Log::error('Erreur lors de la réinitialisation du mot de passe: ' . $e->getMessage());
            return response()->json([
                'message' => 'Une erreur est survenue lors de l\'envoi de l\'email de réinitialisation.'
            ], 500);
        }
    }

    /**
     * Réinitialisation du mot de passe avec token
     */
    public function updatePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'password' => 'required|min:8|confirmed'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $user = Utilisateur::where('reset_token', $request->token)
                ->where('reset_token_expiry', '>', now())
                ->first();

            if (!$user) {
                return response()->json([
                    'message' => 'Le lien de réinitialisation est invalide ou a expiré.'
                ], 400);
            }

            $user->update([
                'mot_de_passe' => Hash::make($request->password),
                'reset_token' => null,
                'reset_token_expiry' => null
            ]);

            return response()->json([
                'message' => 'Votre mot de passe a été réinitialisé avec succès.'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Une erreur est survenue lors de la réinitialisation du mot de passe.'
            ], 500);
        }
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
            case 'administrateur':
                return '/admin/dashboard';
            case 'vendeur':
                return '/vendeur/dashboard';
            case 'acheteur':
                return '/dashboard';
            default:
                return '/';
        }
    }


    public function activerUtilisateur($id)
    {
        $utilisateur = Utilisateur::findOrFail($id);
        $utilisateur->actif = true;
        $utilisateur->save();

        return response()->json(['message' => 'Utilisateur activé avec succès.']);
    }

    public function desactiverUtilisateur($id)
    {
        $utilisateur = Utilisateur::findOrFail($id);
        $utilisateur->actif = false;
        $utilisateur->save();

        return response()->json(['message' => 'Utilisateur désactivé avec succès.']);
    }

    public function approuverVendeur($id)
    {
        $vendeur = Vendeur::findOrFail($id);
        $vendeur->verifie = true;
        $vendeur->date_verification = now();
        $vendeur->save();

        // Activer le compte utilisateur associé
        $vendeur->utilisateur->update(['actif' => true]);

        return response()->json(['message' => 'Vendeur approuvé avec succès.']);
    }

    public function rejeterVendeur($id)
    {
        $vendeur = Vendeur::findOrFail($id);
        $vendeur->verifie = false;
        $vendeur->date_verification = now();
        $vendeur->save();

        // Désactiver le compte utilisateur associé
        $vendeur->utilisateur->update(['actif' => false]);

        return response()->json(['message' => 'Vendeur rejeté avec succès.']);
    }

    public function getVendeursEnAttente()
    {
        try {
            $vendeurs = Utilisateur::where('role', 'vendeur')->where('status', 'en_attente')->get();
            return response()->json($vendeurs);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur serveur', 'error' => $e->getMessage()], 500);
        }
    }
}
