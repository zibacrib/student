import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FaUserPlus, FaUserShield, FaUserSlash, FaTrash, FaCheckCircle } from 'react-icons/fa';

export default function AgentsIndex({ auth, agents }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-bold text-2xl text-gray-900 leading-tight">Manage Agents</h2>}
        >
            <Head title="Agents — Admin" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <p className="text-gray-600 text-lg">View, suspend, or remove agent accounts.</p>
                    </div>
                    <Link href={route('admin.agents.create')} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg shadow-sm transition-colors flex items-center gap-2">
                        <FaUserPlus /> Create Agent
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-xs font-bold">
                                <tr>
                                    <th className="px-6 py-4">Agent</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4 text-center">Listings</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {agents.map(agent => (
                                    <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{agent.name}</div>
                                            <div className="text-gray-500 text-xs mt-0.5">{agent.agency_name || 'Independent Agent'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900">{agent.email}</div>
                                            <div className="text-gray-500 text-xs mt-0.5">{agent.phone || 'No phone'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-gray-100 text-gray-700 font-bold px-3 py-1 rounded-full text-xs">
                                                {agent.properties_count}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                                agent.is_suspended 
                                                ? 'bg-red-50 text-red-600 border border-red-100' 
                                                : 'bg-green-50 text-green-600 border border-green-100'
                                            }`}>
                                                {agent.is_suspended ? 'Suspended' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <AgentActions agent={agent} />
                                        </td>
                                    </tr>
                                ))}
                                {agents.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            No agent accounts created yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function AgentActions({ agent }) {
    const { post, delete: destroy, processing } = useForm();

    return (
        <div className="flex justify-end gap-2">
            {agent.is_suspended ? (
                <button onClick={() => post(route('admin.agents.unsuspend', agent.id))} disabled={processing}
                    className="flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 disabled:opacity-50 border border-green-200 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors">
                    <FaCheckCircle /> Unsuspend
                </button>
            ) : (
                <button onClick={() => post(route('admin.agents.suspend', agent.id))} disabled={processing}
                    className="flex items-center gap-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 disabled:opacity-50 border border-yellow-200 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors">
                    <FaUserSlash /> Suspend
                </button>
            )}
            <button onClick={() => {
                if (confirm(`Are you sure you want to completely delete ${agent.name} and ALL of their listings? This action cannot be undone.`)) {
                    destroy(route('admin.agents.delete', agent.id));
                }
            }} disabled={processing} 
                className="flex items-center gap-1.5 bg-white hover:bg-red-50 text-red-500 hover:text-red-600 disabled:opacity-50 border border-red-200 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors">
                <FaTrash /> Delete
            </button>
        </div>
    );
}
