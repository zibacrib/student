import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { FaMapMarkerAlt, FaExpand, FaCamera, FaWhatsapp, FaBed, FaCheckCircle } from 'react-icons/fa';
import { BiHeart, BiMap, BiShare } from 'react-icons/bi';
import { useState } from 'react';
import * as LucideIcons from 'lucide-react';

const toPascalCase = (str) => {
    return (str.match(/[a-zA-Z0-9]+/g) || []).map(w => `${w.charAt(0).toUpperCase()}${w.slice(1)}`).join('');
};

export default function ListingShow({ property, isFavourited }) {
    const { auth } = usePage().props;
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const photos = property.photos || [];

    console.log(property)

    const handleNextImage = (e) => {
        e.stopPropagation();
        if (selectedImageIndex < photos.length - 1) {
            setSelectedImageIndex(selectedImageIndex + 1);
        }
    };

    const handlePrevImage = (e) => {
        e.stopPropagation();
        if (selectedImageIndex > 0) {
            setSelectedImageIndex(selectedImageIndex - 1);
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: property.name,
                    text: `Check out ${property.name} on ZibaCrib!`,
                    url: url,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
        }
    };

    const handleSave = () => {
        if (!auth.user) {
            window.location.href = route('login');
            return;
        }
        
        router.post(route('listings.favourite', property.id), {}, {
            preserveScroll: true
        });
    };

    const mainImage = property.photos?.[0]?.url || '/assets/home.png';
    const secondImage = property.photos?.[1]?.url || mainImage;
    const thirdImage = property.photos?.[2]?.url || mainImage;

    return (
        <>
            <Head title={`${property.name} — ZibaCrib`} />
            <div className="min-h-screen bg-gray-50 font-sans pb-20">

                {/* Navigation */}
                <header className="py-4 bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <Link href="/" className="text-2xl font-black text-orange-600 no-underline">
                            ZibaCrib
                        </Link>
                        <Link href="/" className="text-gray-500 hover:text-orange-600 font-medium">
                            ← Back to listings
                        </Link>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                    
                    {/* Header */}
                    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full uppercase mb-3 inline-block">
                                {property.type}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-2">
                                {property.name}
                            </h1>
                            <div className="flex items-center text-gray-600 text-sm md:text-base">
                                <FaMapMarkerAlt className="mr-2 text-gray-400" />
                                <span>{property.address}, {property.city}</span>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex space-x-3">
                            <button onClick={handleShare} className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                                <BiShare className="mr-2 text-lg" /> Share
                            </button>
                            <button onClick={handleSave} className={`flex items-center px-4 py-2 border rounded-lg transition-colors font-medium ${isFavourited ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}>
                                <BiHeart className={`mr-2 text-lg ${isFavourited ? 'fill-current' : ''}`} /> 
                                {isFavourited ? 'Saved' : 'Save'}
                            </button>
                        </div>
                    </div>

                    {/* Image Gallery */}
                    <div className="relative flex gap-4 h-96 w-full mb-12">
                        {/* Main Image */}
                        <div
                            className="flex-3/5 h-full bg-gray-200 rounded-xl overflow-hidden cursor-pointer group relative"
                            style={{ flex: '3' }}
                            onClick={() => setSelectedImageIndex(0)}
                        >
                            <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{ backgroundImage: `url(${mainImage})` }}>
                            </div>
                        </div>

                        {/* Side Images */}
                        <div className="flex-2/5 flex flex-col gap-4 hidden md:flex" style={{ flex: '2' }}>
                            <div className="flex-1 h-1/2 bg-gray-200 rounded-xl overflow-hidden cursor-pointer group relative"
                                onClick={() => setSelectedImageIndex(1)}>
                                <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundImage: `url(${secondImage})` }}>
                                </div>
                            </div>
                            <div className="flex-1 h-1/2 bg-gray-200 rounded-xl overflow-hidden cursor-pointer group relative"
                                onClick={() => setSelectedImageIndex(2)}>
                                <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundImage: `url(${thirdImage})` }}>
                                </div>
                            </div>
                        </div>

                        <div className='absolute bottom-4 right-4 md:right-[42%]'>
                            <button 
                                onClick={() => photos.length > 0 && setSelectedImageIndex(0)}
                                className='flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 hover:bg-white transition-all'
                            >
                                <FaCamera className='mr-2 text-gray-700' />
                                <span className="text-sm font-medium text-gray-700">
                                    {photos.length} Photos
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* LEFT COL */}
                        <div className="lg:col-span-2 space-y-10">
                            
                            {/* Description */}
                            {property.description && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About this property</h2>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                                        {property.description}
                                    </p>
                                </div>
                            )}

                            {/* Rooms Available */}
                            {property.room_types?.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Rooms Available</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {property.room_types.map(room => (
                                            <div key={room.id} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4 shrink-0">
                                                        <FaBed className="text-orange-600 text-xl" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 text-lg">{room.type} Person Room</div>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <div className="text-xl font-black text-orange-600">
                                                        K{Number(room.price).toLocaleString()}
                                                    </div>
                                                    <div className="text-xs text-gray-500 font-medium">per {property.price_label || 'month'}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Amenities */}
                            {property.amenities?.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">What this place offers</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                                        {property.amenities.map(a => {
                                            const IconName = toPascalCase(a.icon || 'check-circle');
                                            const Icon = LucideIcons[IconName] || LucideIcons.CheckCircle;
                                            return (
                                                <div key={a.id} className="flex items-center text-gray-700 font-medium">
                                                    <Icon className="text-orange-500 mr-3 w-5 h-5" />
                                                    {a.name}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Fees */}
                            {property.fees?.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Fees & Policies</h2>
                                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                        <table className="w-full">
                                            <tbody className="divide-y divide-gray-100">
                                                {property.fees.map(fee => (
                                                    <tr key={fee.id}>
                                                        <td className="px-6 py-4 text-gray-700 font-medium">{fee.label}</td>
                                                        <td className="px-6 py-4 text-right">
                                                            {fee.is_included 
                                                                ? <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-lg">Included</span>
                                                                : <span className="font-bold text-gray-900">K{Number(fee.amount).toLocaleString()}</span>
                                                            }
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT COL — Contact Form */}
                        <div className="relative">
                            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 p-6">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Contact Agent</h3>
                                    <p className="text-gray-500 text-sm">Reach out to the agent directly to arrange a viewing.</p>
                                </div>

                                <div className="flex items-center mb-6 p-4 bg-orange-50 rounded-xl">
                                    <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl mr-4">
                                        {(property.agent?.agency_name || property.agent?.name || 'A')[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">{property.agent?.agency_name || property.agent?.name}</div>
                                        <div className="text-orange-600 text-sm font-medium">Verified Agent</div>
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    {(() => {
                                        let phoneStr = property.agent?.phone?.replace(/\D/g, '') || '';
                                        if (phoneStr && !phoneStr.startsWith('26')) {
                                            if (phoneStr.startsWith('0')) {
                                                phoneStr = '26' + phoneStr.substring(1);
                                            } else {
                                                phoneStr = '26' + phoneStr;
                                            }
                                        }
                                        return (
                                            <>
                                                <a 
                                                    href={`https://wa.me/${phoneStr}?text=Hi, I am interested in your listing: ${property.name}`} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center"
                                                >
                                                    <FaWhatsapp className="mr-2 text-xl" /> WhatsApp
                                                </a>
                                                
                                                <a 
                                                    href={`tel:+${phoneStr}`} 
                                                    className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center"
                                                >
                                                    <LucideIcons.Phone className="mr-2 w-5 h-5" /> Call Agent
                                                </a>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Photo Viewing Modal */}
            {selectedImageIndex !== null && photos.length > 0 && (() => {
                const currentPhoto = photos[selectedImageIndex];
                let photoTitle = '';
                if (currentPhoto?.room_type) {
                    photoTitle = `${currentPhoto.room_type.type} Person Room (K${Number(currentPhoto.room_type.price).toLocaleString()})`;
                } else {
                    photoTitle = 'General Property Photo';
                }

                return (
                    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col backdrop-blur-md">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 text-white">
                            <div className="font-medium text-lg">
                                {selectedImageIndex + 1} / {photos.length}
                            </div>
                            <button 
                                onClick={() => setSelectedImageIndex(null)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <LucideIcons.X className="w-8 h-8" />
                            </button>
                        </div>

                        {/* Image Container */}
                        <div className="flex-1 flex flex-col items-center justify-center relative px-4 pb-12" onClick={() => setSelectedImageIndex(null)}>
                            {selectedImageIndex > 0 && (
                                <button 
                                    onClick={handlePrevImage}
                                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
                                >
                                    <LucideIcons.ChevronLeft className="w-8 h-8" />
                                </button>
                            )}
                            
                            <div className="w-full h-full max-h-[75vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                                <img 
                                    src={photos[selectedImageIndex].url} 
                                    alt={`Property view ${selectedImageIndex + 1}`}
                                    className="max-h-full max-w-full object-contain rounded-lg"
                                />
                            </div>

                            <div className="mt-6 text-center text-white" onClick={(e) => e.stopPropagation()}>
                                <h3 className="text-2xl font-bold">{photoTitle}</h3>
                            </div>

                            {selectedImageIndex < photos.length - 1 && (
                                <button 
                                    onClick={handleNextImage}
                                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
                                >
                                    <LucideIcons.ChevronRight className="w-8 h-8" />
                                </button>
                            )}
                        </div>
                    </div>
                );
            })()}
        </>
    );
}
