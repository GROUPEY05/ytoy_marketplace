<?php

// 6. Migration pour la table produits
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('produits', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->text('description');
            $table->decimal('prix', 10, 2);
            $table->integer('quantite_stock')->default(0);
            $table->timestamp('date_ajout')->useCurrent();
            $table->boolean('actif')->default(true);
            $table->unsignedBigInteger('vendeur_id');
            $table->unsignedBigInteger('categorie_id');
            $table->timestamps();
            
            $table->foreign('vendeur_id')->references('id')->on('vendeurs')->onDelete('cascade');
            $table->foreign('categorie_id')->references('id')->on('categories');
        });
    }

    public function down()
    {
        Schema::dropIfExists('produits');
    }
};
