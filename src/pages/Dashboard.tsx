import {
    TrendingUp,
    TrendingDown,
    Users,
    Wallet,
    HardHat,
    Fuel,
    ShoppingCart,
    PlusCircle,
    Banknote,
    AlertCircle
} from 'lucide-react';
import { useEffect } from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import { useBusinessStore } from '../store/businessStore';

export const Dashboard = () => {
    const summary = useDashboardStore(state => state.summary);
    const fetchSummary = useDashboardStore(state => state.fetchSummary);
    const activeBusiness = useBusinessStore(state => state.activeBusiness);

    useEffect(() => {
        if (activeBusiness) {
            fetchSummary();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeBusiness?._id]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    };

    const isProfitList = summary ? summary.NetProfitLoss >= 0 : true;

    const cards = [
        { label: 'Total Work Revenue', value: summary ? formatCurrency(summary.TotalWorkRevenue) : '₹0', icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Total Pending Amount', value: summary ? formatCurrency(summary.TotalPendingAmount) : '₹0', icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Net Profit / Loss', value: summary ? formatCurrency(summary.NetProfitLoss) : '₹0', icon: isProfitList ? TrendingUp : TrendingDown, color: isProfitList ? 'text-emerald-500' : 'text-rose-500', bg: isProfitList ? 'bg-emerald-500/10' : 'bg-rose-500/10' },
        { label: 'Cash Balance', value: summary ? formatCurrency(summary.CashBalance) : '₹0', icon: Banknote, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { label: 'Total Diesel Expense', value: summary ? formatCurrency(summary.TotalDieselExpense) : '₹0', icon: Fuel, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { label: 'Total Petrol Expense', value: summary ? formatCurrency(summary.TotalPetrolExpense) : '₹0', icon: Fuel, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { label: 'Total Labour', value: summary ? formatCurrency(summary.TotalLabourExpense) : '₹0', icon: HardHat, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { label: 'Total Ration', value: summary ? formatCurrency(summary.TotalRationExpense) : '₹0', icon: ShoppingCart, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { label: 'Total Staff Salary', value: summary ? formatCurrency(summary.TotalStaffSalary) : '₹0', icon: Users, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { label: 'Total Extra', value: summary ? formatCurrency(summary.TotalExtraExpense) : '₹0', icon: PlusCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-slate-800 dark:text-white">Active Period Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Suman's CRM financial summary for all operations.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {cards.map((stat, i) => (
                    <div key={i} className="card p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center justify-between">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</h3>
                            <p className={`text-2xl font-heading font-bold mt-1 ${stat.label === 'Net Profit / Loss'
                                    ? (isProfitList ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')
                                    : 'text-slate-800 dark:text-white'
                                }`}>
                                {stat.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
