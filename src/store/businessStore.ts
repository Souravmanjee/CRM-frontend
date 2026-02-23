import { create } from 'zustand';
import { apiClient } from '../api/client';

export interface Business {
    _id: string;
    ownerId: string;
    name: string;
    businessType?: string;
    phone?: string;
    email?: string;
    address?: string;
    logo?: string;
    themeColor?: string;
    createdAt: string;
}

interface BusinessState {
    businesses: Business[];
    activeBusiness: Business | null;
    isLoading: boolean;
    error: string | null;

    fetchBusinesses: () => Promise<void>;
    setActiveBusiness: (business: Business) => void;
    createBusiness: (data: Partial<Business>) => Promise<Business>;
    updateBusiness: (id: string, data: Partial<Business>) => Promise<Business>;
}

// Persist active business so sidebar/pages don't flicker on reload
const storedBusiness = (() => {
    try {
        const raw = localStorage.getItem('activeBusiness');
        if (raw) return JSON.parse(raw) as Business;
    } catch { }
    return null;
})();

export const useBusinessStore = create<BusinessState>((set, get) => ({
    businesses: storedBusiness ? [storedBusiness] : [],
    activeBusiness: storedBusiness,
    isLoading: false,
    error: null,

    fetchBusinesses: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/businesses');
            const businesses: Business[] = response.data;
            const active = businesses.length > 0 ? businesses[0] : null;
            if (active) {
                try { localStorage.setItem('activeBusiness', JSON.stringify(active)); } catch { }
            }
            set({ businesses, activeBusiness: active, isLoading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to fetch businesses', isLoading: false });
        }
    },

    setActiveBusiness: (business) => {
        try { localStorage.setItem('activeBusiness', JSON.stringify(business)); } catch { }
        set({ activeBusiness: business });
    },

    createBusiness: async (data: Partial<Business>) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.post('/businesses', data);
            const newBiz: Business = response.data;
            try { localStorage.setItem('activeBusiness', JSON.stringify(newBiz)); } catch { }
            set((state) => ({
                businesses: [newBiz, ...state.businesses],
                activeBusiness: state.activeBusiness ? state.activeBusiness : newBiz,
                isLoading: false
            }));
            return newBiz;
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to create business', isLoading: false });
            throw err;
        }
    },

    updateBusiness: async (id: string, data: Partial<Business>) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.put(`/businesses/${id}`, data);
            const updated: Business = response.data;
            set((state) => ({
                businesses: state.businesses.map(b => b._id === id ? updated : b),
                activeBusiness: state.activeBusiness?._id === id ? updated : state.activeBusiness,
                isLoading: false
            }));
            if (get().activeBusiness?._id === id) {
                try { localStorage.setItem('activeBusiness', JSON.stringify(updated)); } catch { }
            }
            return updated;
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to update business', isLoading: false });
            throw err;
        }
    }
}));
