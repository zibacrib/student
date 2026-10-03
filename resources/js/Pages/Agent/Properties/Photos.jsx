import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { FaCloudUploadAlt, FaTimes, FaStar, FaTags } from 'react-icons/fa';

export default function PropertyPhotos({ auth, property }) {
    const [dragging, setDragging] = useState(false);
    const [selectedRoomTypeId, setSelectedRoomTypeId] = useState(''); // empty string means "General Property"
    const fileInput = useRef(null);
    const { post, processing } = useForm();

    const handleFiles = (files) => {
        const formData = new FormData();
        Array.from(files).forEach(f => formData.append('photos[]', f));
        if (selectedRoomTypeId) {
            formData.append('property_room_type_id', selectedRoomTypeId);
        }
        
        router.post(route('agent.properties.photos.store', property.id), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                if (fileInput.current) fileInput.current.value = '';
            }
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    // Group photos by room type
    const generalPhotos = property.photos?.filter(p => !p.property_room_type_id) || [];
    const groupedByRoom = {};
    if (property.room_types) {
        property.room_types.forEach(rt => {
            groupedByRoom[rt.id] = {
                type: rt.type,
                price: rt.price,
                photos: property.photos?.filter(p => p.property_room_type_id === rt.id) || []
            };
        });
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="font-bold text-2xl text-gray-900 leading-tight">Photos — {property.name}</h2>}
        >
            <Head title={`Photos — ${property.name}`} />

            <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                <div className="mb-8">
                    <p className="text-gray-600 text-lg">
                        Upload photos for this listing. You can upload general photos of the boarding house (like the exterior) or assign photos to specific room types.
                        {property.status === 'DRAFT' && ' Make the listing live once you\'re happy with the photos.'}
                    </p>
                </div>

                {/* Upload Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-10">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FaCloudUploadAlt className="text-orange-500" /> Upload New Photos
                    </h3>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Assign photos to:</label>
                        <select 
                            className="w-full sm:w-1/2 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg p-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                            value={selectedRoomTypeId}
                            onChange={(e) => setSelectedRoomTypeId(e.target.value)}
                        >
                            <option value="">General Property (Exterior, common areas, etc.)</option>
                            {property.room_types && property.room_types.map(rt => (
                                <option key={rt.id} value={rt.id}>Room Type: {rt.type} (K{Number(rt.price).toLocaleString()})</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-2">Select a specific room type above if the photos you are about to upload belong to a specific room.</p>
                    </div>

                    {/* Drop Zone */}
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInput.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                            dragging ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50/30 bg-gray-50'
                        }`}
                    >
                        <div className="w-16 h-16 mx-auto bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-4">
                            <FaCloudUploadAlt className="text-3xl" />
                        </div>
                        <p className="text-lg font-bold text-gray-800 mb-1">
                            Drag & drop photos here, or click to select
                        </p>
                        <p className="text-gray-500 text-sm font-medium">
                            JPEG, PNG, WebP — max 5MB each
                        </p>
                        <input
                            ref={fileInput}
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={e => handleFiles(e.target.files)}
                        />
                    </div>
                    
                    {processing && (
                        <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-4 text-orange-700 font-bold flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                            Uploading photos, please wait...
                        </div>
                    )}
                </div>

                {/* General Photos Grid */}
                <div className="mb-10">
                    <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">General Photos</h3>
                    {generalPhotos.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {generalPhotos.map(photo => (
                                <PhotoCard key={photo.id} photo={photo} propertyId={property.id} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-8 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm border-dashed">
                            <p className="text-gray-500 text-sm">No general photos uploaded yet.</p>
                        </div>
                    )}
                </div>

                {/* Room Specific Photos */}
                {Object.keys(groupedByRoom).length > 0 && (
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">Room Specific Photos</h3>
                        <div className="space-y-8">
                            {Object.entries(groupedByRoom).map(([roomId, data]) => (
                                <div key={roomId} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FaTags className="text-orange-500" />
                                        <h4 className="text-lg font-bold text-gray-800">{data.type}</h4>
                                    </div>
                                    
                                    {data.photos.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {data.photos.map(photo => (
                                                <PhotoCard key={photo.id} photo={photo} propertyId={property.id} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                                            <p className="text-gray-500 text-sm">No photos uploaded for this room type yet.</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer Action */}
                <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h4 className="text-lg font-bold text-gray-900">Finished uploading photos?</h4>
                        <p className="text-gray-500 text-sm">You can now make your listing live on the platform for students to see.</p>
                    </div>
                    <div className="flex gap-4 w-full sm:w-auto">
                        <button 
                            onClick={() => router.get(route('agent.properties.index'))}
                            className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
                        >
                            Save as Draft
                        </button>
                        
                        {(property.status === 'DRAFT' || property.status === 'REJECTED') && (
                            <button 
                                onClick={() => post(route('agent.properties.submit', property.id))}
                                disabled={processing || (property.photos && property.photos.length === 0)}
                                className="flex-1 sm:flex-none px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Making Live...' : 'Make Live'}
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}

function PhotoCard({ photo, propertyId }) {
    const { delete: destroy, post, processing } = useForm();

    return (
        <div className={`bg-white rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md border-2 ${photo.is_cover ? 'border-orange-500' : 'border-gray-100'}`}>
            <div className="relative h-40 w-full bg-gray-100">
                <img src={photo.url} alt={photo.caption || 'Photo'} className="w-full h-full object-cover" />
                {photo.is_cover && (
                    <div className="absolute top-2 left-2 bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5">
                        <FaStar /> COVER
                    </div>
                )}
            </div>
            
            <div className="p-3 flex gap-2 bg-gray-50 border-t border-gray-100">
                {!photo.is_cover && (
                    <button onClick={() => post(route('agent.properties.photos.cover', [propertyId, photo.id]))} disabled={processing}
                        className="flex-1 bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-600 border border-gray-200 hover:border-orange-200 rounded-lg py-2 text-sm font-bold transition-colors">
                        Set Cover
                    </button>
                )}
                <button onClick={() => {
                    if (confirm('Are you sure you want to delete this photo?')) destroy(route('agent.properties.photos.destroy', [propertyId, photo.id]));
                }} disabled={processing}
                    className="flex-none bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 rounded-lg px-3 py-2 transition-colors">
                    <FaTimes />
                </button>
            </div>
        </div>
    );
}
