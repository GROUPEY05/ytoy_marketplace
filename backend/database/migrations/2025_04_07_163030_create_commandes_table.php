<?php


// 10. Migration pour la table commandes
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('commandes', function (Blueprint $table) {
            $table->id();
            $table->timestamp('date_commande')->useCurrent();
            $table->enum('statut', ['en_attente', 'validee', 'en_preparation', 'expediee', 'livree', 'annulee'])->default('en_attente');
            $table->decimal('montant_total', 10, 2);
            $table->text('adresse_livraison');
            $table->unsignedBigInteger('utilisateur_id');
            $table->timestamps();
            
            $table->foreign('utilisateur_id')->references('id')->on('utilisateurs');
        });
    }

    public function down()
    {
        Schema::dropIfExists('commandes');
    }
};
