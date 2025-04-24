<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReviewsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('utilisateur_id'); // ID de l'utilisateur
            $table->unsignedBigInteger('produit_id'); // ID du produit
            $table->integer('rating'); // Note (par exemple, de 1 à 5)
            $table->text('comment')->nullable(); // Commentaire de l'utilisateur
            $table->string('status')->default('pending'); // Statut (pending, approved, rejected)
            $table->timestamps();

            // Clés étrangères
            $table->foreign('utilisateur_id')->references('id')->on('utilisateurs')->onDelete('cascade');
            $table->foreign('produit_id')->references('id')->on('produits')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('reviews');
    }
}