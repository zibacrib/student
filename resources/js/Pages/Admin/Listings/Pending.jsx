import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { FaCheckCircle, FaTimesCircle, FaEye, FaCamera } from 'react-icons/fa';

export default function PendingListings({ auth, properties }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-bold text-2xl text-gray-900 leading-tight">Review Listings</h2>}
        >
            <Head title="Pending Listings — Admin" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="mb-8">
                    <p className="text-gray-600 text-lg">Approve or reject properties submitted by agents.</p>
                </div>

                {properties.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
                            <FaCheckCircle className="text-3xl text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">All caught up!</h3>
                        <p className="text-gray-500">There are no pending listings awaiting review at this time.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {properties.map(property => (
                            <PropertyReviewCard key={property.id} property={property} />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

function PropertyReviewCard({ property }) {
    const { post, processing, data, setData } = useForm({ reason: '' });

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-6 items-start">
            
            {/* Cover thumb */}
            <div className="w-full md:w-48 h-36 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                {property.cover_photo ? (
                    <img src={property.cover_photo.url} alt="" className="w-full h-full object-cover" />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                        <FaCamera className="text-2xl mb-1 text-gray-300" />
                        No Photo
                    </div>
                )}
                <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded shadow-sm">
                    Pending
                </div>
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded">
                    {property.photos_count} Photos
                </div>
            </div>

            <div className="flex-1 min-w-0 w-full">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 truncate pr-4">{property.name}</h3>
                    <div className="text-lg font-black text-orange-600 flex-shrink-0">
                        K{Number(property.price_from).toLocaleString()}
                        <span className="text-xs font-normal text-gray-500 ml-1">/{property.price_label}</span>
                    </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">
                    {property.city} • {property.type} • Agent: <span className="font-semibold">{property.agent?.name}</span>
                </p>
                
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                    {property.description}
                </p>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={data.reason}
                            onChange={e => setData('reason', e.target.value)}
                            placeholder="Rejection reason (if rejecting)..."
                            className="flex-1 bg-white border border-gray-200 text-gray-900 rounded-lg p-2.5 outline-none focus:border-red-500 text-sm"
                        />
                        <div className="flex gap-2 shrink-0">
                            <button onClick={() => post(route('admin.listings.reject', property.id))} disabled={processing || !data.reason}
                                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 disabled:opacity-50 border border-red-200 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors">
                                <FaTimesCircle /> Reject
                            </button>
                            <button onClick={() => post(route('admin.listings.approve', property.id))} disabled={processing}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 rounded-lg px-6 py-2.5 text-sm font-bold shadow-sm transition-colors">
                                <FaCheckCircle /> Approve
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="w-full md:w-auto flex-shrink-0">
                <Link href={route('listings.show', property.slug)} className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors w-full md:w-auto">
                    <FaEye /> Preview
                </Link>
            </div>
        </div>
    );
}
