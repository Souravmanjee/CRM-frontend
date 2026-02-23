import { create } from 'zustand';
import { apiClient } from '../api/client';
import { useBusinessStore } from './businessStore';

export interface CashRegisterEntry {
    _id: string;
    date: string;
    particulars: string;
    amount: number;
    transactionType: 'Cash In' | 'Cash Out';
    runningBalance: number;
    remark?: string;
}

interface CashRegisterState {
    entries: CashRegisterEntry[];
    isLoading: boolean;
    error: string | null;

    fetchEntries: () => Promise<void>;
    addEntry: (data: Partial<CashRegisterEntry>) => Promise<void>;
    updateEntry: (id: string, data: Partial<CashRegisterEntry>) => Promise<void>;
    deleteEntry: (id: string) => Promise<void>;
}

export const useCashRegisterStore = create<CashRegisterState>((set, get) => ({
    entries: [],
    isLoading: false,
    error: null,

    fetchEntries: async () => {
        const activeBusiness = useBusinessStore.getState().activeBusiness;
        if (!activeBusiness) return;
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/cash-register');

            // Sort ascending by date, then createdAt for stable chronological order
            const sortedEntries = response.data.sort((a: any, b: any) => {
                const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
                if (dateDiff === 0) {
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                }
                return dateDiff;
            });

            // Calculate running balance
            let currentBalance = 0;
            const entriesWithBalance = sortedEntries.map((entry: any) => {
                if (entry.transactionType === 'Cash In') {
                    currentBalance += (entry.amount || 0);
                } else if (entry.transactionType === 'Cash Out') {
                    currentBalance -= (entry.amount || 0);
                }
                return { ...entry, runningBalance: currentBalance };
            });

            // Sort descending for UI display
            const displayEntries = entriesWithBalance.sort((a: any, b: any) => {
                const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
                if (dateDiff === 0) {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                }
                return dateDiff;
            });

            set({ entries: displayEntries, isLoading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to fetch cash register entries', isLoading: false });
        }
    },

    addEntry: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.post('/cash-register', data);
            await get().fetchEntries();
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to add entry', isLoading: false });
            throw err;
        }
    },

    updateEntry: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.put(`/cash-register/${id}`, data);
            await get().fetchEntries();
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to update entry', isLoading: false });
            throw err;
        }
    },

    deleteEntry: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.delete(`/cash-register/${id}`);
            await get().fetchEntries();
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to delete entry', isLoading: false });
            throw err;
        }
    }
}));
