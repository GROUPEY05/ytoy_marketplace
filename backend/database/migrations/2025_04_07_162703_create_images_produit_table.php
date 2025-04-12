<?php

// 7. Migration pour la table images_produit
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('images_produit', function (Blueprint $table) {
            $table->id();
            $table->string('url');
            $table->boolean('principale')->default(false);
            $table->unsignedBigInteger('produit_id');
            $table->timestamps();
            
            $table->foreign('produit_id')->references('id')->on('produits')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('images_produit');
    }
};
