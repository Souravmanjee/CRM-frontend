import { create } from 'zustand';
import { apiClient } from '../api/client';
import { useBusinessStore } from './businessStore';

export interface LabourEntry {
    _id: string;
    date: string;
    staffName: string;
    amount: number;
    remark?: string;
}

interface LabourState {
    labours: LabourEntry[];
    isLoading: boolean;
    error: string | null;

    fetchLabours: () => Promise<void>;
    addLabour: (data: Partial<LabourEntry>) => Promise<void>;
    updateLabour: (id: string, data: Partial<LabourEntry>) => Promise<void>;
    deleteLabour: (id: string) => Promise<void>;
}

export const useLabourStore = create<LabourState>((set, get) => ({
    labours: [],
    isLoading: false,
    error: null,

    fetchLabours: async () => {
        const activeBusiness = useBusinessStore.getState().activeBusiness;
        if (!activeBusiness) return;
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/labour');
            set({ labours: response.data, isLoading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to fetch labour entries', isLoading: false });
        }
    },

    addLabour: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.post('/labour', data);
            await get().fetchLabours();
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to add labour entry', isLoading: false });
            throw err;
        }
    },

    updateLabour: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.put(`/labour/${id}`, data);
            await get().fetchLabours();
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to update labour entry', isLoading: false });
            throw err;
        }
    },

    deleteLabour: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.delete(`/labour/${id}`);
            await get().fetchLabours();
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to delete labour entry', isLoading: false });
            throw err;
        }
    }
}));
