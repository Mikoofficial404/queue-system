<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DisplayController extends Controller
{
    public function index(){
        return Inertia::render('display-queue');
    }
<<<<<<< HEAD

    public function Create(){
        return Inertia::render();
    }
=======
>>>>>>> 16306ed51be2e15d630628e644bc354aa7b1c49c
}
