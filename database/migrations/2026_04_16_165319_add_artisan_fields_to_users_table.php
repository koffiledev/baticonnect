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
        Schema::table('users', function (Blueprint $table) {
        $table->json('competences')->nullable()->after('role');
        
        $table->integer('rayon_action')->nullable()->after('competences');
        
        $table->text('presentation')->nullable()->after('rayon_action');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
       Schema::table('users', function (Blueprint $table) {
        $table->dropColumn(['competences', 'rayon_action', 'presentation']);
        
        });
    }
};
