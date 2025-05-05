<?php

// 12. Migration pour la table paiements
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->decimal('montant', 10, 2);
            $table->timestamp('date_paiement')->useCurrent();
            $table->enum('methode', ['paypal', 'mobile_money', 'orange_money', 'stripe', 'carte_credit']);
            $table->enum('statut', ['en_attente', 'complete', 'echoue', 'rembourse'])->default('en_attente');
            $table->string('reference')->unique()->nullable();
            $table->unsignedBigInteger('commande_id');
            $table->timestamps();
            
            $table->foreign('commande_id')->references('id')->on('commandes')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('paiements');
    }
};

