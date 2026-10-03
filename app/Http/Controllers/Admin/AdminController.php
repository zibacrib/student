<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    /**
     * Admin overview dashboard.
     */
    public function dashboard(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_agents' => User::where('role', 'agent')->count(),
                'active_agents' => User::where('role', 'agent')->where('is_suspended', false)->count(),
                'suspended_agents' => User::where('role', 'agent')->where('is_suspended', true)->count(),
                'total_properties' => Property::count(),
                'published' => Property::where('status', 'PUBLISHED')->count(),
                'pending_review' => Property::where('status', 'PENDING_REVIEW')->count(),
                'total_students' => User::where('role', 'student')->count(),
            ],
        ]);
    }

    // ──────────────────────────────────────────────────────────────
    // Agent Management
    // ──────────────────────────────────────────────────────────────

    public function agents(): Response
    {
        $agents = User::where('role', 'agent')
            ->withCount('properties')
            ->latest()
            ->get();

        return Inertia::render('Admin/Agents/Index', ['agents' => $agents]);
    }

    public function createAgent(): Response
    {
        return Inertia::render('Admin/Agents/Create');
    }

    public function storeAgent(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
            'phone' => 'nullable|string|max:20',
            'agency_name' => 'nullable|string|max:255',
        ]);

        User::create(array_merge($validated, [
            'role' => 'agent',
            'password' => bcrypt($validated['password']),
        ]));

        return redirect()->route('admin.agents')->with('success', 'Agent account created.');
    }

    public function suspendAgent(User $agent): RedirectResponse
    {
        abort_if($agent->role !== 'agent', 403);
        $agent->update(['is_suspended' => true]);

        return back()->with('success', "{$agent->name} has been suspended.");
    }

    public function unsuspendAgent(User $agent): RedirectResponse
    {
        abort_if($agent->role !== 'agent', 403);
        $agent->update(['is_suspended' => false]);

        return back()->with('success', "{$agent->name} has been unsuspended.");
    }

    public function deleteAgent(User $agent): RedirectResponse
    {
        abort_if($agent->role !== 'agent', 403);
        // Soft-deletes agent's listings too
        $agent->properties()->delete();
        $agent->delete();

        return redirect()->route('admin.agents')->with('success', 'Agent and their listings removed.');
    }

    // ──────────────────────────────────────────────────────────────
    // Listing Moderation
    // ──────────────────────────────────────────────────────────────

    public function pendingListings(): Response
    {
        $properties = Property::where('status', 'PENDING_REVIEW')
            ->with(['agent', 'coverPhoto'])
            ->withCount('photos')
            ->latest()
            ->get();

        return Inertia::render('Admin/Listings/Pending', ['properties' => $properties]);
    }

    public function approveProperty(Property $property): RedirectResponse
    {
        $property->update(['status' => 'PUBLISHED', 'rejection_reason' => null]);

        return back()->with('success', "'{$property->name}' has been published.");
    }

    public function rejectProperty(Request $request, Property $property): RedirectResponse
    {
        $request->validate(['reason' => 'required|string|max:500']);

        $property->update([
            'status' => 'REJECTED',
            'rejection_reason' => $request->reason,
        ]);

        return back()->with('success', "'{$property->name}' has been rejected.");
    }
}
