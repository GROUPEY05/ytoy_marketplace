<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->text('description')->nullable();
            $table->foreignId('produit_id')->constrained('produits')->onDelete('cascade');
            $table->decimal('prix_normal', 10, 2);
            $table->decimal('prix_promo', 10, 2);
            $table->decimal('pourcentage_reduction', 5, 2)->nullable();
            $table->dateTime('date_debut')->nullable();
            $table->dateTime('date_fin')->nullable();
            $table->enum('type_promo', ['promotion', 'super_deal', 'nouveau', 'top_deal', 'le_njoh', 'offre_special']);
            $table->boolean('actif')->default(true);
            $table->foreignId('vendeur_id')->constrained('utilisateurs');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
