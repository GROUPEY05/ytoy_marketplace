<?php

// 2. Migration pour la table acheteurs
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('acheteurs', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->text('adresse_livraison')->nullable();
            $table->text('preferences')->nullable();
            $table->timestamps();
            
            $table->foreign('id')->references('id')->on('utilisateurs')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('acheteurs');
    }
};
