import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    Users,
    Fuel,
    HardHat,
    ShoppingCart,
    PlusCircle,
    Wallet,
    Settings,
    FileSpreadsheet,
    LogOut
} from 'lucide-react';
import { SidebarItem } from './SidebarItem';
import { useBusinessStore } from '../../store/businessStore';
import { useAuthStore } from '../../store/authStore';

export const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { activeBusiness } = useBusinessStore();
    const { clearAuth } = useAuthStore();

    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Briefcase, label: 'Work', path: '/work' },
        { icon: Users, label: 'Staff', path: '/staff' },
        { icon: Fuel, label: 'Diesel', path: '/diesel' },
        { icon: Fuel, label: 'Petrol', path: '/petrol' },
        { icon: HardHat, label: 'Labour', path: '/labour' },
        { icon: ShoppingCart, label: 'Ration', path: '/ration' },
        { icon: PlusCircle, label: 'Extra', path: '/extra' },
        { icon: Wallet, label: 'Cash Register', path: '/cash-register' },
        { icon: FileSpreadsheet, label: 'Reports', path: '/reports' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="w-64 border-r border-slate-200 dark:border-border-dark bg-white dark:bg-bg-dark-secondary hidden lg:flex flex-col h-full shadow-sm">
            <div
                className="p-6 border-b border-slate-200 dark:border-border-dark flex items-center gap-3 cursor-pointer"
                onClick={() => navigate('/')}
            >
                <img
                    src="/logo.jpg"
                    alt="Logo"
                    className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-slate-200/50 dark:shadow-none"
                />
                <div>
                    <h1 className="font-heading font-bold text-xl tracking-tight text-slate-900 dark:text-white">Suman's CRM</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Business Platform</p>
                </div>
            </div>

            <nav className="py-6 flex flex-col gap-1 flex-1 overflow-y-auto">
                <div className="px-6 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Main Menu
                </div>
                {menuItems.map((item) => (
                    <SidebarItem
                        key={item.path}
                        icon={item.icon}
                        label={item.label}
                        active={location.pathname === item.path}
                        onClick={() => navigate(item.path)}
                    />
                ))}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-border-dark flex items-center justify-between">
                <div className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 truncate mr-2">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                        {activeBusiness?.name || 'Loading...'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 truncate">Premium Plan</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="p-3 rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </aside>
    );
};
