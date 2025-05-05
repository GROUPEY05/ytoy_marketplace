<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\Paiement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class PaiementController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));
    }

    public function createStripePaymentIntent(Request $request)
    {
        try {
            $request->validate([
                'commande_id' => 'required|exists:commandes,id'
            ]);
            
            $order = Commande::findOrFail($request->commande_id);
            
            if ($order->utilisateur_id !== Auth::id()) {
                return response()->json(['error' => 'Non autorisé'], 403);
            }

            $paymentIntent = PaymentIntent::create([
                'amount' => $order->montant_total * 100, // Stripe utilise les centimes
                'currency' => 'xof',
                'metadata' => [
                    'commande_id' => $order->id
                ]
            ]);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function simulateOrangeMoney(Request $request)
    {
        try {
            $request->validate([
                'commande_id' => 'required|exists:commandes,id',
                'numero_telephone' => 'required|string|min:8'
            ]);

            $order = Commande::findOrFail($request->commande_id);
            
            if ($order->utilisateur_id !== Auth::id()) {
                return response()->json(['error' => 'Non autorisé'], 403);
            }

            // Simulation du paiement Orange Money
            $payment = Paiement::create([
                'commande_id' => $order->id,
                'montant' => $order->montant_total,
                'methode' => 'orange_money',
                'statut' => 'complete', // Utiliser la valeur acceptée par l'ENUM
                'transaction_id' => 'OM_' . uniqid(),
                'numero_telephone' => $request->numero_telephone
            ]);

            $order->update(['statut' => 'validee']);

            return response()->json([
                'message' => 'Paiement Orange Money simulé avec succès',
                'transaction_id' => $payment->transaction_id
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function simulateMobileMoney(Request $request)
    {
        try {
            $request->validate([
                'commande_id' => 'required|exists:commandes,id',
                'numero_telephone' => 'required|string|min:8',
                'operator' => 'required|in:mtn,moov'
            ]);

            $order = Commande::findOrFail($request->commande_id);
            
            if ($order->utilisateur_id !== Auth::id()) {
                return response()->json(['error' => 'Non autorisé'], 403);
            }

            // Simulation du paiement Mobile Money
            $payment = Paiement::create([
                'commande_id' => $order->id,
                'montant' => $order->montant_total,
                'methode' => 'mobile_money', // Utiliser la valeur acceptée par l'ENUM
                'statut' => 'complete', // Utiliser la valeur acceptée par l'ENUM
                'transaction_id' => strtoupper($request->operator) . '_' . uniqid(),
                'numero_telephone' => $request->numero_telephone
            ]);

            $order->update(['statut' => 'validee']);

            return response()->json([
                'message' => 'Paiement Mobile Money simulé avec succès',
                'transaction_id' => $payment->transaction_id
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function webhook(Request $request)
    {
        $payload = $request->getContent();
        $sig_header = $request->header('Stripe-Signature');

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $sig_header,
                env('STRIPE_WEBHOOK_SECRET')
            );

            switch ($event->type) {
                case 'payment_intent.succeeded':
                    $paymentIntent = $event->data->object;
                    $commandeId = $paymentIntent->metadata->commande_id;
                    
                    $order = Commande::find($commandeId);
                    if ($order) {
                        $order->update(['statut' => 'validee']);
                        
                        Paiement::create([
                            'commande_id' => $commandeId,
                            'montant' => $paymentIntent->amount / 100,
                            'methode' => 'stripe',
                            'statut' => 'complete', // Utiliser la valeur acceptée par l'ENUM
                            'transaction_id' => $paymentIntent->id
                        ]);
                    }
                    break;
            }

            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
