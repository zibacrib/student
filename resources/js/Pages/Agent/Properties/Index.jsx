import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FaBuilding, FaCamera, FaEdit, FaPaperPlane, FaTrash } from 'react-icons/fa';

export default function AgentPropertiesIndex({ auth, properties }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-bold text-2xl text-gray-900 leading-tight">My Properties</h2>}
        >
            <Head title="My Listings — ZibaCrib" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <p className="text-gray-600 text-lg">Manage your listings, upload photos, and track enquiries.</p>
                    </div>
                    <Link href={route('agent.properties.create')} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg shadow-sm transition-colors flex items-center gap-2">
                        <span>+</span> New Listing
                    </Link>
                </div>

                {properties.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-orange-50 rounded-full flex items-center justify-center">
                            <FaBuilding className="text-3xl text-orange-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">You haven't created any listings yet</h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            Start adding your properties to the platform so students can discover and book them.
                        </p>
                        <Link href={route('agent.properties.create')} className="bg-gray-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-black transition-colors inline-block">
                            Create Your First Listing
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {properties.map(property => (
                            <PropertyRow key={property.id} property={property} />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

function PropertyRow({ property }) {
    const { post, delete: destroy, processing } = useForm();

    const statusColors = {
        DRAFT: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Draft' },
        PENDING_REVIEW: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Under Review' },
        PUBLISHED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Published' },
        REJECTED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Needs Action' },
    };
    const st = statusColors[property.status] || statusColors.DRAFT;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col md:flex-row gap-6 items-center transition-shadow hover:shadow-md">
            
            {/* Cover thumb */}
            <div className="w-full md:w-40 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                {property.cover_photo ? (
                    <img src={property.cover_photo.url} alt="" className="w-full h-full object-cover" />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                        <FaCamera className="text-2xl mb-1 text-gray-300" />
                        No Photo
                    </div>
                )}
                <div className={`absolute top-2 left-2 ${st.bg} ${st.text} text-xs font-bold px-2 py-1 rounded shadow-sm`}>
                    {st.label}
                </div>
            </div>

            <div className="flex-1 min-w-0 w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">{property.name}</h3>
                <p className="text-gray-600 text-sm mb-3">
                    {property.city} • {property.type} • K{Number(property.price_from).toLocaleString()} / {property.price_label}
                </p>
                
                {property.enquiries_count > 0 && (
                    <div className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
                        {property.enquiries_count} Enquiries
                    </div>
                )}
                
                {property.rejection_reason && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 mt-2">
                        <strong>Feedback:</strong> {property.rejection_reason}
                    </div>
                )}
            </div>

            <div className="flex flex-wrap md:flex-col gap-2 flex-shrink-0 w-full md:w-auto">
                <Link href={route('agent.properties.photos', property.id)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold transition-colors">
                    <FaCamera /> Photos
                </Link>
                
                <Link href={route('agent.properties.edit', property.id)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold transition-colors">
                    <FaEdit /> Edit
                </Link>

                {property.status === 'DRAFT' || property.status === 'REJECTED' ? (
                    <button onClick={() => post(route('agent.properties.submit', property.id))} disabled={processing}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg px-4 py-2 text-sm font-bold transition-colors">
                        <FaPaperPlane /> Make Live
                    </button>
                ) : null}
                
                <button onClick={() => {
                    if (confirm('Are you sure you want to completely remove this listing? This action cannot be undone.')) destroy(route('agent.properties.destroy', property.id));
                }} disabled={processing} className="flex-1 md:flex-none flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg px-4 py-2 text-sm font-bold transition-colors">
                    <FaTrash /> Delete
                </button>
            </div>
        </div>
    );
}
