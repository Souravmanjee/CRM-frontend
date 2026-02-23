import { useNavigate } from 'react-router-dom';
import { useBusinessStore } from '../store/businessStore';
import { Building2, Plus, Loader2 } from 'lucide-react';

export const BusinessSetup = () => {
    const { createBusiness, isLoading, error } = useBusinessStore();
    const navigate = useNavigate();

    const handleCreateDefault = async () => {
        try {
            await createBusiness({ name: 'My Default Business' });
            navigate('/');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-bg-dark p-4">
            <div className="card p-8 w-full max-w-md text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 mx-auto mb-6">
                    <Building2 size={32} />
                </div>
                <h1 className="text-2xl font-heading font-bold mb-2">Welcome to SaaSFlow</h1>
                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                    Let's get started by setting up your first business workspace. You can change these details later.
                </p>

                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

                <button
                    onClick={handleCreateDefault}
                    disabled={isLoading}
                    className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-base"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                    Create Default Business
                </button>
            </div>
        </div>
    );
};
