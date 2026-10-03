import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { FaHeart, FaMapMarkerAlt, FaBed } from 'react-icons/fa';
import { BiMap } from 'react-icons/bi';

export default function Dashboard({ auth, favourites }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">My Saved Properties</h2>}
        >
            <Head title="Dashboard - ZibaCrib" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Stats Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-8 border border-gray-100">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Welcome back, {auth.user.name}!</h3>
                            <p className="text-gray-600">
                                You have {favourites.length} saved propert{favourites.length === 1 ? 'y' : 'ies'}.
                            </p>
                        </div>
                    </div>

                    {/* Favourites Grid */}
                    {favourites.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-20 h-20 mx-auto mb-4 bg-orange-50 rounded-full flex items-center justify-center">
                                <FaHeart className="text-3xl text-orange-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No saved properties yet</h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                Start exploring properties and click the 'Save' button to keep track of your favorites here.
                            </p>
                            <Link href="/" className="bg-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors inline-block">
                                Browse Properties
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favourites.map((property) => (
                                <Link key={property.id} href={route('listings.show', property.slug)} className="block group">
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col relative">
                                        
                                        {/* Heart Icon to indicate saved status */}
                                        <div className="absolute top-3 right-3 z-10 bg-white p-2 rounded-full shadow-md text-red-500">
                                            <FaHeart />
                                        </div>

                                        <div className="h-48 w-full bg-cover bg-center bg-gray-200 relative"
                                            style={{ backgroundImage: `url(${property.cover_photo?.url || '/assets/home.png'})` }}>
                                            <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow-sm">
                                                {property.type}
                                            </span>
                                        </div>
                                        
                                        <div className="p-5 flex-1 flex flex-col">
                                            <h3 className="text-gray-900 font-bold text-lg mb-2 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors">
                                                {property.name}
                                            </h3>
                                            
                                            <div className="space-y-3 mt-auto">
                                                <div className="flex items-center text-gray-500 text-sm">
                                                    <BiMap className="mr-2 text-gray-400 text-lg" />
                                                    <span className="truncate">{property.city} {property.area ? `- ${property.area}` : ''}</span>
                                                </div>
                                                
                                                {property.total_units > 0 && (
                                                    <div className="flex items-center text-gray-500 text-sm">
                                                        <FaBed className="mr-2 text-gray-400 text-lg" />
                                                        <span>{property.available_units} units available</span>
                                                    </div>
                                                )}
                                                
                                                <div className="pt-4 mt-2 border-t border-gray-100 flex items-center justify-between">
                                                    <div className="text-orange-600 font-black text-lg">
                                                        K{Number(property.price_from).toLocaleString()}
                                                        <span className="text-gray-400 text-xs font-normal ml-1">/{property.price_label}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
