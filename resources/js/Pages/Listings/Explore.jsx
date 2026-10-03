import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { FaAngleRight, FaCheckCircle, FaFacebook, FaHeart, FaWhatsapp, FaVenusMars, FaBed } from "react-icons/fa";
import { BiMap, BiSearch } from "react-icons/bi";
import { FaEnvelope, FaPhone, FaLinkedin, FaStar, FaUsers, FaHome } from "react-icons/fa";
import { FaLocationDot, FaMagnifyingGlass, FaShield } from "react-icons/fa6";

export default function ListingsIndex({ auth, properties, filters, favouriteIds = [], areas = [], streets = [] }) {
    const [localFilters, setLocalFilters] = useState(filters);

    const applyFilters = (e) => {
        e.preventDefault();
        router.get('/', localFilters, { preserveState: true });
    };

    const handleClick = (url) => {
        window.location.href = url;
    };

    const features = [
        {
            icon: <FaShield className="text-3xl text-blue-600" />,
            title: 'Verified Properties',
            description: 'Every listing is thoroughly verified to ensure safety and authenticity.'
        },
        {
            icon: <FaStar className="text-3xl text-green-600" />,
            title: 'No Hidden Fees',
            description: 'Transparent pricing with no surprise charges. What you see is what you pay.'
        },
        {
            icon: <FaUsers className="text-3xl text-purple-600" />,
            title: 'Trusted Community',
            description: 'Join the students who found their perfect home through us.'
        },
        {
            icon: <FaHome className="text-3xl text-orange-600" />,
            title: 'Easy Booking',
            description: 'Simple, secure booking process with instant confirmation.'
        }
    ];

    return (
        <>
            <Head title="ZibaCrib - Find Your Perfect Student Accommodation" />
            <div className="min-h-screen bg-white font-sans">
                {/* Navigation */}
                <header className="fixed py-2 top-0 w-full z-50 bg-white shadow-sm border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center">
                                <ApplicationLogo className="h-10 w-auto" />
                            </div>
                            <nav className="flex items-center space-x-4">
                                {auth.user ? (
                                    <>
                                        <Link to="/dashboard" className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                            Dashboard
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link href={route('login')} className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                            Log in
                                        </Link>
                                        <Link href={route('register')} className="bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-700 transition-colors">
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                <div className="pt-24 pb-8 bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Explore Boarding Houses</h1>
                                <p className="text-gray-500 mt-2">Find your perfect student accommodation</p>
                            </div>
                            <form onSubmit={applyFilters} className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                <select value={localFilters.area || ''} onChange={e => setLocalFilters(f => ({ ...f, area: e.target.value }))} className="flex-1 bg-white border-none text-gray-800 text-sm rounded-xl px-4 py-2.5 justify-between outline-none focus:ring-2 focus:ring-orange-500 shadow-sm">
                                    <option value="">All Areas</option>
                                    {areas.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                                <select value={localFilters.street || ''} onChange={e => setLocalFilters(f => ({ ...f, street: e.target.value }))} className="flex-1 bg-white border-none text-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500 shadow-sm">
                                    <option value="">All Streets</option>
                                    {streets.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <input type="number" placeholder="Max Price" value={localFilters.max_price || ''} onChange={e => setLocalFilters(f => ({ ...f, max_price: e.target.value }))} className="flex-1 w-32 bg-white border-none text-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500 shadow-sm" />
                                <button type="submit" className="bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-700 transition-colors shadow-sm w-full md:w-auto">
                                    Filter
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Properties Section */}
                <section className="py-20 bg-gray-50" id="properties">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Discover Properties
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Browse our verified listings handpicked for you.
                            </p>
                        </div>

                        {properties.data.length === 0 ? (
                            <div className="text-center py-20 text-gray-500 text-xl">
                                No properties found matching your search.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                                {properties.data.map((property) => (
                                    <Link key={property.id} href={route('listings.show', property.slug)} className="block group">
                                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
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
                                                        <button className="bg-gray-900 text-white p-2 rounded-lg group-hover:bg-orange-500 transition-colors">
                                                            <FaAngleRight />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>



                {/* Footer */}
                <footer className="bg-gray-900 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="grid md:grid-cols-4 gap-8">
                            <div className="md:col-span-1">
                                <span className="text-2xl font-black text-orange-500">ZibaCrib</span>
                                <p className="mt-4 text-gray-400 text-sm">Making student accommodation simple, safe, and stress-free.</p>
                                <div className="flex space-x-4 mt-6">
                                    <button onClick={() => handleClick('https://www.facebook.com/profile.php?id=61581165293732')} className="text-gray-400 hover:text-white transition-colors"><FaFacebook className="text-xl" /></button>
                                    <button onClick={() => handleClick('https://linkedin.com/company/zibacrib')} className="text-gray-400 hover:text-white transition-colors"><FaLinkedin className="text-xl" /></button>
                                    <button onClick={() => handleClick('mailto:zibacrib@gmail.com')} className="text-gray-400 hover:text-white transition-colors"><FaEnvelope className="text-xl" /></button>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer" onClick={() => handleClick("tel:+260974442945")}>
                                        <FaPhone className="mr-3 text-orange-500" /><span>+260 974 442 945</span>
                                    </div>
                                    <div className="flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer" onClick={() => handleClick("mailto:zibacrib@gmail.com")}>
                                        <FaEnvelope className="mr-3 text-orange-500" /><span>zibacrib@gmail.com</span>
                                    </div>
                                    <div className="flex items-start text-gray-400">
                                        <FaLocationDot className="mr-3 mt-1 text-orange-500 flex-shrink-0" />
                                        <span>Jambo Dr, Riverside, Kitwe, Zambia</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
                                <div className="space-y-2">
                                    <Link href={route('login')} className="block text-gray-400 hover:text-white transition-colors">Student Login</Link>
                                    <Link href={route('login')} className="block text-gray-400 hover:text-white transition-colors">Property Owner</Link>
                                    <button onClick={() => handleClick('https://chat.whatsapp.com/Klsv3Rjg6laKLRvObggPc2?mode=wwt')} className="block text-gray-400 hover:text-white transition-colors text-left">Community</button>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
                            &copy; {new Date().getFullYear()} ZibaCrib. All rights reserved. Powered by ZibaCrib Technologies.
                        </div>
                    </div>
                </footer>

                {/* WhatsApp Float */}
                <div className="fixed bottom-6 right-6 z-50">
                    <button onClick={() => handleClick('https://wa.me/+260777393799?text=Hi,%20I%20would%20like%20to%20learn%20more%20about%20ZibaCrib')} className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform duration-300 hover:scale-110">
                        <FaWhatsapp className="text-2xl" />
                    </button>
                </div>
            </div>
        </>
    );
}
