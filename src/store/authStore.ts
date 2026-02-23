import { create } from 'zustand';

interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    setAuth: (user: User, token: string) => void;
    clearAuth: () => void;
    setLoading: (loading: boolean) => void;
}

// Hydrate from localStorage immediately (synchronous) so initial load is instant
const stored = (() => {
    try {
        const raw = localStorage.getItem('auth');
        if (raw) return JSON.parse(raw) as { user: User; token: string };
    } catch { }
    return null;
})();

export const useAuthStore = create<AuthState>((set) => ({
    user: stored?.user ?? null,
    token: stored?.token ?? null,
    isAuthenticated: !!stored?.token,
    isLoading: false, // Never block the initial paint

    setAuth: (user, token) => {
        // Persist token & user so page refresh keeps you logged in
        try { localStorage.setItem('auth', JSON.stringify({ user, token })); } catch { }
        set({ user, token, isAuthenticated: true, isLoading: false });
    },
    clearAuth: () => {
        try { localStorage.removeItem('auth'); } catch { }
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    },
    setLoading: (isLoading) => set({ isLoading }),
}));
