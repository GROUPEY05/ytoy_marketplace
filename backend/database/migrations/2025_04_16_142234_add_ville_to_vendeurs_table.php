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
        Schema::table('vendeurs', function (Blueprint $table) {
            $table->string('ville')->nullable()->after('nom_boutique'); // ou sans nullable si obligatoire
        });
    }
    
    public function down()
    {
        Schema::table('vendeurs', function (Blueprint $table) {
            $table->dropColumn('ville');
        });
    }
    
};
