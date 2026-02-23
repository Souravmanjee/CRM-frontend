import type { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

export const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => {
    return (
        <div
            onClick={onClick}
            className={`px-4 py-3 mx-2 rounded-lg font-medium transition-all duration-200 cursor-pointer flex items-center gap-3
        ${active
                    ? 'bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }
      `}
        >
            <Icon size={20} className={active ? 'text-primary-500' : 'text-slate-500'} />
            <span>{label}</span>
        </div>
    );
};
