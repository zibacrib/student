<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use App\Models\Amenity;
use App\Models\Property;
use App\Models\PropertyFee;
use App\Models\PropertyPhoto;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController extends Controller
{
    /**
     * Agent's property listing dashboard.
     */
    public function index(): Response
    {
        $properties = Property::where('agent_id', auth()->id())
            ->with(['coverPhoto'])
            ->withCount('enquiries')
            ->latest()
            ->get();

        return Inertia::render('Agent/Properties/Index', [
            'properties' => $properties,
        ]);
    }

    /**
     * Show create form.
     */
    public function create(): Response
    {
        return Inertia::render('Agent/Properties/Create', [
            'amenities' => Amenity::orderBy('category')->orderBy('name')->get(),
        ]);
    }

    /**
     * Store a new property listing.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'description'   => 'nullable|string',
            'address'       => 'required|string|max:255',
            'city'          => 'required|string|max:100',
            'area'          => 'nullable|string|max:100',
            'latitude'      => 'nullable|numeric',
            'longitude'     => 'nullable|numeric',
            'room_types'    => 'required|array|min:1',
            'room_types.*.type'  => 'required|string|max:100',
            'room_types.*.price' => 'required|numeric|min:0',
            'amenity_ids'   => 'nullable|array',
            'amenity_ids.*' => 'exists:amenities,id',
            'fees'          => 'nullable|array',
            'fees.*.label'       => 'required|string',
            'fees.*.amount'      => 'nullable|numeric',
            'fees.*.is_included' => 'boolean',
            'fees.*.notes'       => 'nullable|string',
        ]);

        $minPrice = collect($validated['room_types'])->min('price') ?? 0;

        $property = Property::create(array_merge($validated, [
            'agent_id' => auth()->id(),
            'status'   => 'DRAFT',
            'type'     => 'HOSTEL', // Forced type based on user request (boarding house)
            'price_from' => $minPrice,
        ]));

        // Attach room types
        foreach ($validated['room_types'] as $rt) {
            $property->roomTypes()->create($rt);
        }

        // Attach amenities
        if (!empty($validated['amenity_ids'])) {
            $property->amenities()->sync($validated['amenity_ids']);
        }

        // Create fees
        if (!empty($validated['fees'])) {
            foreach ($validated['fees'] as $fee) {
                $property->fees()->create($fee);
            }
        }

        return redirect()->route('agent.properties.photos', $property)
            ->with('success', 'Property created! Now add some photos.');
    }

    /**
     * Edit form.
     */
    public function edit(Property $property): Response
    {
        $this->authorizeAgent($property);

        return Inertia::render('Agent/Properties/Edit', [
            'property'  => $property->load(['amenities', 'fees', 'photos', 'roomTypes']),
            'amenities' => Amenity::orderBy('category')->orderBy('name')->get(),
        ]);
    }

    /**
     * Update property.
     */
    public function update(Request $request, Property $property): RedirectResponse
    {
        $this->authorizeAgent($property);

        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'description'   => 'nullable|string',
            'address'       => 'required|string|max:255',
            'city'          => 'required|string|max:100',
            'area'          => 'nullable|string|max:100',
            'latitude'      => 'nullable|numeric',
            'longitude'     => 'nullable|numeric',
            'room_types'    => 'required|array|min:1',
            'room_types.*.type'  => 'required|string|max:100',
            'room_types.*.price' => 'required|numeric|min:0',
            'amenity_ids'   => 'nullable|array',
            'amenity_ids.*' => 'exists:amenities,id',
            'fees'          => 'nullable|array',
            'fees.*.label'       => 'required|string',
            'fees.*.amount'      => 'nullable|numeric',
            'fees.*.is_included' => 'boolean',
            'fees.*.notes'       => 'nullable|string',
        ]);

        $minPrice = collect($validated['room_types'])->min('price') ?? 0;
        
        $property->update(array_merge($validated, [
            'price_from' => $minPrice,
        ]));

        // Re-sync room types
        $property->roomTypes()->delete();
        foreach ($validated['room_types'] as $rt) {
            $property->roomTypes()->create($rt);
        }

        // Re-sync amenities
        if (isset($validated['amenity_ids'])) {
            $property->amenities()->sync($validated['amenity_ids']);
        } else {
            $property->amenities()->detach();
        }

        // Re-sync fees
        $property->fees()->delete();
        if (!empty($validated['fees'])) {
            foreach ($validated['fees'] as $fee) {
                $property->fees()->create($fee);
            }
        }

        return redirect()->route('agent.properties.edit', $property)
            ->with('success', 'Property updated.');
    }

    /**
     * Delete property (soft delete).
     */
    public function destroy(Property $property): RedirectResponse
    {
        $this->authorizeAgent($property);
        $property->delete();

        return redirect()->route('agent.properties.index')
            ->with('success', 'Property removed.');
    }

    /**
     * Submit for admin review.
     */
    public function submit(Property $property): RedirectResponse
    {
        $this->authorizeAgent($property);

        if ($property->photos()->count() === 0) {
            return back()->with('error', 'Please add at least one photo before submitting.');
        }

        $property->update(['status' => 'PUBLISHED']);

        return redirect()->route('agent.properties.index')
            ->with('success', 'Property is now live on the platform!');
    }

    // ──────────────────────────────────────────────────────────────

    private function authorizeAgent(Property $property): void
    {
        if ($property->agent_id !== auth()->id()) {
            abort(403, 'You do not own this listing.');
        }
    }
}
