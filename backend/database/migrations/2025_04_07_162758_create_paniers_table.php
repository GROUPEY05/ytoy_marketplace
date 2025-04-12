<?php

// 8. Migration pour la table paniers
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('paniers', function (Blueprint $table) {
            $table->id();
            $table->timestamp('date_creation')->useCurrent();
            $table->timestamp('date_modification')->nullable();
            $table->unsignedBigInteger('acheteur_id');
            $table->timestamps();
            
            $table->foreign('acheteur_id')->references('id')->on('acheteurs')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('paniers');
    }
};
