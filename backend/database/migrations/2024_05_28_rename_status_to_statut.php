<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('commandes', function (Blueprint $table) {
            // Vérifier si la colonne status existe
            if (Schema::hasColumn('commandes', 'status')) {
                // Copier les données de status vers statut si statut n'existe pas
                if (!Schema::hasColumn('commandes', 'statut')) {
                    $table->string('statut')->nullable();
                    DB::statement('UPDATE commandes SET statut = status');
                }
                // Supprimer l'ancienne colonne
                $table->dropColumn('status');
            }
            // Si ni status ni statut n'existent, créer statut
            else if (!Schema::hasColumn('commandes', 'statut')) {
                $table->string('statut')->default('en_attente');
            }
        });
    }

    public function down()
    {
        Schema::table('commandes', function (Blueprint $table) {
            if (Schema::hasColumn('commandes', 'statut')) {
                // Créer status si n'existe pas
                if (!Schema::hasColumn('commandes', 'status')) {
                    $table->string('status')->nullable();
                    DB::statement('UPDATE commandes SET status = statut');
                }
                // Ne pas supprimer statut au cas où la migration échoue
            }
        });
    }
};
