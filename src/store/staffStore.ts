import { create } from 'zustand';
import { apiClient } from '../api/client';
import { useBusinessStore } from './businessStore';

export interface Employee {
    _id: string;
    present: boolean;
    employeeName: string;
    designation: string;
    joiningDate: string;
    mobileNumber: string;
    address: string;
    leaveDate?: string;
    workingDays: number;
    holidays: number;
    totalDaysWorked: number;
    monthlySalary: number;
    perDaySalary: number;
    totalSalary: number;
    advancePaid: number;
    dueAmount: number;
}

interface StaffState {
    employees: Employee[];
    isLoading: boolean;
    error: string | null;

    fetchEmployees: () => Promise<void>;
    addEmployee: (data: Partial<Employee>) => Promise<void>;
    updateEmployee: (id: string, data: Partial<Employee>) => Promise<void>;
    deleteEmployee: (id: string) => Promise<void>;
}

export const useStaffStore = create<StaffState>((set, get) => ({
    employees: [],
    isLoading: false,
    error: null,

    fetchEmployees: async () => {
        const activeBusiness = useBusinessStore.getState().activeBusiness;
        if (!activeBusiness) return;
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/staff');
            set({ employees: response.data, isLoading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to fetch employees', isLoading: false });
        }
    },

    addEmployee: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.post('/staff', data);
            await get().fetchEmployees();
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to add employee', isLoading: false });
            throw err;
        }
    },

    updateEmployee: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.put(`/staff/${id}`, data);
            await get().fetchEmployees();
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to update employee', isLoading: false });
            throw err;
        }
    },

    deleteEmployee: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.delete(`/staff/${id}`);
            await get().fetchEmployees();
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to delete employee', isLoading: false });
            throw err;
        }
    }
}));
