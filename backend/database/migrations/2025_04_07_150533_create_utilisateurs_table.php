<?php
// 1. Migration pour la table utilisateurs
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('utilisateurs', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('mot_de_passe');
            $table->string('nom');
            $table->string('prenom');
            $table->string('telephone')->nullable();
            $table->text('adresse')->nullable();
            $table->timestamp('date_inscription')->useCurrent();
            $table->enum('role', ['acheteur', 'vendeur', 'administrateur']);
            $table->boolean('actif')->default(true);
            $table->string('token_reinitialisation')->nullable();
            $table->timestamp('date_expiration_token')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('utilisateurs');
    }
};

