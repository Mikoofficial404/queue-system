<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use function PHPSTORM_META\map;

class Queue extends Model
{
    protected $fillable = [
        'number',
        'service_name',
        'service_code',
        'status',
    ];

    public static function generateNumber($serviceCode){
        $today = now()->format('Y-m-d');
        $count = self::whereDate('created_at', $today)
        ->where('service_code', $serviceCode)
        ->count();

        return $serviceCode . str_pad($count + 1,3,'0', STR_PAD_LEFT);
    }


}
