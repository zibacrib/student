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
                                        <Link href={route('listings.explore')} className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md font-medium transition-colors hidden md:flex items-center">
                                            <FaMagnifyingGlass className="mr-2" /> Search
                                        </Link>
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

                {/* Hero Section */}
                <section className="relative h-[550px] mt-20 text-white flex items-center justify-center">
                    <div className="absolute inset-0 z-0">
                        <img src="/assets/students.jpg" className="w-full h-full object-cover" alt="Students" />
                        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                    </div>
                    
                    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Your Campus. Your Crew
                            <br />
                            <span className="text-orange-500">Your Crib.</span>
                        </h1>
                        <p className="text-lg md:text-2xl mb-8 text-white max-w-3xl mx-auto">
                            Find verified, affordable boarding houses near your campus.
                            No scams. No stress. Just your perfect space.
                        </p>
                        
                        {/* Filters integrated into Hero */}
                        <form onSubmit={applyFilters} className="bg-white p-2 md:p-3 rounded-2xl shadow-xl max-w-4xl mx-auto flex flex-col md:flex-row gap-2 mt-8">
                            <select value={localFilters.area || ''} onChange={e => setLocalFilters(f => ({ ...f, area: e.target.value }))} className="flex-1 bg-gray-50 border-none text-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500">
                                <option value="">All Areas</option>
                                {areas.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                            <div className="hidden md:block w-px bg-gray-200 my-2"></div>
                            <select value={localFilters.street || ''} onChange={e => setLocalFilters(f => ({ ...f, street: e.target.value }))} className="flex-1 bg-gray-50 border-none text-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500">
                                <option value="">All Streets</option>
                                {streets.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <div className="hidden md:block w-px bg-gray-200 my-2"></div>
                            <input type="number" placeholder="Max Price (MWK)" value={localFilters.max_price || ''} onChange={e => setLocalFilters(f => ({ ...f, max_price: e.target.value }))} className="flex-1 bg-gray-50 border-none text-gray-800 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500" />
                            <button type="submit" className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-orange-700 transition-colors shadow-md">
                                Search
                            </button>
                        </form>
                    </div>
                </section>

                {/* Properties Section */}
                <section className="py-20 bg-gray-50" id="properties">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                    Boarding Houses Near You
                                </h2>
                                <p className="text-gray-500">
                                    Explore top-rated accommodation in your area.
                                </p>
                            </div>
                            <Link href={route('listings.explore')} className="hidden md:flex items-center text-orange-600 font-bold hover:text-orange-700">
                                Explore all <FaAngleRight className="ml-1" />
                            </Link>
                        </div>

                        {properties.data.length === 0 ? (
                            <div className="text-center py-20 text-gray-500 text-xl">
                                No properties found matching your search.
                            </div>
                        ) : (
                            <div className="relative group">
                                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-8 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                    {properties.data.map((property) => (
                                        <Link key={property.id} href={route('listings.show', property.slug)} className="snap-start shrink-0 w-[42%] md:w-[23%] block group">
                                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
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
                                {/* Floating Arrow for Desktop */}
                                <div className="absolute right-0 top-[40%] -translate-y-1/2 translate-x-1/2 z-10 hidden md:block">
                                    <Link href={route('listings.explore')} className="bg-white text-orange-600 rounded-full p-4 shadow-xl border border-gray-100 flex items-center justify-center hover:bg-orange-50 transition-all hover:scale-110">
                                        <FaAngleRight className="text-xl" />
                                    </Link>
                                </div>
                            </div>
                        )}
                        
                        <div className="mt-6 text-center md:hidden">
                            <Link href={route('listings.explore')} className="inline-flex items-center text-orange-600 font-bold hover:text-orange-700 bg-orange-50 px-6 py-3 rounded-xl w-full justify-center">
                                See all boarding houses <FaAngleRight className="ml-2" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="hidden py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Why Choose ZibaCrib?
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                We've transformed the student accommodation search from stressful to seamless
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => (
                                <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow border border-transparent hover:border-gray-100">
                                    <div className="flex justify-center mb-4">
                                        <div className="bg-blue-50 p-4 rounded-full">{feature.icon}</div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="hidden py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Find Your Home in 3 Steps
                            </h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <BiSearch className="text-2xl text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-4">1. Search & Explore</h3>
                                <p className="text-gray-600">Browse verified properties with filters for location, price, and amenities that matter to you.</p>
                            </div>
                            <div className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FaHeart className="text-2xl text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-4">2. Choose & Book</h3>
                                <p className="text-gray-600">Found your perfect space? Get landlord's contact and book immediately.</p>
                            </div>
                            <div className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FaCheckCircle className="text-2xl text-orange-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-4">3. Move In & Relax</h3>
                                <p className="text-gray-600">Get confirmed instantly and move into your new home. It's really that simple!</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Story Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row items-center gap-12">
                            <div className="lg:w-1/2">
                                <img src="/assets/zibacrib_emily_george.jpg" alt="ZibaCrib Co-Founders" className="rounded-2xl shadow-lg w-full" />
                            </div>
                            <div className="lg:w-1/2">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                    Born from Student Frustration
                                </h2>
                                <div className="space-y-4 text-gray-600 text-lg">
                                    <p>When I was accepted at CBU in 2023, I was beyond excited to start my journey at the best university in the country. But then came the challenge of finding accommodation.</p>
                                    <p>The process was exhausting—endless posts in groups, not knowing who to trust, hearing stories of scammers and high agent fees. After weeks of frustration, I finally found a boarding house.</p>
                                    <p>Fast forward to the year 2025, I still recognize how fractured this system is. Most of my friends still struggle just like I struggled. It was then that I knew change was needed. I, along with my friends, came up with the idea of ZibaCrib, a secure, credible, and hassle-free platform that enables students to easily discover reputable boarding houses quickly.</p>
                                    <p className="text-sm text-gray-500 font-medium italic mt-4">- Palanga Nkobi, Co-Founder</p>
                                </div>
                            </div>
                        </div>
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
