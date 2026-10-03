<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Agent\PhotoController;
use App\Http\Controllers\Agent\PropertyController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', [ListingController::class, 'index'])->name('listings.index');
Route::get('/listings/{property:slug}', [ListingController::class, 'show'])->name('listings.show');
Route::post('/listings/{property}/enquire', [ListingController::class, 'enquire'])->name('listings.enquire');

/*
|--------------------------------------------------------------------------
| Auth Routes (provided by Breeze)
|--------------------------------------------------------------------------
*/

require __DIR__.'/auth.php';

/*
|--------------------------------------------------------------------------
| Authenticated (all roles)
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {

    // Role-based redirect on /dashboard
    Route::get('/dashboard', function () {
        return match(auth()->user()->role) {
            'admin'  => redirect()->route('admin.dashboard'),
            'agent'  => redirect()->route('agent.properties.index'),
            default  => redirect()->route('student.dashboard'),
        };
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/listings/{property}/favourite', [ListingController::class, 'toggleFavourite'])
        ->name('listings.favourite');
});

/*
|--------------------------------------------------------------------------
| Student Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:student'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', function () {
        $favourites = auth()->user()->favouriteProperties()
            ->with('coverPhoto')
            ->latest('favourites.created_at')
            ->get();
        return Inertia::render('Student/Dashboard', ['favourites' => $favourites]);
    })->name('dashboard');
});

/*
|--------------------------------------------------------------------------
| Agent Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:agent'])->prefix('agent')->name('agent.')->group(function () {
    // Properties CRUD
    Route::get('/properties', [PropertyController::class, 'index'])->name('properties.index');
    Route::get('/properties/create', [PropertyController::class, 'create'])->name('properties.create');
    Route::post('/properties', [PropertyController::class, 'store'])->name('properties.store');
    Route::get('/properties/{property}/edit', [PropertyController::class, 'edit'])->name('properties.edit');
    Route::patch('/properties/{property}', [PropertyController::class, 'update'])->name('properties.update');
    Route::delete('/properties/{property}', [PropertyController::class, 'destroy'])->name('properties.destroy');
    Route::post('/properties/{property}/submit', [PropertyController::class, 'submit'])->name('properties.submit');

    // Photo Management
    Route::get('/properties/{property}/photos', [PhotoController::class, 'index'])->name('properties.photos');
    Route::post('/properties/{property}/photos', [PhotoController::class, 'store'])->name('properties.photos.store');
    Route::post('/properties/{property}/photos/{photo}/cover', [PhotoController::class, 'setCover'])->name('properties.photos.cover');
    Route::delete('/properties/{property}/photos/{photo}', [PhotoController::class, 'destroy'])->name('properties.photos.destroy');
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');

    // Agent management
    Route::get('/agents', [AdminController::class, 'agents'])->name('agents');
    Route::get('/agents/create', [AdminController::class, 'createAgent'])->name('agents.create');
    Route::post('/agents', [AdminController::class, 'storeAgent'])->name('agents.store');
    Route::post('/agents/{agent}/suspend', [AdminController::class, 'suspendAgent'])->name('agents.suspend');
    Route::post('/agents/{agent}/unsuspend', [AdminController::class, 'unsuspendAgent'])->name('agents.unsuspend');
    Route::delete('/agents/{agent}', [AdminController::class, 'deleteAgent'])->name('agents.delete');

    // Listing moderation
    Route::get('/listings/pending', [AdminController::class, 'pendingListings'])->name('listings.pending');
    Route::post('/listings/{property}/approve', [AdminController::class, 'approveProperty'])->name('listings.approve');
    Route::post('/listings/{property}/reject', [AdminController::class, 'rejectProperty'])->name('listings.reject');
});
