import { create } from 'zustand';
import { apiClient } from '../api/client';
import { useBusinessStore } from './businessStore';

export interface ExtraEntry {
    _id: string;
    date: string;
    expenseName: string;
    amount: number;
    remark?: string;
}

interface ExtraState {
    logs: ExtraEntry[];
    isLoading: boolean;
    error: string | null;

    fetchLogs: () => Promise<void>;
    addLog: (data: Partial<ExtraEntry>) => Promise<void>;
    updateLog: (id: string, data: Partial<ExtraEntry>) => Promise<void>;
    deleteLog: (id: string) => Promise<void>;
}

export const useExtraStore = create<ExtraState>((set, get) => ({
    logs: [],
    isLoading: false,
    error: null,

    fetchLogs: async () => {
        const activeBusiness = useBusinessStore.getState().activeBusiness;
        if (!activeBusiness) return;
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/extra');
            set({ logs: response.data, isLoading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to fetch extra expenses', isLoading: false });
        }
    },

    addLog: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.post('/extra', data);
            await get().fetchLogs();
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to add extra expense', isLoading: false });
            throw err;
        }
    },

    updateLog: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.put(`/extra/${id}`, data);
            await get().fetchLogs();
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to update extra expense', isLoading: false });
            throw err;
        }
    },

    deleteLog: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.delete(`/extra/${id}`);
            await get().fetchLogs();
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to delete extra expense', isLoading: false });
            throw err;
        }
    }
}));
