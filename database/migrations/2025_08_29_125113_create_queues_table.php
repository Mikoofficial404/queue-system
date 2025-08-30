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
        Schema::create('queues', function (Blueprint $table) {
            $table->id();
            $table->string('number'); // A001, A002
            $table->string('service_name');
            $table->string('service_code', 10);
            $table->enum('status', ['waiting', 'serving', 'completed', 'skipped'])->default('waiting');
            $table->timestamps();

            // Agar query nya optimal
            $table->index(['service_code', 'status']);
            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('queues');
    }
};
