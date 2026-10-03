<?php

namespace App\Http\Controllers;

use App\Models\Enquiry;
use App\Models\Favourite;
use App\Models\Property;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ListingController extends Controller
{
    /**
     * Public listings browse page (homepage).
     */
    public function index(Request $request): Response
    {
        $query = Property::published()
            ->with(['coverPhoto', 'amenities'])
            ->withCount('favouritedBy');

        // Filters
        if ($request->filled('area')) {
            $query->where('area', 'like', "%{$request->area}%");
        }
        if ($request->filled('street')) {
            $query->where('address', 'like', "%{$request->street}%");
        }
        if ($request->filled('min_price')) {
            $query->where('price_from', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price_from', '<=', $request->max_price);
        }

        $properties = $query->latest()->paginate(12)->withQueryString();

        // User's favourites for toggling heart state
        $favouriteIds = auth()->check()
            ? auth()->user()->favourites()->pluck('property_id')->toArray()
            : [];

        return Inertia::render('Welcome', [
            'properties' => $properties,
            'filters' => $request->only(['area', 'street', 'min_price', 'max_price']),
            'favouriteIds' => $favouriteIds,
            'areas' => Property::published()->whereNotNull('area')->where('area', '!=', '')->distinct()->pluck('area')->sort()->values(),
            'streets' => Property::published()->whereNotNull('address')->where('address', '!=', '')->distinct()->pluck('address')->sort()->values(),
        ]);
    }

    /**
     * Full grid search page.
     */
    public function explore(Request $request): Response
    {
        $query = Property::published()
            ->with(['coverPhoto', 'amenities'])
            ->withCount('favouritedBy');

        // Filters
        if ($request->filled('area')) {
            $query->where('area', 'like', "%{$request->area}%");
        }
        if ($request->filled('street')) {
            $query->where('address', 'like', "%{$request->street}%");
        }
        if ($request->filled('min_price')) {
            $query->where('price_from', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price_from', '<=', $request->max_price);
        }

        $properties = $query->latest()->paginate(24)->withQueryString();

        $favouriteIds = auth()->check()
            ? auth()->user()->favourites()->pluck('property_id')->toArray()
            : [];

        return Inertia::render('Listings/Explore', [
            'properties' => $properties,
            'filters' => $request->only(['area', 'street', 'min_price', 'max_price']),
            'favouriteIds' => $favouriteIds,
            'areas' => Property::published()->whereNotNull('area')->where('area', '!=', '')->distinct()->pluck('area')->sort()->values(),
            'streets' => Property::published()->whereNotNull('address')->where('address', '!=', '')->distinct()->pluck('address')->sort()->values(),
        ]);
    }

    /**
     * Single listing detail page.
     */
    public function show(Property $property): Response
    {
        if ($property->status !== 'PUBLISHED') {
            abort(404);
        }

        $property->load(['photos.roomType', 'amenities', 'fees', 'agent', 'roomTypes']);

        $isFavourited = auth()->check()
            && auth()->user()->favourites()->where('property_id', $property->id)->exists();

        return Inertia::render('Listings/Show', [
            'property' => $property,
            'isFavourited' => $isFavourited,
        ]);
    }

    /**
     * Submit an enquiry to a listing.
     */
    public function enquire(Request $request, Property $property): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string|max:1000',
        ]);

        Enquiry::create(array_merge($validated, [
            'property_id' => $property->id,
            'user_id' => auth()->id(), // null if guest
        ]));

        return back()->with('success', 'Your enquiry has been sent! The agent will be in touch.');
    }

    /**
     * Toggle favourite (AJAX-friendly).
     */
    public function toggleFavourite(Property $property): RedirectResponse
    {
        $user = auth()->user();

        $favourite = Favourite::where('user_id', $user->id)
            ->where('property_id', $property->id)
            ->first();

        if ($favourite) {
            $favourite->delete();

            return back()->with('success', 'Removed from saved properties');
        }

        Favourite::create(['user_id' => $user->id, 'property_id' => $property->id]);

        return back()->with('success', 'Property saved!');
    }
}
