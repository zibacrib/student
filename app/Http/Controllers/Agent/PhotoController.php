<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\PropertyPhoto;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PhotoController extends Controller
{
    /**
     * Show photo management page for a property.
     */
    public function index(Property $property): Response
    {
        $this->authorizeAgent($property);

        return Inertia::render('Agent/Properties/Photos', [
            'property' => $property->load(['photos', 'roomTypes']),
        ]);
    }

    /**
     * Upload one or more photos.
     */
    public function store(Request $request, Property $property): RedirectResponse
    {
        $this->authorizeAgent($property);

        $request->validate([
            'photos'   => 'required|array|min:1',
            'photos.*' => 'image|mimes:jpeg,png,webp|max:5120', // 5MB each
            'property_room_type_id' => 'nullable|exists:property_room_types,id',
        ]);

        $lastOrder = $property->photos()->max('sort_order') ?? 0;

        foreach ($request->file('photos') as $i => $file) {
            $path = $file->store("properties/{$property->id}/photos", 'public');

            $isFirst = ($property->photos()->count() === 0 && $i === 0);

            PropertyPhoto::create([
                'property_id'           => $property->id,
                'property_room_type_id' => $request->input('property_room_type_id'),
                'path'                  => $path,
                'is_cover'              => $isFirst,
                'sort_order'            => $lastOrder + $i + 1,
            ]);
        }

        return back()->with('success', 'Photos uploaded.');
    }

    /**
     * Set a photo as the cover.
     */
    public function setCover(Property $property, PropertyPhoto $photo): RedirectResponse
    {
        $this->authorizeAgent($property);

        // Remove cover from all others
        $property->photos()->update(['is_cover' => false]);
        $photo->update(['is_cover' => true]);

        return back()->with('success', 'Cover photo updated.');
    }

    /**
     * Delete a photo.
     */
    public function destroy(Property $property, PropertyPhoto $photo): RedirectResponse
    {
        $this->authorizeAgent($property);

        Storage::disk('public')->delete($photo->path);
        $photo->delete();

        // If deleted photo was the cover, promote next photo
        if ($photo->is_cover) {
            $property->photos()->oldest('sort_order')->first()?->update(['is_cover' => true]);
        }

        return back()->with('success', 'Photo deleted.');
    }

    private function authorizeAgent(Property $property): void
    {
        if ($property->agent_id !== auth()->id()) {
            abort(403);
        }
    }
}
