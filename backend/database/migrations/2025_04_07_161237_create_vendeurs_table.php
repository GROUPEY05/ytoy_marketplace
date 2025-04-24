<?php

// 3. Migration pour la table vendeurs
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('vendeurs', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string('nom_boutique');
           
            $table->text('description')->nullable();
            $table->boolean('verifie')->default(false);
            $table->timestamp('date_verification')->nullable();
            $table->timestamps();
            
            $table->foreign('id')->references('id')->on('utilisateurs')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('vendeurs');
    }
};