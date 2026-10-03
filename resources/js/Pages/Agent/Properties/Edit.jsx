import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { FaPlus, FaTimes } from 'react-icons/fa';

export default function EditProperty({ property, amenities }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: property.name || '', 
        description: property.description || '',
        address: property.address || '', 
        city: property.city || '', 
        area: property.area || '',
        room_types: property.room_types && property.room_types.length > 0 ? property.room_types : [{ type: '1 Person', price: '' }],
        amenity_ids: property.amenities ? property.amenities.map(a => a.id) : [],
        fees: property.fees || [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('agent.properties.update', property.id));
    };

    const toggleAmenity = (id) => {
        setData('amenity_ids', data.amenity_ids.includes(id)
            ? data.amenity_ids.filter(a => a !== id)
            : [...data.amenity_ids, id]);
    };

    const addFee = () => {
        setData('fees', [...data.fees, { label: '', amount: '', is_included: false, notes: '' }]);
    };

    const updateFee = (i, field, value) => {
        const updated = [...data.fees];
        updated[i] = { ...updated[i], [field]: value };
        setData('fees', updated);
    };

    const removeFee = (i) => setData('fees', data.fees.filter((_, idx) => idx !== i));

    const addRoomType = () => {
        setData('room_types', [...data.room_types, { type: '1 Person', price: '' }]);
    };

    const updateRoomType = (i, field, value) => {
        const updated = [...data.room_types];
        updated[i] = { ...updated[i], [field]: value };
        setData('room_types', updated);
    };

    const removeRoomType = (i) => setData('room_types', data.room_types.filter((_, idx) => idx !== i));

    const amenityByCategory = amenities.reduce((acc, a) => {
        const cat = a.category || 'other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(a);
        return acc;
    }, {});

    const roomTypeOptions = [
        '1 Person (Single)', 
        '2 People (Sharing)', 
        '3 People (Sharing)', 
        '4 People (Sharing)',
        '5 People (Sharing)',
        '6 People (Sharing)',
        '7 People (Sharing)',
        '8 People (Sharing)',
        '9 People (Sharing)',
        '10 People (Sharing)',
        '11 People (Sharing)',
        '12 People (Sharing)',
        'Entire Apartment/House'
    ];

    return (
        <AuthenticatedLayout
            header={<h2 className="font-bold text-2xl text-gray-900 leading-tight">Edit Listing: {property.name}</h2>}
        >
            <Head title={`Edit ${property.name} — ZibaCrib`} />

            <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 py-8">
                {Object.keys(errors).length > 0 && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium text-sm border border-red-100">
                        Please check the form for errors before saving.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* BASIC INFO */}
                    <Section title="Basic Information">
                        <Field label="Property Name *" error={errors.name}>
                            <input className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg p-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                                value={data.name} onChange={e => setData('name', e.target.value)} placeholder="e.g. Sunset Hostel Limbe" required />
                        </Field>
                        
                        <div className="mt-6">
                            <Field label="Description (Optional)" error={errors.description}>
                                <textarea className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg p-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors min-h-[120px]"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)} placeholder="Describe the property..." />
                            </Field>
                        </div>
                    </Section>

                    {/* LOCATION */}
                    <Section title="Location">
                        <Row>
                            <Field label="Street Address *" error={errors.address}>
                                <input className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg p-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                                    value={data.address} onChange={e => setData('address', e.target.value)} required placeholder="e.g. 12 Market Road" />
                            </Field>
                            <Field label="City *" error={errors.city}>
                                <input className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg p-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                                    value={data.city} onChange={e => setData('city', e.target.value)} required placeholder="e.g. Blantyre" />
                            </Field>
                        </Row>
                        <Field label="Neighbourhood / Area" error={errors.area}>
                            <input className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg p-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                                value={data.area} onChange={e => setData('area', e.target.value)} placeholder="e.g. Near UNIMA, Limbe" />
                        </Field>
                    </Section>

                    {/* PRICING & ROOM TYPES */}
                    <Section title="Room Types & Pricing *">
                        <p className="text-sm text-gray-500 mb-4">Add all the room options available at your boarding house.</p>
                        
                        {errors.room_types && <p className="text-red-500 text-sm mb-4 font-bold">{errors.room_types}</p>}

                        <div className="space-y-4 mb-4">
                            {data.room_types.map((room, i) => (
                                <div key={i} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                                    <div className="flex-1 w-full">
                                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Capacity / Type</label>
                                        <select className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg p-2.5 outline-none focus:border-orange-500"
                                            value={room.type} onChange={e => updateRoomType(i, 'type', e.target.value)} required>
                                            {roomTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </div>
                                    
                                    <div className="flex-1 w-full">
                                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Price (Kwacha)</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-gray-500 font-bold">K</span>
                                            <input className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg p-2.5 pl-8 outline-none focus:border-orange-500"
                                                type="number" min="0" value={room.price} onChange={e => updateRoomType(i, 'price', e.target.value)} placeholder="e.g. 50000" required />
                                        </div>
                                    </div>
                                    
                                    {data.room_types.length > 1 && (
                                        <button type="button" onClick={() => removeRoomType(i)} className="mt-5 md:mt-6 p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors w-full md:w-auto flex justify-center">
                                            <FaTimes />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addRoomType} className="flex items-center gap-2 px-5 py-2.5 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg font-bold text-sm transition-colors">
                            <FaPlus className="text-xs" /> Add Another Room Type
                        </button>
                    </Section>

                    {/* AMENITIES */}
                    <Section title="Amenities">
                        {Object.entries(amenityByCategory).map(([cat, items]) => (
                            <div key={cat} className="mb-6 last:mb-0">
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">{cat}</p>
                                <div className="flex flex-wrap gap-3">
                                    {items.map(a => {
                                        const selected = data.amenity_ids.includes(a.id);
                                        return (
                                            <button type="button" key={a.id} onClick={() => toggleAmenity(a.id)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                                                    selected 
                                                    ? 'bg-orange-50 border-orange-500 text-orange-700' 
                                                    : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300 hover:bg-orange-50'
                                                }`}>
                                                {a.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </Section>

                    {/* FEES */}
                    <Section title="Additional Fees (Optional)">
                        <div className="space-y-3 mb-4">
                            {data.fees.map((fee, i) => (
                                <div key={i} className="flex flex-col md:flex-row gap-3 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <input className="w-full md:w-2/5 bg-white border border-gray-200 text-gray-900 rounded-lg p-2.5 outline-none focus:border-orange-500"
                                        value={fee.label} onChange={e => updateFee(i, 'label', e.target.value)} placeholder="Fee label (e.g. Security Deposit)" required />
                                    
                                    <input className="w-full md:w-1/4 bg-white border border-gray-200 text-gray-900 rounded-lg p-2.5 outline-none focus:border-orange-500"
                                        type="number" min="0" value={fee.amount} onChange={e => updateFee(i, 'amount', e.target.value)} placeholder="Amount (K)" required />
                                    
                                    <label className="flex-1 flex items-center gap-2 text-gray-600 text-sm font-medium cursor-pointer">
                                        <input type="checkbox" className="rounded text-orange-600 focus:ring-orange-500 h-4 w-4"
                                            checked={fee.is_included} onChange={e => updateFee(i, 'is_included', e.target.checked)} />
                                        Included
                                    </label>
                                    
                                    <button type="button" onClick={() => removeFee(i)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addFee} className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm transition-colors">
                            <FaPlus className="text-xs" /> Add Fee
                        </button>
                    </Section>

                    <div className="pt-4 border-t border-gray-200">
                        <button type="submit" disabled={processing}
                            className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-lg shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

function Section({ title, children }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">{title}</h2>
            {children}
        </div>
    );
}

function Row({ children }) {
    return <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">{children}</div>;
}

function Field({ label, children, error }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">{label}</label>
            {children}
            {error && <span className="text-red-500 text-xs font-medium">{error}</span>}
        </div>
    );
}
