import { create } from 'zustand';
import { apiClient } from '../api/client';
import { useBusinessStore } from './businessStore';

export interface DashboardSummary {
    TotalWorkRevenue: number;
    TotalPendingAmount: number;
    TotalDieselExpense: number;
    TotalPetrolExpense: number;
    TotalLabourExpense: number;
    TotalRationExpense: number;
    TotalExtraExpense: number;
    TotalStaffSalary: number;
    CashBalance: number;
    NetProfitLoss: number;
}

interface DashboardState {
    summary: DashboardSummary | null;
    isLoading: boolean;
    error: string | null;

    fetchSummary: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    summary: null,
    isLoading: false,
    error: null,

    fetchSummary: async () => {
        const activeBusiness = useBusinessStore.getState().activeBusiness;
        if (!activeBusiness) return;
        set({ isLoading: true, error: null });
        try {
            apiClient.defaults.headers.common['x-business-id'] = activeBusiness._id;
            const response = await apiClient.get('/dashboard/summary');
            set({ summary: response.data, isLoading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to fetch summary', isLoading: false });
        }
    }
}));
