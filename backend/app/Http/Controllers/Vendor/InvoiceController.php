<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    /**
     * Affiche la liste des factures.
     */
    public function index()
    {
        // Exemple de données simulées
        $invoices = [
            ['id' => 1, 'amount' => 100.50, 'status' => 'paid'],
            ['id' => 2, 'amount' => 200.75, 'status' => 'pending'],
        ];

        return response()->json($invoices);
    }

    /**
     * Affiche les détails d'une facture spécifique.
     */
    public function show($id)
    {
        // Exemple de données simulées
        $invoice = ['id' => $id, 'amount' => 100.50, 'status' => 'paid'];

        return response()->json($invoice);
    }

    /**
     * Télécharge une facture.
     */
    public function download($id)
    {
        return response()->json(['message' => "Téléchargement de la facture $id"]);
    }
}
