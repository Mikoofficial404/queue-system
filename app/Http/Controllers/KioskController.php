<?php

namespace App\Http\Controllers;

use App\Events\QueueCreated as PusherQueue;
use App\Models\Queue as ModelsQueue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Queue;
use Inertia\Inertia;

class KioskController extends Controller
{
    public function index(){
        return Inertia::render('kiosk');
    }

    public function store(Request $request){
        if(!$request->service_id){
            return Inertia::render('kiosk/index');
        }
        $serviceMap = [
            1 => ['code' => 'CS', 'name' => 'Customer Service'],
            2 => ['code' => 'TL', 'name' => 'Teler Service'],
            3 => ['code' => 'AC', 'name' => 'Aaccount OPENING'],
            4 => ['code' => 'LS', 'name' => 'Loan Service'],
        ];

        $service = $serviceMap[$request->service_id];

        $queueNumber = ModelsQueue::generateNumber($service['code']);

        $queue = ModelsQueue::create([
            'number' => $queueNumber,
            'service_name' => $service['name'],
            'service_code' => $service['code'],
        ]);

        PusherQueue::dispatch($queue);

        return response()->json([
            'number' => $queueNumber
        ]);

        // return Inertia::render('kiosk', [
        //    'number' => $queueNumber,
        // ]);
    }
}
