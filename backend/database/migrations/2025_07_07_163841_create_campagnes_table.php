<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('campagnes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendeur_id')->constrained('utilisateurs')->onDelete('cascade');
            $table->string('titre');
            $table->text('description');
            $table->decimal('budget', 10, 2);
            $table->json('target_platforms');
            $table->json('produit_images');
            $table->json('produit_descriptions');
            $table->json('produit_prix');
            $table->enum('status', ['pending', 'approved', 'rejected', 'active', 'completed'])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('campagnes');
    }
};
