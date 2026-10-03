import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function CreateAgent({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        agency_name: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.agents.store'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-bold text-2xl text-gray-900 leading-tight">Create Agent Account</h2>}
        >
            <Head title="Create Agent — Admin" />

            <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-between">
                    <p className="text-gray-600 text-lg">Create a new agent account so they can list properties.</p>
                    <Link href={route('admin.agents')} className="text-orange-600 font-bold hover:underline text-sm">
                        ← Back to Agents
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <form onSubmit={submit} className="space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">Full Name *</label>
                                <input 
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg p-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)} 
                                    required 
                                    placeholder="e.g. John Doe" 
                                />
                                {errors.name && <span className="text-red-500 text-xs font-medium">{errors.name}</span>}
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">Email Address *</label>
                                <input 
                                    type="email"
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg p-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                                    value={data.email} 
                                    onChange={e => setData('email', e.target.value)} 
                                    required 
                                    placeholder="agent@example.com" 
                                />
                                {errors.email && <span className="text-red-500 text-xs font-medium">{errors.email}</span>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Phone */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                                <input 
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg p-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                                    value={data.phone} 
                                    onChange={e => setData('phone', e.target.value)} 
                                    placeholder="+260 97X XXX XXX" 
                                />
                                {errors.phone && <span className="text-red-500 text-xs font-medium">{errors.phone}</span>}
                            </div>

                            {/* Agency Name */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">Agency Name (Optional)</label>
                                <input 
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg p-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                                    value={data.agency_name} 
                                    onChange={e => setData('agency_name', e.target.value)} 
                                    placeholder="e.g. Prime Real Estate" 
                                />
                                {errors.agency_name && <span className="text-red-500 text-xs font-medium">{errors.agency_name}</span>}
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-2 border-t border-gray-100 pt-6">
                            <label className="text-sm font-semibold text-gray-700">Initial Password *</label>
                            <input 
                                type="password"
                                className="w-full md:w-1/2 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg p-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                                value={data.password} 
                                onChange={e => setData('password', e.target.value)} 
                                required 
                                placeholder="Min. 8 characters" 
                            />
                            {errors.password && <span className="text-red-500 text-xs font-medium">{errors.password}</span>}
                        </div>

                        <div className="pt-4 border-t border-gray-100 mt-6">
                            <button type="submit" disabled={processing}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-bold shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                                {processing ? 'Creating...' : 'Create Agent Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
