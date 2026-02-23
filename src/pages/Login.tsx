import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Mail, Lock, Loader2 } from 'lucide-react';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call for demo purposes
        setTimeout(() => {
            setAuth({ uid: 'test-admin-123', email, displayName: 'Demo Admin' }, 'dev-token-123');
            setLoading(false);
            navigate('/');
        }, 1000);
    };

    return (
        <div className="flex min-h-screen">
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-[480px] lg:px-20 mx-auto lg:mx-0">
                <div className="w-full max-w-sm mx-auto">
                    <div className="mb-10 text-center lg:text-left">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 mx-auto lg:mx-0 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary-500/20 mb-6">
                            S
                        </div>
                        <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Sign in to manage your business operations
                        </p>
                    </div>

                    <div className="mt-8">
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Email address
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
                                    Password
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

                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary w-full h-11 flex items-center justify-center text-base"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin h-5 w-5" />
                                    ) : (
                                        'Sign in'
                                    )}
                                </button>
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
                                All your business tools.<br />
                                <span className="text-primary-300">One intelligent platform.</span>
                            </h2>
                            <p className="text-lg text-primary-100 max-w-xl">
                                Manage ledgers, track inventory, process payments, and oversee staff from any device, anywhere in the world.
                            </p>

                            <div className="mt-12 glass-panel p-6 w-full max-w-md rounded-2xl border border-white/10 text-left">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="font-semibold text-white">Monthly Growth</div>
                                    <div className="text-emerald-400 font-medium">+24.5%</div>
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary-400 w-3/4 rounded-full"></div>
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-primary-200">
                                    <span>Current Target</span>
                                    <span>$12,500</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
