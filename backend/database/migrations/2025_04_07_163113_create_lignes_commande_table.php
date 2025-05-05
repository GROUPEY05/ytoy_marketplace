<?php


// 11. Migration pour la table lignes_commande
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('lignes_commande', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('panier_id');
            $table->unsignedBigInteger('produit_id');
            $table->unsignedBigInteger('commande_id')->nullable(); // Nullable car au début il n'y a pas de commande
            $table->integer('quantite');
            $table->decimal('prix_unitaire', 10, 2);
            $table->timestamps();
            
            $table->foreign('commande_id')->references('id')->on('commandes')->onDelete('set null');
            $table->foreign('produit_id')->references('id')->on('produits')->onDelete('cascade');
            // On suppose que chaque ligne de commande appartient à un panier
            // et qu'un panier peut avoir plusieurs lignes de commande
            // mais une ligne de commande ne peut appartenir qu'à un seul panier
            $table->foreign('panier_id')->references('id')->on('paniers')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('lignes_commande');
    }
};

