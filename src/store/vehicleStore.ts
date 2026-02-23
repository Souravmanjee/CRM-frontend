import { create } from 'zustand';
import { apiClient } from '../api/client';
import { useBusinessStore } from './businessStore';

export interface VehicleLog {
    _id: string;
    type: 'diesel' | 'petrol';
    date: string;
    vehicleName: string;
    agentName: string;
    pumpName: string;
    liter: number;
    rate: number;
    amount: number;
    remark?: string;
}

interface VehicleState {
    logs: VehicleLog[];
    isLoading: boolean;
    error: string | null;

    fetchLogs: (type?: 'diesel' | 'petrol') => Promise<void>;
    addLog: (data: Partial<VehicleLog>) => Promise<void>;
    updateLog: (id: string, data: Partial<VehicleLog>) => Promise<void>;
    deleteLog: (id: string) => Promise<void>;
}

export const useVehicleStore = create<VehicleState>((set, get) => ({
    logs: [],
    isLoading: false,
    error: null,

    fetchLogs: async (type) => {
        const activeBusiness = useBusinessStore.getState().activeBusiness;
        if (!activeBusiness) return;
        set({ isLoading: true, error: null });
        try {
            const endpoint = type ? `/vehicles?type=${type}` : '/vehicles';
            const response = await apiClient.get(endpoint);
            set({ logs: response.data, isLoading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to fetch vehicle logs', isLoading: false });
        }
    },

    addLog: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.post('/vehicles', data);
            await get().fetchLogs(); // Note: This refetches all types if no type is saved in state
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to add log', isLoading: false });
            throw err;
        }
    },

    updateLog: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.put(`/vehicles/${id}`, data);
            await get().fetchLogs();
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to update log', isLoading: false });
            throw err;
        }
    },

    deleteLog: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.delete(`/vehicles/${id}`);
            await get().fetchLogs();
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to delete log', isLoading: false });
            throw err;
        }
    }
}));
