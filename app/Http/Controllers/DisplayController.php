<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DisplayController extends Controller
{
    public function index(){
        return Inertia::render('display-queue');
    }

    public function Create(){
        return Inertia::render();
    }
}
