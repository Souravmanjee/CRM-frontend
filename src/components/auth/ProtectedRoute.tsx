import { useEffect, useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useBusinessStore } from '../../store/businessStore';

export const ProtectedRoute = () => {
    const { isAuthenticated, isLoading: authLoading } = useAuthStore();
    const { businesses, fetchBusinesses, isLoading: businessLoading } = useBusinessStore();
    const location = useLocation();
    const hasFetched = useRef(false);

    useEffect(() => {
        if (isAuthenticated && !hasFetched.current) {
            hasFetched.current = true;
            fetchBusinesses();
        }
    }, [isAuthenticated, fetchBusinesses]);

    // Only block on auth loading (milliseconds), not business loading (network IO)
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-bg-dark">
                <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If still loading businesses and we don't know yet - show a lightweight top bar loader
    if (businessLoading && !hasFetched.current) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-bg-dark">
                <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    // After fetch: if no businesses and not on setup page, redirect to setup
    if (!businessLoading && businesses.length === 0 && location.pathname !== '/setup') {
        return <Navigate to="/setup" replace />;
    }

    return <Outlet />;
};
