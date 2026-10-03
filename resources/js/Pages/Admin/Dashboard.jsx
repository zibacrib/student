import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { FaUsers, FaBuilding, FaClipboardList, FaGraduationCap } from 'react-icons/fa';

export default function AdminDashboard({ auth, stats }) {
    const statCards = [
        { label: 'Total Agents', value: stats.total_agents, icon: FaUsers, color: 'text-blue-600', bg: 'bg-blue-50', sub: `${stats.suspended_agents} suspended` },
        { label: 'Published Listings', value: stats.published, icon: FaBuilding, color: 'text-green-600', bg: 'bg-green-50', sub: `${stats.pending_review} awaiting review` },
        { label: 'Students', value: stats.total_students, icon: FaGraduationCap, color: 'text-purple-600', bg: 'bg-purple-50', sub: 'registered accounts' },
        { label: 'Total Properties', value: stats.total_properties, icon: FaClipboardList, color: 'text-orange-600', bg: 'bg-orange-50', sub: 'all statuses' },
    ];

    return (
        <AuthenticatedLayout
            header={<h2 className="font-bold text-2xl text-gray-900 leading-tight">Admin Overview</h2>}
        >
            <Head title="Admin Dashboard — ZibaCrib" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="mb-8">
                    <p className="text-gray-600 text-lg">Welcome back, Admin! Here is the current status of the platform.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {statCards.map(card => {
                        const Icon = card.icon;
                        return (
                            <div key={card.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-4 rounded-xl ${card.bg}`}>
                                        <Icon className={`text-2xl ${card.color}`} />
                                    </div>
                                    <span className="text-3xl font-black text-gray-900">{card.value}</span>
                                </div>
                                <h3 className="font-bold text-gray-800 text-lg">{card.label}</h3>
                                <p className="text-sm text-gray-500 mt-1">{card.sub}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <Link href={route('admin.agents')} className="block group">
                        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:border-orange-500 hover:shadow-md transition-all flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                                <span className="text-3xl">👤</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">Manage Agents</h3>
                                <p className="text-gray-500">Create, suspend or remove agents from the platform</p>
                            </div>
                        </div>
                    </Link>

                    <Link href={route('admin.listings.pending')} className="block group">
                        <div className={`bg-white rounded-2xl p-8 border ${stats.pending_review > 0 ? 'border-orange-300 shadow-md' : 'border-gray-200 shadow-sm'} hover:border-orange-500 hover:shadow-md transition-all flex items-center gap-6`}>
                            <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                                <span className="text-3xl">📋</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">Review Listings</h3>
                                <p className={stats.pending_review > 0 ? "text-orange-600 font-medium" : "text-gray-500"}>
                                    {stats.pending_review > 0 ? `${stats.pending_review} pending approval` : 'No pending listings'}
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
