import { Menu, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
    title?: string;
    onMenuClick?: () => void;
}

export const Topbar = ({ title = 'Overview', onMenuClick }: TopbarProps) => {
    const { clearAuth } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };
    return (
        <header className="h-16 border-b border-slate-200 dark:border-border-dark bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-md sticky top-0 px-4 md:px-8 flex items-center justify-between z-10 transition-colors">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <Menu size={20} />
                </button>
                <h2 className="font-heading font-semibold text-lg md:text-xl text-slate-800 dark:text-slate-100">{title}</h2>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
                <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors md:hidden"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>

                <button
                    onClick={() => navigate('/settings')}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Settings"
                >
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400">
                        <User size={18} />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden md:block">Admin</span>
                </button>
            </div>
        </header>
    );
};
