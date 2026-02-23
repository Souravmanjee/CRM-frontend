import { create } from 'zustand';
import { apiClient } from '../api/client';
import { useBusinessStore } from './businessStore';

export interface WorkEntry {
    _id: string;
    date: string;
    diesel: number;
    depth: number;
    fiveCasing: number;
    sevenCasing: number;
    srpm: number;
    erpm: number;
    hour: number;
    avg: number;
    payment: number;
    agent: string;
    location: string;
    rate: number;
    loringRate: number;
    stepRate: number;
    extra: number;
    depthAmount: number;
    fiveCasingRate: number;
    sevenRate: number;
    casingAmount: number;
    totalBill: number;
    due: number;
    remark?: string;
    notes?: string;
    casingPaid: number;
    casingDue: number;
}

interface WorkState {
    works: WorkEntry[];
    isLoading: boolean;
    error: string | null;

    fetchWorks: () => Promise<void>;
    addWork: (data: Partial<WorkEntry>) => Promise<void>;
    updateWork: (id: string, data: Partial<WorkEntry>) => Promise<void>;
    deleteWork: (id: string) => Promise<void>;
}

export const useWorkStore = create<WorkState>((set, get) => ({
    works: [],
    isLoading: false,
    error: null,

    fetchWorks: async () => {
        const activeBusiness = useBusinessStore.getState().activeBusiness;
        if (!activeBusiness) return;
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/work');
            set({ works: response.data, isLoading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to fetch works', isLoading: false });
        }
    },

    addWork: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.post('/work', data);
            await get().fetchWorks();
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to add work', isLoading: false });
            throw err;
        }
    },

    updateWork: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.put(`/work/${id}`, data);
            await get().fetchWorks();
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to update work', isLoading: false });
            throw err;
        }
    },

    deleteWork: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.delete(`/work/${id}`);
            await get().fetchWorks();
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to delete work', isLoading: false });
            throw err;
        }
    }
}));
