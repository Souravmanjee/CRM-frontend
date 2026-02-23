import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Mail, Lock, Loader2, User, Briefcase } from 'lucide-react';
import { apiClient } from '../api/client';

export const Signup = () => {
    const [displayName, setDisplayName] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();
    const { setAuth } = useAuthStore();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        try {
            const response = await apiClient.post('/auth/register', {
                email,
                password,
                displayName,
                businessName: businessName || undefined
            });
            const { user, token } = response.data;
            setAuth(user, token);
            navigate('/');
        } catch (error: any) {
            console.error('Signup error:', error.response?.data || error.message);
            setErrorMsg(error.response?.data?.message || 'Failed to create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-[480px] lg:px-20 mx-auto lg:mx-0 py-12">
                <div className="w-full max-w-sm mx-auto">
                    <div className="mb-10 text-center lg:text-left">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 mx-auto lg:mx-0 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary-500/20 mb-6">
                            S
                        </div>
                        <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">
                            Create an account
                        </h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Join Suman's CRM to manage your business operations
                        </p>
                    </div>

                    <div className="mt-8">
                        {errorMsg ? (
                            <div className="mb-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm font-medium border border-red-100 dark:border-red-900/50">
                                {errorMsg}
                            </div>
                        ) : null}

                        <form onSubmit={handleSignup} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="input-field pl-10 h-11"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    New Business Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Briefcase className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                        className="input-field pl-10 h-11"
                                        placeholder="Doe Enterprises"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Email address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input-field pl-10 h-11"
                                        placeholder="admin@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input-field pl-10 h-11"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary w-full h-11 flex items-center justify-center text-base"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin h-5 w-5" />
                                    ) : (
                                        'Create account'
                                    )}
                                </button>
                            </div>

                            <div className="mt-6 text-center text-sm">
                                <span className="text-slate-500 dark:text-slate-400">Already have an account? </span>
                                <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                                    Sign in instead
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="hidden lg:block relative w-0 flex-1 bg-slate-50 dark:bg-bg-dark">
                <div className="absolute inset-0 h-full w-full object-cover p-6">
                    <div className="w-full h-full rounded-3xl bg-primary-900 overflow-hidden relative shadow-2xl">
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-800 opacity-50 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-primary-700 opacity-30 blur-3xl"></div>

                        <div className="absolute inset-0 flex items-center justify-center flex-col text-center p-12 z-10">
                            <h2 className="text-4xl lg:text-5xl font-heading font-bold text-white mb-6 leading-tight">
                                Start scaling today<br />
                                <span className="text-primary-300">with Suman's CRM.</span>
                            </h2>
                            <p className="text-lg text-primary-100 max-w-xl">
                                Instantly generate analytical reports, track daily operations, and streamline workflows.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
