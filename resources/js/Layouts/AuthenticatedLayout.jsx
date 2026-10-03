import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import {
    FaHome,
    FaUser,
    FaSignOutAlt,
    FaSearch,
    FaHeart,
    FaBuilding,
    FaChevronLeft,
    FaChevronRight,
} from 'react-icons/fa';

function NavItem({ icon: Icon, label, href }) {
    const { url } = usePage();
    const isActive = url === href || url.startsWith(href + '/');
    return (
        <Link href={href} className={`flex flex-col items-center p-2 min-w-[64px] ${isActive ? 'text-orange-500' : 'text-gray-500 hover:text-orange-500 transition-colors'}`}>
            <Icon className="text-xl mb-1" />
            <span className="text-[10px] font-medium">{label}</span>
        </Link>
    );
}

function SidebarLink({ href, icon: Icon, label, collapsed }) {
    const { url } = usePage();
    const isActive = url === href || (href !== '/' && url.startsWith(href));

    return (
        <Link
            href={href}
            title={collapsed ? label : undefined}
            className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                transition-all duration-200 group relative
                ${isActive
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                }
                ${collapsed ? 'justify-center' : ''}
            `}
        >
            <Icon className={`text-lg flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-orange-500'}`} />
            {!collapsed && <span className="truncate">{label}</span>}

            {/* Tooltip when collapsed */}
            {collapsed && (
                <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {label}
                </div>
            )}
        </Link>
    );
}

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [collapsed, setCollapsed] = useState(false);

    // Dynamic links based on user role
    const NAV_LINKS = user.role === 'admin' ? [
        { href: route('admin.dashboard'), icon: FaHome, label: 'Dashboard' },
    ] : user.role === 'agent' ? [
        { href: route('agent.properties.index'), icon: FaBuilding, label: 'Properties' },
    ] : [
        { href: '/', icon: FaSearch, label: 'Explore' },
        { href: route('student.dashboard'), icon: FaHeart, label: 'Favorites' },
    ];

    return (
        <div className="min-h-screen w-full flex flex-col bg-gray-50">
            {/* ── Sidebar (desktop only) ────────────────────────────────── */}
            <aside
                className={`
                    hidden md:flex flex-col fixed left-0 top-0 h-screen z-20
                    bg-white border-r border-gray-200
                    transition-all duration-300
                    ${collapsed ? 'w-[72px]' : 'w-56'}
                `}
            >
                {/* Logo */}
                <div className={`flex items-center h-16 px-4 border-b border-gray-100 ${collapsed ? 'justify-center' : 'gap-2'}`}>
                    <Link href="/" className="flex items-center gap-2 no-underline">
                        <ApplicationLogo className="h-8 w-auto" showText={!collapsed} />
                    </Link>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
                    {NAV_LINKS.map(({ href, icon, label }) => (
                        <SidebarLink key={href} href={href} icon={icon} label={label} collapsed={collapsed} />
                    ))}
                    <SidebarLink href={route('profile.edit')} icon={FaUser} label="Profile" collapsed={collapsed} />
                </nav>

                {/* User profile + logout */}
                <div className="px-3 py-4 border-t border-gray-100 space-y-1">
                    {!collapsed && (
                        <div className="flex items-center gap-3 px-3 py-2 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 uppercase">
                                {user.name?.[0]}
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-sm font-semibold text-gray-900 truncate">
                                    {user.name}
                                </div>
                                <div className="text-xs text-gray-400 truncate">{user.email}</div>
                            </div>
                        </div>
                    )}

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        title={collapsed ? 'Log Out' : undefined}
                        className={`
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                            text-red-500 hover:bg-red-50 transition-colors group relative
                            ${collapsed ? 'justify-center' : ''}
                        `}
                    >
                        <FaSignOutAlt className="text-lg flex-shrink-0" />
                        {!collapsed && <span>Log Out</span>}
                        {collapsed && (
                            <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                                Log Out
                            </div>
                        )}
                    </Link>
                </div>

                {/* Collapse toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow text-gray-500 hover:text-orange-500"
                >
                    {collapsed
                        ? <FaChevronRight className="text-[10px]" />
                        : <FaChevronLeft className="text-[10px]" />
                    }
                </button>
            </aside>

            {/* ── Main area (pushed right by sidebar width) ─────────────── */}
            <div
                className={`
                    flex flex-col flex-1 min-h-screen transition-all duration-300
                    ${collapsed ? 'md:ml-[72px]' : 'md:ml-56'}
                `}
            >
                {/* Mobile top bar */}
                <header className="md:hidden flex items-center justify-between px-4 h-14 bg-white border-b border-gray-200 sticky top-0 z-10">
                    <Link href="/" className="no-underline">
                        <ApplicationLogo className="h-7 w-auto" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs uppercase">
                            {user.name?.[0]}
                        </div>
                    </div>
                </header>

                {header && (
                    <div className="bg-white border-b border-gray-200 px-8 py-6 hidden md:block">
                        {header}
                    </div>
                )}

                {/* Page Content */}
                <main className="mb-16 md:mb-0 p-4 md:p-8">
                    {children}
                </main>
            </div>

            {/* ── Bottom tab bar (mobile only) ──────────────────────────── */}
            <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:hidden z-50">
                <div className="flex justify-around py-1">
                    {NAV_LINKS.map(({ href, icon, label }) => (
                        <NavItem key={href} icon={icon} label={label} href={href} />
                    ))}
                    <NavItem icon={FaUser} label="Profile" href={route('profile.edit')} />
                </div>
            </nav>
        </div>
    );
}
