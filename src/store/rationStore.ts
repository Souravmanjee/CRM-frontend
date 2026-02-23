import { create } from 'zustand';
import { apiClient } from '../api/client';
import { useBusinessStore } from './businessStore';

export interface RationEntry {
    _id: string;
    date: string;
    name: string;
    amount: number;
    remark?: string;
}

interface RationState {
    rations: RationEntry[];
    isLoading: boolean;
    error: string | null;

    fetchRations: () => Promise<void>;
    addRation: (data: Partial<RationEntry>) => Promise<void>;
    updateRation: (id: string, data: Partial<RationEntry>) => Promise<void>;
    deleteRation: (id: string) => Promise<void>;
}

export const useRationStore = create<RationState>((set, get) => ({
    rations: [],
    isLoading: false,
    error: null,

    fetchRations: async () => {
        const activeBusiness = useBusinessStore.getState().activeBusiness;
        if (!activeBusiness) return;
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/ration');
            set({ rations: response.data, isLoading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to fetch rations', isLoading: false });
        }
    },

    addRation: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.post('/ration', data);
            await get().fetchRations();
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to add ration', isLoading: false });
            throw err;
        }
    },

    updateRation: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.put(`/ration/${id}`, data);
            await get().fetchRations();
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to update ration', isLoading: false });
            throw err;
        }
    },

    deleteRation: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.delete(`/ration/${id}`);
            await get().fetchRations();
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to delete ration', isLoading: false });
            throw err;
        }
    }
}));
