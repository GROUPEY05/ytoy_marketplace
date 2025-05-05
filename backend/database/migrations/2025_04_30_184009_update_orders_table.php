<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            // Renommer utilisateur_id en user_id
            $table->renameColumn('utilisateur_id', 'user_id');
            
            // Renommer total_amount en total
            $table->renameColumn('total_amount', 'total');
            
            // Ajouter les nouveaux champs
            $table->string('shipping_address')->after('status');
            $table->enum('payment_method', ['card', 'cash'])->after('shipping_address');
            
            // Mettre à jour le statut pour inclure tous les états possibles
            $table->enum('status', [
                'pending',
                'processing',
                'shipped',
                'delivered',
                'cancelled'
            ])->change();
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->renameColumn('user_id', 'utilisateur_id');
            $table->renameColumn('total', 'total_amount');
            $table->dropColumn(['shipping_address', 'payment_method']);
            $table->string('status')->change();
    });
}
};