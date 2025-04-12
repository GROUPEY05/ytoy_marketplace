<?php

// 13. Migration pour la table avis
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('avis', function (Blueprint $table) {
            $table->id();
            $table->integer('note');
            $table->text('commentaire')->nullable();
            $table->timestamp('date_avis')->useCurrent();
            $table->boolean('modere')->default(false);
            $table->unsignedBigInteger('acheteur_id');
            $table->unsignedBigInteger('produit_id');
            $table->timestamps();
            
            $table->foreign('acheteur_id')->references('id')->on('acheteurs');
            $table->foreign('produit_id')->references('id')->on('produits')->onDelete('cascade');
            $table->unique(['acheteur_id', 'produit_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('avis');
    }
};
